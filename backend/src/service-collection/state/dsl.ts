import { Op, Sequelize, Transaction, WhereOptions } from "sequelize"
import { MetadataRegistry, WellKnownPolicies } from "../../tools-assets"
import { LoggingContext } from "../../tools-tracing"
import { SResult } from "../../tools-utils"
import { AssetClass, Collection, CollectionFilter, CollectionPolicyNames, PolicyCollectibles, StoredMetadata } from "../models"
import { SyncedAsset, SyncedMortalAsset } from "./assets-sync-db"
import { CreateSyncedAsset, SyncedAssetChanges } from "./models"
import { RandomDSL } from "../random-dsl/dsl"

export const relevantPolicies = ["pixelTiles", "adventurersOfThiolden", "grandMasterAdventurers"] as const
const policyIndexMapper: Record<CollectionPolicyNames, typeof relevantPolicies[number]> = {
    "pixel-tiles": "pixelTiles",
    "adventurers-of-thiolden": "adventurersOfThiolden",
    "grandmaster-adventurers": "grandMasterAdventurers"
}

export class SyncedAssets {
    constructor(
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly metadataRegistry: MetadataRegistry,
    ) {}

    async determineUpdates(userId: string, inventory: {[policyId: string]: { unit: string, quantity: string, chain: boolean }[]}): Promise<{ syncedAssetChanges: SyncedAssetChanges, fullCollection: Collection<StoredMetadata>}>{
        try{
        const updatedChainInfo = (acc: ChainInfo, policy:  typeof relevantPolicies[number], assets: {unit: string,quantity: string,chain: boolean}[], policyId: string) => {
            const processedAssets = this.processAssets(userId, policyId, assets, policy)
            return {
                chainAssets: acc.chainAssets.concat(processedAssets.creatableAssets),
                fullCollection: {...acc.fullCollection, [policy]: processedAssets.policyCollectibles}
            }
        }
        
        const preSyncedAssets = await SyncedAsset.findAll({where: {userId}})

        type ChainInfo = {chainAssets:  CreateSyncedAsset[], fullCollection: Collection<StoredMetadata>}
        const emptyChainInfo: ChainInfo = {chainAssets: [], fullCollection: {pixelTiles: [], grandMasterAdventurers: [], adventurersOfThiolden: []}}

        const chainInfo :ChainInfo = relevantPolicies.reduce((acc, policy) => {
            const policyId = this.wellKnownPolicies[policy].policyId
            const assets = inventory[policyId]
            if (assets) return updatedChainInfo(acc, policy, assets, policyId);
            return {...acc, fullCollection: {...acc.fullCollection, [policy]: []}}
        }, emptyChainInfo)

        
        const inventoryRecord: { [assetRef: string]: CreateSyncedAsset } = {}
        const preSyncedRecord: { [assetRef: string]: SyncedAsset } = {}

        chainInfo.chainAssets.forEach(asset => inventoryRecord[asset.assetRef] = asset)
        preSyncedAssets.forEach(asset => preSyncedRecord[asset.assetRef] = asset)

        const empty: SyncedAssetChanges = {toCreate: [], toDelete: [], toUpdate: []}

        const inventoryKeys = Object.keys(inventoryRecord)
        const preSyncedKeys = Object.keys(preSyncedRecord)

        const uniqueAssetRefs = Array.from(new Set([...inventoryKeys, ...preSyncedKeys]))

        const { toCreate, toDelete, toUpdate } = uniqueAssetRefs
        .reduce(({ toCreate, toDelete, toUpdate }, assetRef) => {
            const inventoryAssetQuantity = inventoryRecord[assetRef]?.quantity || 0
            const preSyncedAssetQuantity = preSyncedRecord[assetRef]?.quantity || 0
            
            if (inventoryAssetQuantity === 0) 
                toDelete.push(preSyncedRecord[assetRef].asset_id)
            else if (preSyncedAssetQuantity === 0) 
                toCreate.push(inventoryRecord[assetRef])
            else if (inventoryAssetQuantity !== preSyncedAssetQuantity){
                toUpdate.push({dbId: preSyncedRecord[assetRef].asset_id, quantity: inventoryAssetQuantity})
            }
            return (
                { toCreate, toDelete, toUpdate })
        }, empty)

        return { syncedAssetChanges:{toCreate, toDelete, toUpdate}, fullCollection: chainInfo.fullCollection } 
    }catch(e: any){
        console.log(e)
        return { syncedAssetChanges:{toCreate:[], toDelete:[], toUpdate: []}, fullCollection: {pixelTiles: [], grandMasterAdventurers: [], adventurersOfThiolden: []} } 
    }
    }

