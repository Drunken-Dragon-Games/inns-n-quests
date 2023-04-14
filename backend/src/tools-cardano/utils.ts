import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { Address, AssetName, BaseAddress, BigNum, hash_transaction, Int, LinearFee, MultiAsset, NativeScript, NativeScripts, ScriptHash, Transaction, 
		 TransactionBuilder, TransactionBuilderConfigBuilder, TransactionHash, TransactionInput, TransactionOutput, TransactionOutputBuilder, 
		 TransactionWitnessSet, Value, Vkeywitness, Vkeywitnesses } from "@emurgo/cardano-serialization-lib-nodejs"
import { bech32 } from "bech32"
import * as cbor from 'cbor';
import { Network } from "lucid-cardano"

export type CardanoNetwork = Network

export const cardanoNetworkFromString = (raw?: string): CardanoNetwork => {
	if (raw == "Mainnet" || raw == "Preprod") return raw
	else throw new Error(`${raw} is not equal to CardanoNetwork 'Mainnet' | 'Preprod'`)
}

export interface UtxoLike {
	tx_index: number
	tx_hash: string
	amount: {
		unit: string
		quantity: string
	}[]
	block: string
}

export type NFTMintOptions = { 
	assetName: string, 
	fee?: { address: string, quantity: string }
	metadata: object, 
	script: NativeScript, 
	ttl?: number 
}

export type TokenMintOptions = {
	assetName: string, 
	fee?: { address: string, quantity: string }
	metadata?: { key: string, data: object }, 
	script: NativeScript, 
	amount: string,
	ttl?: number 
}

export class cardano {

	static hexEncode = (str: string): string => {
		var i;
		var result = "";
		for (i=0; i<str.length; i++) {
			result += str.charCodeAt(i).toString(16);
		}
		return result
	}

	static hexDecode = (str: string): string => 
		Buffer.from(str, 'hex').toString('utf8')

	/** Extracts the stake address of a cardano address according to 
	 *  https://cardano.stackexchange.com/questions/2003/extract-the-bech32-stake-address-from-a-shelly-address-in-javascript/2004#2004
	 * 
	 * @param address 
	 * @returns 
	 */
	static extractStakeAddress = (address: string): string => {
		const addressWords = bech32.decode(address, 1000)
		const payload = bech32.fromWords(addressWords.words)
		const addressDecoded = `${Buffer.from(payload).toString('hex')}`
		const stakeAddressDecoded = 'e1'+addressDecoded.substr(addressDecoded.length - 56)
		const stakeAddress = bech32.encode(
			'stake',
			bech32.toWords(Uint8Array.from(Buffer.from(stakeAddressDecoded, 'hex'))),
			1000
		)
		return stakeAddress
	}

	static decodeTx = (serializedTransaction: string): Transaction =>
		Transaction.from_bytes(Buffer.from(serializedTransaction, "hex"))

	static decodeWitnesses = (serializedWitnesses: string): TransactionWitnessSet => 
		TransactionWitnessSet.from_bytes(Buffer.from(serializedWitnesses, "hex"));

	static hashTx = (transaction: Transaction): TransactionHash => 
		hash_transaction(transaction.body())

	static addWitnessToWitnesseSet = (witness: Vkeywitness, witnesses: TransactionWitnessSet): TransactionWitnessSet => {
		const vkeyWitnesses = witnesses.vkeys()
		if (vkeyWitnesses == undefined) {
			const newVkeys = Vkeywitnesses.new()
			newVkeys.add(witness)
			witnesses.set_vkeys(newVkeys)
			return witnesses
		} else {
			vkeyWitnesses.add(witness)
			witnesses.set_vkeys(vkeyWitnesses)
			return witnesses
		}
	}

	static addScriptToWitnessSet = (script: NativeScript, witnessSet: TransactionWitnessSet): TransactionWitnessSet => {
		const witnessScripts = NativeScripts.new()
		witnessScripts.add(script)
		witnessSet.set_native_scripts(witnessScripts)
		return witnessSet
	}

	static addWitnessesToTransaction = (witnessSet: TransactionWitnessSet, transaction: Transaction): Transaction => 
		Transaction.new(
			transaction.body(),
			witnessSet,
			transaction.auxiliary_data()
		)

	static policyId = (nativeScript: NativeScript): string =>
		Buffer.from(nativeScript.hash().to_bytes()).toString("hex")

	static makeTxBuilder = (): TransactionBuilder => 
		TransactionBuilder.new(
			TransactionBuilderConfigBuilder.new()
				.fee_algo(
					LinearFee.new(
						BigNum.from_str("44"),
						BigNum.from_str("155381")
					)
				)
				.coins_per_utxo_word(BigNum.from_str("34482"))
				.pool_deposit(BigNum.from_str("500000000"))
				.key_deposit(BigNum.from_str("2000000"))
				.max_value_size(50000)
				.max_tx_size(16384)
				.build()
		)

