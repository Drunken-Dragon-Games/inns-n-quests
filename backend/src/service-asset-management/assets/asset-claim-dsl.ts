import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { NativeScript, Transaction, TransactionWitnessSet } from "@emurgo/cardano-serialization-lib-nodejs"
import { Sequelize } from "sequelize"
import { AssetClaim } from "./asset-claim-db.js"
import { OffChainStore } from "./offchain-store-db.js"
import cbor from "cbor"
import crypto from "crypto"
import { AssetStoreDsl } from "./assets-dsl.js"
import { SecureSigningService } from "../../service-secure-signing"
import { failure, Result, success } from "../../tools-utils"
import { LoggingContext } from "../../tools-tracing"
import { cardano, MinimalUTxO, TokenMintOptions } from "../../tools-cardano"
import { ClaimStatus, ClaimerInfo } from "../models.js"

export type AssetClaimDslConfig = {
	feeAddress: string,
	feeAmount: string,
	txTTL: number
}

export type GenAssosiateTxResult = Result<{txId: string}, string>

export type ClaimResult = Result<{ claimId: string, tx: string }, "unknown-policy" | "not-enough-assets">

export type LucidClaimResult = Result<{ claimId: string, tx: string, signature: string }, "unknown-policy" | "not-enough-assets">

export type SubmitClaimSignatureResult = Result<string, "unknown-claim" | "corrupted-tx" | "claim-timed-out" | "claim-already-completed">
 
export class AssetClaimDsl {

	constructor(
		private readonly config: AssetClaimDslConfig,
		private readonly db: Sequelize,
		private readonly blockfrost: BlockFrostAPI,
		private readonly secureSigningService: SecureSigningService,
		private readonly assetStore: AssetStoreDsl,
		//private readonly lucid: Lucid
	){}

	public async userClaims(userId: string, unit: string, page?: number, logger?: LoggingContext): Promise<AssetClaim[]> {
		return AssetClaim.findAll({ where: { userId, unit }, limit: 5, offset: page && page * 5, order: [["createdAt", "DESC"]] })
	}

	public async genAssoiateTx(stakeAddress: string, MinimalUTxOs: MinimalUTxO[], logger?: LoggingContext ): Promise<GenAssosiateTxResult>{
		try{
			const txResult = await cardano.createAuthTransaction(stakeAddress, MinimalUTxOs, this.blockfrost, logger)
			if (txResult.status != "ok") return failure(txResult.reason)
			const txId = Buffer.from(txResult.tx.to_bytes()).toString("hex")	
			return success({ txId})
		}catch(e: any){
			return failure(e.message ?? e)
		}
		
	}

	public async submitAssoiateTx(witness: string, tx: string):Promise<Result<string, string>>{
		try{
			const knownDecoded = Transaction.from_bytes(Buffer.from(tx, "hex"))
			const witnessSet = TransactionWitnessSet.from_bytes(Buffer.from(witness, "hex"))
			const signedTx = cardano.addWitnessesToTransaction(witnessSet, knownDecoded)
			// TODO: this can fail if the tx is already submitted or the utxo is already spent
			// we should handle the error and revert the whole claim
			const txId = await this.blockfrost.txSubmit(signedTx.to_hex())
			return success(txId)
		}catch(e: any){
			return failure(e.message)
		}
		
		
	}