    async updateDatabase(syncedAssetChanges: SyncedAssetChanges, sequelize: Sequelize, logger?: LoggingContext){
        try{
            await sequelize.transaction(async (transaction) => {
                await SyncedAsset.bulkCreate(syncedAssetChanges.toCreate, {transaction})
                await SyncedAsset.destroy({where: {asset_id: syncedAssetChanges.toDelete}, transaction})
                await SyncedMortalAsset.destroy({where: {asset_id: syncedAssetChanges.toDelete}, transaction})
                const updates = syncedAssetChanges.toUpdate.map(
                    ({ dbId, quantity }) => `UPDATE ${SyncedAsset.tableName} SET quantity='${quantity}' WHERE asset_id='${dbId}'`
                ).join("; ")
                await sequelize.query(updates, { transaction })
                await SyncedMortalAssets.updateAssets(syncedAssetChanges.toUpdate, transaction)
            })
        } catch (error: any) {
            logger ? logger.log.error(error.message) :  console.log(error.message)
        }
    }

    async getSyncedAssets(userId: string, filter?: CollectionFilter, pageSize = 50): Promise<SyncedAsset[]>{
        if (!filter) return SyncedAsset.findAll({where: {userId}})

        const whereClause: WhereOptions = { userId }
        if (filter.policyFilter.length > 0) 
            whereClause.policyName = { [Op.in]: filter.policyFilter.map((policy) => policyIndexMapper[policy] ) }
        
        if (filter.classFilter.length > 0) 
            whereClause.class = { [Op.in]: filter.classFilter }

        const apsAttributes = ["ath", "int", "cha"] as const
        apsAttributes.forEach(apsAttribute => {
            if (filter.APSFilter[apsAttribute].from) {
                whereClause[apsAttribute] = {
                    ...whereClause[apsAttribute],
                    [Op.gte]: filter.APSFilter[apsAttribute].from
                }
            }
            if (filter.APSFilter[apsAttribute].to) {
                whereClause[apsAttribute] = {
                    ...whereClause[apsAttribute],
                    [Op.lte]: filter.APSFilter[apsAttribute].to
                }
            }
        })

        const offset = (filter.page - 1) * pageSize
        return SyncedAsset.findAll({ where: whereClause, limit: pageSize, offset: offset })
    }

    async getAsset(userId: string, assetRef:string): Promise<SResult<{asset: SyncedAsset}>>{
        const asset = await SyncedAsset.findOne({where: {userId, assetRef}})
        if (asset) return {ctype: "success", asset}
        else return {ctype: "failure", error: "asset does not belong to user in sync DB"}
    }

    private getCollectionType = (policyId: string, assetUnit: string): "Character" | "Furniture" => {
        if(policyId === this.wellKnownPolicies.pixelTiles.policyId){
            const metadataType = this.metadataRegistry.pixelTilesMetadata[assetUnit].type
            return metadataType == "Adventurer" || metadataType == "Monster" || metadataType == "Townsfolk" ? "Character" : "Furniture"
        }
        return "Character"
    }

    private getCollectibleAPS(assetRef: string, collection: typeof relevantPolicies[number]):[number, number, number] {
        switch (collection) {
            case "pixelTiles": switch (this.metadataRegistry.pixelTilesMetadata[assetRef].rarity) {
                case "Common": return [2,2,2]
                case "Uncommon": return [4,4,4]
                case "Rare": return [6,6,6]
                case "Epic": return [8,8,8]
                default: return [10,10,10]
            }
            case "grandMasterAdventurers":
                const armor = parseInt(this.metadataRegistry.gmasMetadata[assetRef].armor)
                const weapon = parseInt(this.metadataRegistry.gmasMetadata[assetRef].weapon)
                const targetAPSSum = Math.round((armor + weapon) * 30 / 10)
                //const deterministicRand = this.randFactory(assetRef)
                const deterministicRand = RandomDSL.seed(assetRef)
                return this.newRandAPS(targetAPSSum, deterministicRand)
            case "adventurersOfThiolden":
                const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
                return [
                    this.metadataRegistry.advOfThioldenAppMetadata[idx].ath,
                    this.metadataRegistry.advOfThioldenAppMetadata[idx].int,
                    this.metadataRegistry.advOfThioldenAppMetadata[idx].cha
                ]
        }
    }