	/** Sort from biggest to smallest */
	static sortUtxos = (utxos: UtxoLike[], byToken: string): UtxoLike[] =>
		utxos.sort((a, b) => {
			const aToken = a.amount.filter(a => a.unit == byToken)
			const bToken = b.amount.filter(b => b.unit == byToken)
			const aHasToken = aToken.length > 0
			const bHasToken = bToken.length > 0 
			if (aHasToken && !bHasToken) return -1
			else if (!aHasToken && bHasToken) return 1
			else if (!aHasToken && !bHasToken) return 0
			else {
				const s = (BigInt(aToken[0].quantity) - BigInt(bToken[0].quantity))
				if (s > 0) return -1
				else if (s < 0) return 1
				else return 0
			}
		})

	static largestFirstCSA = (explicitOutput: bigint, byToken: string, utxoSet: UtxoLike[], maxInputCount: number = 20): UtxoLike[] => {
		const initialUTXOSet = [...utxoSet]
		const sortedUTXOs : UtxoLike[] = cardano.sortUtxos(initialUTXOSet, byToken)
		const selectedUTXOSet: UtxoLike[] = []
		let sumOfValue: bigint = BigInt(0)
		do {
			if (selectedUTXOSet.length > maxInputCount) throw new Error("input-size-exceeded")
			const utxo = sortedUTXOs.shift()
			if (utxo == undefined) throw new Error("insufficient-balance")
			const amount = utxo.amount.find(a => a.unit == byToken)
			if (amount == undefined) throw new Error("insufficient-balance")
			sumOfValue = BigInt(amount.quantity) + sumOfValue
			selectedUTXOSet.push(utxo)
		} while(sumOfValue < explicitOutput)
		return selectedUTXOSet
	}

	static addSimpleTxInputsFor = (desiredLovelaceOutput: bigint, utxos: UtxoLike[]): { input: TransactionInput, value: Value }[] => 
		cardano.largestFirstCSA(desiredLovelaceOutput, "lovelace", utxos, 20)
			.map((inputUtxo: UtxoLike) => {
				const input = TransactionInput.new(
					TransactionHash.from_bytes(Buffer.from(inputUtxo.tx_hash, "hex")),
					inputUtxo.tx_index
				)
				const value = Value.new(BigNum.from_str(inputUtxo.amount.find((asset) => asset.unit == "lovelace")!.quantity))
				// Add explicitly all multiassets from inputs
				const multiasset = MultiAsset.new()
				inputUtxo.amount.forEach((asset: { unit: string, quantity: string }) => {
					if (asset.unit == "lovelace") return
					const policyId = asset.unit.slice(0, 56)
					const assetName = asset.unit.slice(56, asset.unit.length)
					const assetNameByte = Buffer.from(assetName, "hex").toString()
					const hash = ScriptHash.from_bytes(Buffer.from(policyId, "hex"))
					const cardanoAsset = AssetName.new(Buffer.from(assetNameByte))
					const value = BigNum.from_str(asset.quantity)
					multiasset.set_asset(hash, cardanoAsset, value)
				})
				value.set_multiasset(multiasset)
				return { input, value }
			})

	static createNFTMintTransaction = async (sourceAddress: string, options: NFTMintOptions, blockfrost: BlockFrostAPI): Promise<Transaction> => {
		const receivingAddresses = (await blockfrost.accountsAddresses(sourceAddress)).map(a => a.address)
		const currentSlot = (await blockfrost.blocksLatest()).slot
		const utxos = (await Promise.all(receivingAddresses.map(address => blockfrost.addressesUtxosAll(address)))).flat()
		const address = Address.from_bech32(receivingAddresses[0])
		const txBuilder = cardano.makeTxBuilder()
		if (options.fee !== undefined) {
			const txBuilderDDFeeAmount = Value.new(BigNum.from_str(options.fee.quantity));
			const feeAddress = Address.from_bech32(options.fee.address)
			const feeOutput = TransactionOutput.new(feeAddress, txBuilderDDFeeAmount);
			txBuilder.add_output(feeOutput);
		}
		txBuilder.add_mint_asset_and_output_min_required_coin(
			options.script,
			AssetName.new(Buffer.from(options.assetName)),
			Int.new_i32(1),
			TransactionOutputBuilder.new().with_address(address).next()
		);
		txBuilder.add_json_metadatum(
			BigNum.from_str("721"),
			JSON.stringify({
				[cardano.policyId(options.script)]: {
					[options.assetName]: options.metadata
				}
			})
		)
		const lovelaceOutput = BigInt(txBuilder.get_explicit_output().coin().to_str())
		const inputs = cardano.addSimpleTxInputsFor(lovelaceOutput, utxos)
		const privKeyHash = BaseAddress.from_address(address)!.payment_cred().to_keyhash()
		inputs.forEach(i => txBuilder.add_key_input(privKeyHash!, i.input, i.value))
		const txTtl: number = currentSlot! + (options.ttl ?? 120)
		txBuilder.set_ttl(txTtl);
		txBuilder.add_change_if_needed(address)
		return txBuilder.build_tx()
	}