	public async claim(userId: string, stakeAddress: string, asset: { unit: string, policyId: string, quantity?: string}, claimerInfo?: ClaimerInfo, logger?: LoggingContext): Promise<ClaimResult> {
		const policyResponse = await this.secureSigningService.policy(asset.policyId, logger)
		if (policyResponse.status == "unknown-policy") 
			return failure("unknown-policy")
		const transaction = await this.db.transaction()
		const availableAssets = await OffChainStore.findOne({ where: { userId, policyId: asset.policyId, unit: asset.unit }, transaction })
		const quantityToClaim = (asset.quantity ?? availableAssets?.quantity) ?? "0"

		if (availableAssets == null || BigInt(availableAssets.quantity) < BigInt(quantityToClaim)) {
			await transaction.commit()
			return failure("not-enough-assets")
		}

		const buildTx = async (): Promise<string> => {
			const script = NativeScript.from_json(JSON.stringify(policyResponse.policy))
			const mintOptions = this.mintOptBuilder(asset.unit, script, quantityToClaim, claimerInfo)
			const tx = await cardano.createTokenMintTransaction(stakeAddress, mintOptions, this.blockfrost)
  			const hexTx = Buffer.from(tx.to_bytes()).toString("hex");	
			return hexTx
		}

		/*
		// This will be moved to an esm module after we figure out interop that type checks between esm and commonjs modules
		const buildTxLucid = async (): Promise<string> => {
			const rawScript = policyResponse.policy as LucidNativeScript
			const script = this.lucid.utils.nativeScriptFromJson(rawScript)
			const policyId = this.lucid.utils.mintingPolicyToId(script)
			const unit = policyId + fromText(asset.unit)
			const tx = await (this.lucid.selectWalletFrom({ address: stakeAddress })).newTx()
				.mintAssets({ [unit]: BigInt(quantityToClaim) })
				.payToAddress(this.config.feeAddress, { lovelace: BigInt(this.config.feeAmount) })
				.payToAddress(stakeAddress, { [unit]: BigInt(quantityToClaim) })
				.attachMetadata(133722, { "dd-tx-type": "asset-claim" })
				.validTo(Date.now() + this.config.txTTL * 1000)
				.attachMintingPolicy(script)
				.complete()
			return tx.toString()
		}
		*/

		const updateAvailableAssets = async() => {
			const newAvailableQuantity = (BigInt(availableAssets.quantity) - BigInt(quantityToClaim)).toString()
			if (newAvailableQuantity == "0") 
				await availableAssets.destroy({ transaction })
			else {
				availableAssets.quantity = newAvailableQuantity
				await availableAssets.save({ transaction })
			}
		}

		const createClaim = async (tx: string): Promise<string> => {
			const txHash = crypto.createHash("sha512").update(tx).digest("hex")
			return (await AssetClaim.create({ 
				userId, quantity: quantityToClaim, policyId: asset.policyId, unit: asset.unit, txHash }, { transaction })
			).claimId
		}

		const tx = await buildTx() //await buildTxLucid() 
		//cardano.deserializeAndLogTransaction(tx)
		const claimId = await createClaim(tx)
		await updateAvailableAssets()
		await transaction.commit()
		logger?.log.info({ message: "AssetClaimDsl.claimStatus:created", claimId, policyId: asset.policyId, unit: asset.unit, quantity: asset.quantity })
		return success({ claimId, tx })
	}

    async submitClaimSignature(claimId: string, tx: string, witness: string, logger?: LoggingContext): Promise<SubmitClaimSignatureResult> {
		const claim = await AssetClaim.findOne({ where: { claimId }})
		if (claim == null) 
			return failure("unknown-claim")
		if (claim.state == "timed-out") 
			return failure("claim-timed-out")
		if (claim.state == "submitted" || claim.state == "confirmed") 
			return failure("claim-already-completed")
		const txHash = crypto.createHash("sha512").update(tx).digest("hex")
		if (txHash != claim.txHash) 
			return failure("corrupted-tx")
		const signResponse = await this.secureSigningService.signWithPolicy(claim.policyId, tx, logger)
		if (signResponse.status == "bad-tx" || signResponse.status == "forbidden") 
			return failure("corrupted-tx")
		const knownDecoded = Transaction.from_bytes(Buffer.from(tx, "hex"))
		const witnessSet1 = TransactionWitnessSet.from_bytes(Buffer.from(witness, "hex"))
		const witnessSet2 = TransactionWitnessSet.from_bytes(await cbor.decodeFirst(signResponse.witness))
		const witnesses = this.combineWitnessSets(witnessSet1, witnessSet2)
		const signedTx = cardano.addWitnessesToTransaction(witnesses, knownDecoded)
		// TODO: this can fail if the tx is already submitted or the utxo is already spent
		// we should handle the error and revert the whole claim
    	const txId = await this.blockfrost.txSubmit(signedTx.to_hex())
		claim.txId = txId
		claim.state = "submitted"
		await claim.save()
		logger?.log.info({ message: "AssetClaimDsl.claimStatus:submitted", claimId: claim.claimId, policyId: claim.policyId, unit: claim.unit, quantity: claim.quantity })
		return success(txId)
    }