    private newRandAPS(targetAPSSum: number, deterministicRand: RandomDSL):[number, number, number] {
        // Assign stats as best as possible
        let currentSum = 0, overflow = 0
        const baseStatsOrder = deterministicRand.shuffle(
            ["athleticism", "intellect", "charisma"] as ["athleticism", "intellect", "charisma"])
        const singleStatMax = 10
        const stats = { athleticism: 0, intellect: 0, charisma: 0 }
        baseStatsOrder.forEach((stat, i) => {
            if (i == 2) {
                const semiFinalStat = targetAPSSum - currentSum
                const finalStat = Math.min(singleStatMax, semiFinalStat)
                overflow = semiFinalStat - finalStat
                stats[stat] = finalStat
            } else {
                const maxPossibleStat = Math.min(Math.min(targetAPSSum - 2, singleStatMax), targetAPSSum - 1 - currentSum)
                const finalStat = deterministicRand.randomNumberBetween(1, maxPossibleStat)
                currentSum += finalStat
                stats[stat] = finalStat
            }
        })
        // Randomly distribute the rest
        while (overflow > 0) {
            baseStatsOrder.forEach((stat) => {
                const currentStat = stats[stat]
                if (currentStat == singleStatMax || overflow <= 0) return
                const maxPossibleIncrement = Math.min(singleStatMax - currentStat, overflow)
                const randomIncrement = deterministicRand.randomNumberBetween(1, maxPossibleIncrement)
                const finalStat = randomIncrement + currentStat
                overflow -= randomIncrement
                stats[stat] = finalStat
            })
        }
        const totalStatSum = stats.athleticism + stats.intellect + stats.charisma
        if (totalStatSum != targetAPSSum) throw new Error("Expected " + targetAPSSum + " stats but got " + totalStatSum)
        else return  [stats.athleticism, stats.intellect, stats.charisma]
    }

    private getAssetClass(assetRef: string, collection: typeof relevantPolicies[number], assetType: "Character" | "Furniture"): AssetClass {
        switch (collection) {
            case "pixelTiles": {
                return assetType === "Furniture"
                    ? "furniture" 
                    : this.metadataRegistry.pixelTilesGameMetadata[assetRef].class as AssetClass
            }
            case "grandMasterAdventurers": {
                return this.metadataRegistry.gmasMetadata[assetRef].class as AssetClass
            }
            case "adventurersOfThiolden": {
                const adventurerName  = this.advOfThioldenAdventurerName(assetRef)
                return this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"] as AssetClass
            }
        }
    }

    private advOfThioldenAdventurerName = (assetRef: string): string => {
        const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
        const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
        return adventurerName
    }
    
    private processAssets = (userId: string, policyId: string, assets: {unit: string,quantity: string,chain: boolean}[], policyName:  typeof relevantPolicies[number]) => {
        type AssetsAcomulator = {policyCollectibles: PolicyCollectibles<{}>, creatableAssets: CreateSyncedAsset[]}
        const emptyAssetAcomulator: AssetsAcomulator = {policyCollectibles: [], creatableAssets: []}
        return assets.reduce((acc, asset) => {
            const type =  this.getCollectionType(policyId, asset.unit)
            const collectible = {assetRef: asset.unit, quantity: asset.quantity, type}
            const assetAPS = this.getCollectibleAPS(asset.unit, policyName)
            const aClass = this.getAssetClass(asset.unit, policyName, type)
            const metadata = {class: aClass, ath:assetAPS[0], int: assetAPS[1], cha: assetAPS[2] }
            acc.policyCollectibles.push(collectible)
            acc.creatableAssets.push({...collectible, ...metadata, userId, policyName})
    
            return acc
        }, emptyAssetAcomulator)
    }
}