	static createTokenMintTransaction = async (sourceAddress: string, options: TokenMintOptions, blockfrost: BlockFrostAPI): Promise<Transaction> => {
		const receivingAddresses = (await blockfrost.accountsAddresses(sourceAddress)).map(a => a.address)
		const currentSlot = (await blockfrost.blocksLatest()).slot
		const utxos = (await Promise.all(receivingAddresses.map(address => blockfrost.addressesUtxosAll(address)))).flat()
		const address = Address.from_bech32(receivingAddresses[0])
		const txBuilder = cardano.makeTxBuilder()
		if (options.fee !== undefined) {
			const txBuilderDDFeeAmount = Value.new(BigNum.from_str(options.fee.quantity));
			const feeAddress = Address.from_bech32(options.fee.address)
			const feeOutput = TransactionOutput.new(feeAddress, txBuilderDDFeeAmount);
			txBuilder.add_output(feeOutput);
		}
		txBuilder.add_mint_asset_and_output_min_required_coin(
			options.script,
			AssetName.new(Buffer.from(options.assetName)),
			Int.new_i32(parseInt(options.amount)),
			TransactionOutputBuilder.new().with_address(address).next()
		)
		if (options.metadata !== undefined)
			txBuilder.add_json_metadatum(
				BigNum.from_str(options.metadata.key),
				JSON.stringify(options.metadata.data)
			)
		const lovelaceOutput = BigInt(txBuilder.get_explicit_output().coin().to_str())
		const inputs = cardano.addSimpleTxInputsFor(lovelaceOutput, utxos)
		const privKeyHash = BaseAddress.from_address(address)!.payment_cred().to_keyhash()
		inputs.forEach(i => txBuilder.add_key_input(privKeyHash!, i.input, i.value))
		const txTtl: number = currentSlot! + (options.ttl ?? 120)
		txBuilder.set_ttl(txTtl);
		txBuilder.add_change_if_needed(address)
		return txBuilder.build_tx()
	}

	static deserializeAndLogTransaction = async (cborHex: string): Promise<void> => {
		const decodeCBOR = async (cborHex: string) => {
			const cborBytes = Buffer.from(cborHex, 'hex')
			return await cbor.decodeFirst(cborBytes)
		}
		  
		const ensureArray = (cborObject: any): any[] => {
			if (!Array.isArray(cborObject)) {
				throw new Error('Failed to deserialize Cardano transactions: expected an array')
			}
			return cborObject
		}
		
		const processInputs = (transaction: any) => {
			const hasInputs = transaction.has(0)
			return hasInputs ? transaction.get(0).map((input: any) => ({
				txId: input[0].toString('hex'),
				index: input[1],
			})) : []
		}
		
		const processOutputs = (transaction: any) => {
			const hasOutputs = transaction.has(1)
			return hasOutputs ? transaction.get(1).map((output: any) => ({
				address: Buffer.isBuffer(output[0]) ? output[0].toString('hex') : output[0],
				amount: Array.isArray(output[1]) ? output[1][0] : output[1],
			})) : []
		}
		
		const processMint = (transaction: any) => {
			const hasMint = transaction.has(9)
			return hasMint && {
				policy: transaction.get(9).keys().next().value.toString('hex'),
				assets: Object.fromEntries([...transaction.get(9).values().next().value.entries()].map(([k, v]) => [k.toString(), v])),
			}
		}
		
		const processTransaction = (transaction: any) => {
			try {
				if (typeof transaction.has !== 'function') {return}
				const hash = transaction.has(7) ? transaction.get(7).toString('hex') : undefined
				if (!hash) {return}
				return {
				hash,
				inputs: processInputs(transaction),
				outputs: processOutputs(transaction),
				fee: transaction.has(2) ? transaction.get(2) : undefined,
				validityIntervalStart: transaction.has(3) ? transaction.get(3) : undefined,
				mint: processMint(transaction),
				}
			} catch (error: any) {
				console.error(error)
				return undefined
			}
		}
		
		const cborObject = await decodeCBOR(cborHex)
		const transactionsArray = ensureArray(cborObject)
		const transactions = transactionsArray.map(processTransaction).filter(Boolean)

		console.log(transactions[0])
				
	}
}

  
  
  