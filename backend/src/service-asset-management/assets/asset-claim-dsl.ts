import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { NativeScript, Transaction, TransactionWitnessSet } from "@emurgo/cardano-serialization-lib-nodejs"
import { Sequelize } from "sequelize"
import { AssetClaim } from "./asset-claim-db"
import { OffChainStore } from "./offchain-store-db"
import cbor from "cbor"
import crypto from "crypto"
import { AssetStoreDsl } from "./assets-dsl"
import { SecureSigningService } from "../../service-secure-signing"
import { failure, Result, success } from "../../tools-utils"
import { LoggingContext } from "../../tools-tracing"
import { cardano, MinimalUTxO, TokenMintOptions } from "../../tools-cardano"
import { ClaimStatus, ClaimerInfo } from "../models"
import { BlockchainService } from "../../service-blockchain/service-spec"
import { LucidNativeScript } from "../../service-blockchain/models"

export type AssetClaimDslConfig = {
	feeAddress: string,
	feeAmount: string,
	txTTL: number
}

export type GenAssosiateTxResult = Result<{txId: string}, string>

export type ClaimResult = Result<{ claimId: string, tx: string }, "unknown-policy" | "not-enough-assets" | string>

export type LucidClaimResult = Result<{ claimId: string, tx: string, signature: string }, "unknown-policy" | "not-enough-assets">

export type SubmitClaimSignatureResult = Result<string, "unknown-claim" | "corrupted-tx" | "claim-timed-out" | "claim-already-completed" | string>
 
export class AssetClaimDsl {

	constructor(
		private readonly config: AssetClaimDslConfig,
		private readonly db: Sequelize,
		private readonly blockfrost: BlockFrostAPI,
		private readonly secureSigningService: SecureSigningService,
		private readonly assetStore: AssetStoreDsl,
		private readonly blockchainService: BlockchainService,
	){}

	public async userClaims(userId: string, unit: string, page?: number, logger?: LoggingContext): Promise<AssetClaim[]> {
		return AssetClaim.findAll({ where: { userId, unit }, limit: 5, offset: page && page * 5, order: [["createdAt", "DESC"]] })
	}

	//DEPRECATED
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

	//DEPRECATED
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

	public async claim(userId: string, stakeAddress: string, address: string, asset: { unit: string, policyId: string, quantity?: string}, logger?: LoggingContext): Promise<ClaimResult> {
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

		const updateAvailableAssets = async() => {
			const newAvailableQuantity = (BigInt(availableAssets.quantity) - BigInt(quantityToClaim)).toString()
			if (newAvailableQuantity == "0") 
				await availableAssets.destroy({ transaction })
			else {
				availableAssets.quantity = newAvailableQuantity
				await availableAssets.save({ transaction })
			}
		}

		const createClaim = async (txHash: string): Promise<string> => {
			//const txHash = crypto.createHash("sha512").update(tx).digest("hex")
			return (await AssetClaim.create({ 
				userId, quantity: quantityToClaim, policyId: asset.policyId, unit: asset.unit, txHash }, { transaction })
			).claimId
		}

		const builtTxResponse = await this.blockchainService.buildMintTx(address, policyResponse.policy as LucidNativeScript, asset.unit, quantityToClaim, {feeAddress: this.config.feeAddress, feeAmount: this.config.feeAmount})
		if (builtTxResponse.status !== "ok") return failure(builtTxResponse.reason) 
		const claimId = await createClaim(builtTxResponse.value.txHash)
		await updateAvailableAssets()
		await transaction.commit()
		logger?.log.info({ message: "AssetClaimDsl.claimStatus:created", claimId, policyId: asset.policyId, unit: asset.unit, quantity: asset.quantity })
		return success({ claimId, tx: builtTxResponse.value.rawTransaction })
	}

    async submitClaimSignature(claimId: string, serializedSignedTx: string, logger?: LoggingContext): Promise<SubmitClaimSignatureResult> {
		const claim = await AssetClaim.findOne({ where: { claimId }})
		if (claim == null) 
			return failure("unknown-claim")
		if (claim.state == "timed-out") 
			return failure("claim-timed-out")
		if (claim.state == "submitted" || claim.state == "confirmed") 
			return failure("claim-already-completed")


		const txHash = await this.blockchainService.getTxHashFromTransaction(serializedSignedTx)
		if(txHash.status !== "ok") return failure(`could not verify TxHash: ${txHash.reason}`)
		if (txHash.value != claim.txHash) return failure("corrupted-tx")
		
    	const txIdResponse = await this.blockchainService.submitTransaction(serializedSignedTx)
		//TODO: revert whole claim if this fails
		if (txIdResponse.status !== "ok") return failure("could not submit TX")
		claim.txId = txIdResponse.value
		claim.state = "submitted"
		await claim.save()
		logger?.log.info({ message: "AssetClaimDsl.claimStatus:submitted", claimId: claim.claimId, policyId: claim.policyId, unit: claim.unit, quantity: claim.quantity })
		return success(txIdResponse.value)
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


