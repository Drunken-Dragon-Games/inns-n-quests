import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { toHex, fromHex, extractStakeAddress } from "./Utils.js";
import * as config from "./Config.js"

export interface DrunkenDragonInventory {
	dragon_silver: { name: string, quantity: number }[]
	pixeltiles: { name: string, quantity: number }[]
	gmas: { name: string, quantity: number }[]
	adv_of_thiolden: { name: string, quantity: number }[]
	emojis: { name: string, quantity: number }[]
	pets: { name: string, quantity: number }[]
}

interface DrunkenDragonInventoryIntermediate {
	dragon_silver: {[name: string]: number}
	pixeltiles: {[name: string]: number}
	gmas: {[name: string]: number}
	adv_of_thiolden: {[name: string]: number}
	emojis: {[name: string]: number}
	pets: {[name: string]: number}
}

export class AssetManagementDsl {
	
	blockfrost: BlockFrostAPI

	constructor (_blockfrost: BlockFrostAPI) {
		this.blockfrost = _blockfrost
	}

	emptyInventory = (): DrunkenDragonInventory => { 
		return { dragon_silver: [], pixeltiles: [], gmas: [], adv_of_thiolden: [], emojis: [], pets: [] } 
	}

	/** Returns all Drunken Dragon possessions related to input address or ada handle.
	 * 
	 * @param address 
	 * @returns 
	 */
	fetchInventory = async (address: string): Promise<DrunkenDragonInventory> => {
		const count = 100
		const realAddress = await this.fetchHandleAddress(address)
		const account = extractStakeAddress(realAddress)
		const intermediate: DrunkenDragonInventoryIntermediate = 
			{ dragon_silver: {}, pixeltiles: {}, gmas: {}, adv_of_thiolden: {}, emojis: {}, pets: {}}
		const recurse = async (page: number): Promise<void> => {
			const accountAssets = await this.blockfrost.accountsAddressesAssets(address, { count, page })
			if (accountAssets.length == count) {
				this.filterAssets(accountAssets, intermediate)
				return recurse(page + 1)
			} else {
				this.filterAssets(accountAssets, intermediate)
				return
			}
		}
		await recurse(1)
		const inventory = this.emptyInventory()
		for (const collection in intermediate)
			if (collection == "dragon_silver" || collection == "pixeltiles" || collection == "gmas" || collection == "adv_of_thiolden" || collection == "emojis" || collection == "pets")
				for (const name in intermediate[collection])
					inventory[collection].push({ name, quantity: intermediate[collection][name] })	
		return inventory
	}

	/** If the first character of the input is a dollar sign, then it fetches an address of the wallet that 
	 *  holds the ADA HANDLE with the name specified by the function input. Returns the input otherwise.
	 * 
	 * @param maybeHandle 
	 * @returns 
	 */
	private fetchHandleAddress = async (maybeHandle: string): Promise<string> => {
		if (maybeHandle.charAt(0) == '$') {
			const handleName = toHex(maybeHandle.substring(1))
			const addresses = await this
				.blockfrost
				.assetsAddresses(config.policies.ADA_HANDLE + handleName)
			return addresses[0].address
		}
		else return maybeHandle
	}

	/** Creates array with only the assets comming from a policy id and transforms it into a standard json structure.
	 * 
	 * @param assets 
	 * @param assetName
	 * @returns 
	 */
	private filterAssets = (assets: { unit: string, quantity: string }[], inventory: DrunkenDragonInventoryIntermediate): void => {
		const policies = [ 
			{ of: "dragon_silver", rx: new RegExp(config.policies.DRAGON_SILVER+"(.+)") }, 
			{ of: "pixeltiles", rx: new RegExp(config.policies.PIXEL_TILES+"(.+)") }, 
			{ of: "gmas", rx: new RegExp(config.policies.GRANDMASTER_ADVENTURERS+"(.+)") },
			{ of: "adv_of_thiolden", rx: new RegExp(config.policies.ADV_OF_THIOLDEN+"(.+)") },
			{ of: "emojis", rx: new RegExp(config.policies.EMOJIS+"(.+)") } ,
			{ of: "pets", rx: new RegExp(config.policies.DDxJPEG_PETS+"(.+)") } ]
		assets.map(asset => {
			policies.map(policy => {
				const extraction = policy.rx.exec(asset.unit)
				if (extraction) {
					const name = fromHex(extraction[1])
					const quantity = parseInt(asset.quantity)
					if (policy.of == "pixeltiles" || 
						policy.of == "dragon_silver" || 
						policy.of == "gmas" || 
						policy.of == "adv_of_thiolden" || 
						policy.of == "pets" || 
						policy.of == "emojis")
						if (typeof inventory[policy.of][name] === "undefined")
							inventory[policy.of][name] = quantity
						else 
							inventory[policy.of][name] += quantity
				}
			})
		})
	}
}