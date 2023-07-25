import { MetadataRegistry, WellKnownPolicies } from "../../tools-assets"
import { SResult } from "../../tools-utils"
import { Collection, PolicyCollectibles } from "../models"
import { SyncedAsset, syncedAssetTablename } from "./assets-sync-db"
import { DbInteractible, CreateSyncedAsset, SyncedAssetChanges } from "./models"
import { QueryTypes, Sequelize } from "sequelize"

export class SyncedAssets {
    public relevantPolicies = ["pixelTiles", "adventurersOfThiolden", "grandMasterAdventurers"] as const
    constructor(
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly metadataRegistry: MetadataRegistry,
    ) {}

    async determineUpdates(userId: string, inventory: {[policyId: string]: { unit: string, quantity: string, chain: boolean }[]}): Promise<{
        syncedAssetChanges: SyncedAssetChanges
        fullCollection: Collection<{}>
    }>{
        const processAssets = (policyId: string, assets: {unit: string,quantity: string,chain: boolean}[], policyName: string) => {
            return assets.reduce((acc, asset) => {
                const collectible = {assetRef: asset.unit, quantity: asset.quantity, type: this.getCollectionType(policyId, asset.unit)}
                
                acc.policyCollectibles.push(collectible)
                acc.creatableAssets.push({...collectible, userId, policyName})
        
                return acc
            }, {} as {policyCollectibles: PolicyCollectibles<{}>, creatableAssets: CreateSyncedAsset[]})
        }
        
        const updatedChainInfo = (acc: ChainInfo, policy: string, assets: {unit: string,quantity: string,chain: boolean}[], policyId: string) => {
            const processedAssets = processAssets(policyId, assets, policy);
            return {
                chainAssets: acc.chainAssets.concat(processedAssets.creatableAssets),
                fullCollection: {...acc.fullCollection, [policy]: processedAssets.policyCollectibles}
            }
        }

        const preSyncedAssets = await SyncedAsset.findAll({where: {userId}})

        type ChainInfo = {chainAssets:  CreateSyncedAsset[], fullCollection: Collection<{}>}
        const emptyChainInfo: ChainInfo = {chainAssets: [], fullCollection: {} as Collection<{}>}

        const chainInfo :ChainInfo = this.relevantPolicies.reduce((acc, policy) => {
            const policyId = this.wellKnownPolicies[policy].policyId
            const assets = inventory[policyId]
            if (assets) return updatedChainInfo(acc, policy, assets, policyId);
            return {...acc, fullCollection: {...acc.fullCollection, [policy]: []}}
        }, emptyChainInfo)

        
        const inventoryRecord: { [assetRef: string]: CreateSyncedAsset } = {}
        const preSyncedRecord: { [assetRef: string]: DbInteractible } = {}

        chainInfo.chainAssets.forEach(asset => inventoryRecord[asset.assetRef] = asset)
        preSyncedAssets.forEach(asset => preSyncedRecord[asset.assetRef] = {quantity: asset.quantity, dbId: asset.assetId})

        const empty: SyncedAssetChanges = {toCreate: [], toDelete: [], toUpdate: []}

        const inventoryKeys = Object.keys(inventoryRecord)
        const preSyncedKeys = Object.keys(preSyncedRecord)

        const uniqueAssetRefs = Array.from(new Set([...inventoryKeys, ...preSyncedKeys]))

        const { toCreate, toDelete, toUpdate } = uniqueAssetRefs
        .reduce(({ toCreate, toDelete, toUpdate }, assetRef) => {
            const inventoryAssetQuantity = inventoryRecord[assetRef]?.quantity || 0
            const preSyncedAssetQuantity = preSyncedRecord[assetRef]?.quantity || 0
            
            if (inventoryAssetQuantity === 0) 
                toDelete.push(preSyncedRecord[assetRef].dbId)
            else if (preSyncedAssetQuantity === 0) 
                toCreate.push(inventoryRecord[assetRef])
            else if (inventoryAssetQuantity !== preSyncedAssetQuantity)
                toUpdate.push(preSyncedRecord[assetRef])
            return (
                { toCreate, toDelete, toUpdate })
        }, empty)

        return { syncedAssetChanges:{toCreate, toDelete, toUpdate}, fullCollection: chainInfo.fullCollection } 
        
    }

    async updateDatabase(syncedAssetChanges: SyncedAssetChanges, sequelize: Sequelize){
        await SyncedAsset.bulkCreate(syncedAssetChanges.toCreate)
        await SyncedAsset.destroy({where: {assetId: syncedAssetChanges.toDelete}})

        const tempTableString = syncedAssetChanges.toUpdate.map(obj => `('${obj.dbId}', '${obj.quantity}')`).join(',')

        const query = `
            WITH 'temp_table' (dbId, quantity) AS (VALUES ${tempTableString})
            UPDATE ${syncedAssetTablename}
            SET quantity = 'temp_table'.quantity
            FROM 'temp_table'
            WHERE ${syncedAssetTablename}.assetId = 'temp_table'.dbId;
        `;

      
        await sequelize.query(query, { type: QueryTypes.UPDATE })
    }

    async bulkCreateFromAssetList(userId: string, inventory: { [policyId: string]: { unit: string, quantity: string, chain: boolean }[] }): Promise<SResult<{collection: Collection<{}>}>>{
        const processAssets = (policyId: string, assets: {unit: string,quantity: string,chain: boolean}[]): PolicyCollectibles<{}> => {
            return assets.reduce((acc, asset) => {
                const collectible = {assetRef: asset.unit, quantity: asset.quantity, type: this.getCollectionType(policyId, asset.unit)}
                //TODO: add {validate: false} to imporove performance
                SyncedAsset.create({userId, ...collectible})
                acc.push(collectible)
                return acc
            }, [] as PolicyCollectibles<{}>)
        }

        const collection: Collection<{}> = this.relevantPolicies.reduce((acc, policy) => {
            const policyId = this.wellKnownPolicies[policy].policyId
            const assets = inventory[policyId]
            if(assets)return {...acc,[policy]: processAssets(policyId, assets)}
            return {...acc,[policy]: []}
        }, {} as Collection<{}>)

        return {ctype: "success", collection}
    }

    private getCollectionType = (policyId: string, assetUnit: string): "Character" | "Furniture" => {
        if(policyId === this.wellKnownPolicies.pixelTiles.policyId){
            const metadataType = this.metadataRegistry.pixelTilesMetadata[assetUnit].type
            return metadataType == "Adventurer" || metadataType == "Monster" || metadataType == "Townsfolk" ? "Character" : "Furniture"
        }
        return "Character"
    }
}