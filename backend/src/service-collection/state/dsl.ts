import { MetadataRegistry, WellKnownPolicies } from "../../tools-assets"
import { LoggingContext } from "../../tools-tracing"
import { SResult } from "../../tools-utils"
import { Collection, CollectionPolicyNames, PolicyCollectibles } from "../models"
import { SyncedAsset, syncedAssetTablename } from "./assets-sync-db"
import { CreateSyncedAsset, SyncedAssetChanges } from "./models"
import { QueryTypes, Sequelize, Transaction } from "sequelize"

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

    async determineUpdates(userId: string, inventory: {[policyId: string]: { unit: string, quantity: string, chain: boolean }[]}): Promise<{
        syncedAssetChanges: SyncedAssetChanges
        fullCollection: Collection<{}>
    }>{
        try{
        const processAssets = (policyId: string, assets: {unit: string,quantity: string,chain: boolean}[], policyName: string) => {
            type AssetsAcomulator = {policyCollectibles: PolicyCollectibles<{}>, creatableAssets: CreateSyncedAsset[]}
            const emptyAssetAcomulator: AssetsAcomulator = {policyCollectibles: [], creatableAssets: []}
            return assets.reduce((acc, asset) => {
                const collectible = {assetRef: asset.unit, quantity: asset.quantity, type: this.getCollectionType(policyId, asset.unit)}
                
                acc.policyCollectibles.push(collectible)
                acc.creatableAssets.push({...collectible, userId, policyName})
        
                return acc
            }, emptyAssetAcomulator)
        }
        
        const updatedChainInfo = (acc: ChainInfo, policy: string, assets: {unit: string,quantity: string,chain: boolean}[], policyId: string) => {
            const processedAssets = processAssets(policyId, assets, policy)
            return {
                chainAssets: acc.chainAssets.concat(processedAssets.creatableAssets),
                fullCollection: {...acc.fullCollection, [policy]: processedAssets.policyCollectibles}
            }
        }
        
        const preSyncedAssets = await SyncedAsset.findAll({where: {userId}})

        type ChainInfo = {chainAssets:  CreateSyncedAsset[], fullCollection: Collection<{}>}
        const emptyChainInfo: ChainInfo = {chainAssets: [], fullCollection: {} as Collection<{}>}

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
                const updates = syncedAssetChanges.toUpdate.map(
                    ({ dbId, quantity }) => `UPDATE ${SyncedAsset.tableName} SET quantity='${quantity}' WHERE asset_id='${dbId}'`
                ).join("; ")
                await sequelize.query(updates, { transaction })
            })
        } catch (error: any) {
            logger ? logger.log.error(error.message) :  console.log(error.message)
        }
    }

    async getSyncedAssets(userId: string){
        //TODO: here we will hanlde filters
        return SyncedAsset.findAll({where: {userId}})
    }

    private getCollectionType = (policyId: string, assetUnit: string): "Character" | "Furniture" => {
        if(policyId === this.wellKnownPolicies.pixelTiles.policyId){
            const metadataType = this.metadataRegistry.pixelTilesMetadata[assetUnit].type
            return metadataType == "Adventurer" || metadataType == "Monster" || metadataType == "Townsfolk" ? "Character" : "Furniture"
        }
        return "Character"
    }
}