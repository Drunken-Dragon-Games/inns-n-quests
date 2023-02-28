
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

    const inventoryRecord: { [assetRef: string]: { assetRef: string, collection: Collection, quantity: number } } = {}
    assetInventory.forEach(asset => {
        if (inventoryRecord[asset.assetRef])
            inventoryRecord[asset.assetRef].quantity += asset.quantity
        else
            inventoryRecord[asset.assetRef] = asset
    })

    const preSyncedRecord: { [assetRef: string]: DbAsset[] } = {}
    preSynced.forEach(asset => {
        if (preSyncedRecord[asset.assetRef])
            preSyncedRecord[asset.assetRef].push(asset)
        else
            preSyncedRecord[asset.assetRef] = [asset]
    })

    const empty: { toCreate: InventoryAsset<Collection>[], toDelete: DbAsset[], surviving: DbAsset[] } = 
        { toCreate: [], toDelete: [], surviving: [] }

    const result = Object.values(inventoryRecord)
        .reduce(({ toCreate, toDelete, surviving }, inventoryAsset) => {
            const preSyncedQuantity = preSyncedRecord[inventoryAsset.assetRef]?.length || 0
            // If possitive, create new assets. If negative, delete assets. If zero, add to surviving.
            const diff = inventoryAsset.quantity - preSyncedQuantity
            if (diff > 0) 
                toCreate.push({ ...inventoryAsset, quantity: diff })
            else if (diff < 0) 
                toDelete.push(...preSyncedRecord[inventoryAsset.assetRef].slice(0, Math.abs(diff)))
            else 
                surviving.push(...preSyncedRecord[inventoryAsset.assetRef])
            return (
                { toCreate, toDelete, surviving })
        }, empty)

    return result
}
