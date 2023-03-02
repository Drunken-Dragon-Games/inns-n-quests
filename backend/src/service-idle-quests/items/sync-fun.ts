
export type PreSynced = {
    assetRef: string
}

export type InventoryAsset = 
    PreSynced & { quantity: number }

export type SyncData<DbAsset extends PreSynced, InvAsset extends InventoryAsset> = {
    toCreate: InvAsset[]
    toDelete: DbAsset[]
    surviving: DbAsset[]
}

export const syncData = <DbAsset extends PreSynced, InvAsset extends InventoryAsset>(
    preSynced: DbAsset[],
    assetInventory: InvAsset[],
): SyncData<DbAsset, InvAsset> => {

    const inventoryRecord: { [assetRef: string]: InvAsset } = {}
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

    const empty: { toCreate: InvAsset[], toDelete: DbAsset[], surviving: DbAsset[] } = 
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