	private async revertClaim(claim: AssetClaim): Promise<void> {
		const transaction = await this.db.transaction()
		await this.assetStore.grant(claim.userId, claim.unit, claim.policyId, claim.quantity, transaction)
		claim.state = "timed-out"
		await claim.save({ transaction })
		await transaction.commit()
	}

    async claimStatus(claimId: string, logger?: LoggingContext): Promise<Result<ClaimStatus, "unknown-claim">> {
		const claim = await AssetClaim.findOne({ where: { claimId }})
		if (claim == null) 
			return failure("unknown-claim")
		if (claim.state == "submitted") {
			const timePassed = (Date.now() - Date.parse(claim.createdAt))
			if (timePassed > this.config.txTTL*1000) {
				await this.revertClaim(claim)
				logger?.log.info({ message: "AssetClaimDsl.claimStatus:timed-out", claimId: claim.claimId, policyId: claim.policyId, unit: claim.unit, quantity: claim.quantity })
			} else {
				const inBlockchain = await (async () => {
					try { await this.blockfrost.txs(claim.txId!); return true }
					catch (_) { return false }
				})()
				if (inBlockchain) {
					claim.state = "confirmed"
					await claim.save()
					logger?.log.info({ message: "AssetClaimDsl.claimStatus:confirmed", claimId: claim.claimId, policyId: claim.policyId, unit: claim.unit, quantity: claim.quantity })
				}
			}
		}
        return success(claim.state)
    }

	async revertStaledClaims(logger?: LoggingContext): Promise<number> {
		const activeClaims = await AssetClaim.findAll({ where: { state: "created" }})
		let reverted = 0
		for (const claim of activeClaims) {
			const timePassed = (Date.now() - Date.parse(claim.createdAt))
			if (timePassed > this.config.txTTL*1000) {
				await this.revertClaim(claim)
				reverted++
				logger?.log.info({ message: "AssetClaimDsl.claimStatus:timed-out", claimId: claim.claimId, policyId: claim.policyId, unit: claim.unit, quantity: claim.quantity })
			}
		}
		return reverted
	}

	private mintOptBuilder(assetName: string, script: NativeScript, amount: string, claimerInfo?: ClaimerInfo): TokenMintOptions {
		return {
			assetName,
			fee: {
				address: this.config.feeAddress,
				quantity: this.config.feeAmount
			},
			metadata: {
				key: "13370",
				data: { "dd-tx-type": "asset-claim" },
			},
			script,
			amount,
			ttl: this.config.txTTL,
			receivingAddress: claimerInfo?.receivingAddress,
			utxos: claimerInfo && claimerInfo.utxos.map((utxo) => ({
				tx_index: utxo.outputIndex,
				tx_hash: utxo.txHash,
				amount: Object.keys(utxo.assets).map((unit) => ({
					unit,
					quantity: utxo.assets[unit],
				})),
				block: "",
			}))
		}
	}

	private combineWitnessSets(x: TransactionWitnessSet, y: TransactionWitnessSet): TransactionWitnessSet {
		const newVKeys = y.vkeys()!
		const oldVKeys = x.vkeys()!
		for (let i=0; i<oldVKeys.len(); i++)
			newVKeys.add(oldVKeys.get(i))
		y.set_vkeys(newVKeys)
		return y
	}
}


