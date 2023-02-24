
export type PreSynced<Collection extends string> = {
    assetRef: string
    collection: Collection
}

export type InventoryAsset<Collection extends string> = 
    PreSynced<Collection> & { quantity: number }

export type SyncData<Collection extends string, DbAsset extends PreSynced<Collection>> = {
    toCreate: InventoryAsset<Collection>[]
    toDelete: DbAsset[]
    surviving: DbAsset[]
}

export const syncData = <Collection extends string, DbAsset extends PreSynced<Collection>>(
    preSynced: DbAsset[],
    assetInventory: InventoryAsset<Collection>[],
    assetId: (asset: DbAsset) => string,
): SyncData<Collection, DbAsset> => {
    const assetDifference = assetInventory
        .map(asset => {
            const allSyncedFurnitureQuantity =
                preSynced.filter(preSynced => preSynced.assetRef == asset.assetRef).length
            return { ...asset, quantity: asset.quantity - allSyncedFurnitureQuantity }
        })
        const toCreate = assetDifference.filter(asset => asset.quantity > 0)
        const assetFurnitureToDelete = assetDifference.filter(asset => asset.quantity < 0)
        // Pick the pre-synced assets to delete based on the asset difference
        const toDelete = assetFurnitureToDelete.flatMap(asset => {
            const preSyncedFurnitureToDelete = preSynced
                .filter(preSynced => preSynced.assetRef == asset.assetRef)
                .slice(0, Math.abs(asset.quantity))
            return preSyncedFurnitureToDelete
        })
        // Pick the pre-synced assets that are not going to be deleted
        const surviving = preSynced.filter(preSynced =>
            !toDelete.map(asset => assetId(asset)).includes(assetId(preSynced)))
        return { toCreate, toDelete, surviving }
}