export class SyncedMortalAssets {
    static async addAsset(userId: string, asset: SyncedAsset): Promise<SResult<{}>>{
        const mortalAssets = await SyncedMortalAsset.findAll({where: {userId}})
        const activeAssetsAmount = this.countActiveAssets(mortalAssets)

        //this will eventually come from another service and will dpeend on the userId
        const maxAssetsAllowed = {characters: 5, furniture: 7}

        const exceedsMaxAllowed = this.assetExceedsMaxAllowed(asset, activeAssetsAmount, maxAssetsAllowed)
        if (exceedsMaxAllowed) {
            return { ctype: "failure", error: `Maximum allowed ${asset.type} assets reached` }
        }

        const mortalAsset = mortalAssets.find(tile => tile.asset_id === asset.asset_id)
        if (mortalAsset) return await this.incrementMortalAssetQuantity(asset, mortalAsset)
        else return await this.createMortalAsset(asset)
    }

    static async removeAsset(userId: string, assetRef:string): Promise<SResult<{}>>{
        const asset = await SyncedMortalAsset.findOne({where: {userId, assetRef}})
        if (!asset) return {ctype: "failure", error: "asset does not belong to user in mortal DB"}
        if(parseInt(asset.quantity) > 1){
            asset.quantity = (parseInt(asset.quantity) - 1).toString()
            await asset.save()
        }
        else{
            await asset.destroy()
        }
        return {ctype: "success"}
    }

    static async updateAssets(toUpdate: {dbId: string, quantity: string}[], transaction?: Transaction){
        const ids = toUpdate.map((asset) => asset.dbId)
        const mortalAssets = await SyncedMortalAsset.findAll({where: {asset_id: ids}, transaction})
        toUpdate.forEach(async (asset) => {
            const mortalAsset = mortalAssets.find(mortalAsset => mortalAsset.asset_id === asset.dbId)
            if(mortalAsset && parseInt(asset.quantity) < parseInt(mortalAsset.quantity)) {
                mortalAsset.quantity = asset.quantity
                await mortalAsset.save({transaction})
            }
        })
    }

    static async getSyncedAssets(userId: string){
        return SyncedMortalAsset.findAll({where: {userId}})
    }

    static async getActive(userId: string, assetRef:string): Promise<number>{
        const asset = await SyncedMortalAsset.findOne({where: {userId, assetRef}})
        if(!asset) return 0
        else return parseInt(asset.quantity)
    }

    private static countActiveAssets(assets: SyncedAsset[]): { characters: number; furniture: number } {
        return assets.reduce(
            (acc, asset) => {
                const quantity = parseInt(asset.quantity)
                asset.type === "Character" ? (acc.characters += quantity) : (acc.furniture += quantity)
                return acc
            },
            { characters: 0, furniture: 0 }
        );
    }
    
    private static assetExceedsMaxAllowed(
        asset: SyncedAsset,
        activeAssetsAmount: { characters: number; furniture: number },
        maxAssetsAllowed:  { characters: number; furniture: number }
    ): boolean {
        return (
            (asset.type === "Character" && activeAssetsAmount.characters >= maxAssetsAllowed.characters) ||
            (asset.type === "Furniture" && activeAssetsAmount.furniture >= maxAssetsAllowed.furniture)
        )
    }

    private static async incrementMortalAssetQuantity(ethernalAsset: SyncedMortalAsset, mortalAsset: SyncedMortalAsset): Promise<SResult<{}>> {
        const ethernalQuantity = parseInt(ethernalAsset.quantity)
        const mortalQuantity = parseInt(mortalAsset.quantity)
            if (ethernalQuantity <= mortalQuantity) {
                return { ctype: "failure", error: "No more assets available to add" };
            }
        mortalAsset.quantity = (mortalQuantity + 1).toString()
        await mortalAsset.save()
        return {ctype: "success"}
    }

    private static async createMortalAsset(asset: SyncedAsset): Promise<SResult<{}>> {
        const newMortal: CreateSyncedAsset = {
            userId: asset.userId,
            assetRef: asset.assetRef,
            quantity: "1",
            policyName: asset.policyName,
            type: asset.type,
            class: asset.class,
            ath: asset.ath,
            int: asset.int,
            cha: asset.cha
        }
        await SyncedMortalAsset.create({ ...newMortal, asset_id: asset.asset_id })
        return {ctype: "success"}
    }
}

