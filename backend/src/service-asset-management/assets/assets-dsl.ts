import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { OffChainStore } from "./offchain-store-db.js";
import { Transaction, WhereOptions } from "sequelize";
import { Inventory } from "../models.js";
import { cardano } from "../../tools-cardano";

type Options = { count: number, page: number, chain?: boolean , policies: string[] }

export class AssetStoreDsl {
	
    ADA_HANDLE: string = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a"

	constructor (
        private blockfrost: BlockFrostAPI,
    ) {}

	public async list(userId: string, addresses: string[], options: Options): Promise<Inventory> {
        return this.shallowInventoryMerge(
			await this.onChainInventory(addresses, options), 
			await this.offChainInventory(userId, options))
    }

	public async grant(userId: string, unit: string, policyId: string, quantity: string, transaction?: Transaction): Promise<void> {
		const currentAsset = await OffChainStore.findOne({ where: {userId, policyId, unit}, transaction })
		if (currentAsset == null) await OffChainStore.create({ userId, policyId, unit, quantity }, { transaction })
		else {
			currentAsset.quantity = (BigInt(quantity) + BigInt(currentAsset.quantity)).toString()
			await currentAsset.save()
		}
	}

	private offChainInventory = async (userId: string, options: Options): Promise<Inventory> => {
		const makeInventory = (storeAsset: OffChainStore[]): Inventory => {
			const inventory: Inventory = {}
			storeAsset.forEach(a => {
				const inventoryObject = { unit: a.unit, quantity: a.quantity, chain: false }
				if (inventory[a.policyId] === undefined)
					inventory[a.policyId] = [inventoryObject]
				else 
					inventory[a.policyId].push(inventoryObject)
			})
			return inventory
		}
		if (options.chain === true) return {}
		const userIdOpt: WhereOptions<OffChainStore> = 
			[{ userId }]
		const policiesOpt: WhereOptions<OffChainStore> = 
			options.policies === undefined ? [] : 
			[{ policyId: options.policies }]
		const offChainAssets = await OffChainStore.findAll(
			{ where: userIdOpt.concat(policiesOpt) })
		return makeInventory(offChainAssets)
	}

    private onChainInventory = async (addresses: string[], options: Options): Promise<Inventory> => {
		if (options.chain === false) return {}
		try {
			const inventories = await Promise
				.all(addresses.map(async a => await this.fetchOnChainAssets(a, options)))
			if (inventories.length == 0) return {}
			else return inventories.reduce(this.deepInventoryMerge)
		} catch {
			return {}
		}
    }

    private fetchOnChainAssets = async (account: string, options: Options): Promise<Inventory> => {
		const count = 100
		const recurse = async (page: number, acc: Inventory): Promise<Inventory> => {
			// FIX ME: In case blockfrost throws an exception then return error
			const assets = await this.blockfrost.accountsAddressesAssets(account, { count, page })
			if (assets.length == count)
				return recurse(page + 1, this.filterBlockFrostAssets(assets, acc, options))
			else 
				return this.filterBlockFrostAssets(assets, acc, options)
		}
		return recurse(1, {})
    }

	/** If the first character of the input is a dollar sign, then it fetches an address of the wallet that 
	 *  holds the ADA HANDLE with the name specified by the function input. Returns the input otherwise.
	 * 
	 * @param maybeHandle 
	 * @returns 
	 */
	private fetchHandleAddress = async (maybeHandle: string): Promise<string> => {
		if (maybeHandle.charAt(0) == '$') {
			const handleName = cardano.hexEncode(maybeHandle.substring(1))
			const addresses = await this
				.blockfrost
				.assetsAddresses(this.ADA_HANDLE + handleName)
			return addresses[0].address
		}
		else return maybeHandle
	}

	/** Creates inventory with only the assets of the registry.
	 * 
	 * @param assets 
	 * @param inventory
	 * @returns 
	 */
	private filterBlockFrostAssets = (assets: { unit: string, quantity: string }[], inventory: Inventory, options: Options): Inventory => {
		const policies = options.policies 
			.map(policyId => { return {
                policyId,
                rx: new RegExp(policyId+"(.+)")
            }})
		assets.forEach(asset => 
			policies.forEach(policy => {
				const extraction = policy.rx.exec(asset.unit)
				if (extraction) {
					const unit = cardano.hexDecode(extraction[1])
					const quantity = asset.quantity
                    const a = { unit, quantity, chain: true }
                    if (inventory[policy.policyId] == undefined)
                        inventory[policy.policyId] = [ a ]
                    else 
                        inventory[policy.policyId].push(a)
				} else return []
			})
		)
        return inventory
	}

    private shallowInventoryMerge = (a: Inventory, b: Inventory): Inventory => {
        Object.keys(a).forEach(k1 => {
            if (b[k1] == undefined) b[k1] = a[k1]
            else b[k1] = b[k1].concat(a[k1])
        })
        return b
    }

	private deepInventoryMerge = (a: Inventory, b: Inventory): Inventory => {
		const merged = {...b}
		Object.keys(a).forEach(k1 => {
            if (merged[k1] == undefined) merged[k1] = a[k1]
            else merged[k1] = merged[k1].concat(a[k1]).reduce((acc, currentValue) => {
				const {unit, quantity, chain} = currentValue
				const xs = acc.map((x,index) => ({x,index})).find(({x, index}) => x.unit == unit && x.chain == chain)
				if (xs) acc[xs.index].quantity = (BigInt(acc[xs.index].quantity) + BigInt(quantity)).toString()
				else acc.push(currentValue)
				return acc
			},[] as {unit: string, quantity: string, chain: boolean}[])
        })
        return merged
	}
}
