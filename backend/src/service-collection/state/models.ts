export type DbInteractible = {dbId: string, quantity: string}
export type CreateSyncedAsset = {
    userId: string
    assetRef: string
    quantity: string
    policyName: string
    type: "Character" | "Furniture"
}
export type SyncedAssetChanges = {
    toCreate: CreateSyncedAsset[]
    toDelete: string[]
    toUpdate: DbInteractible[]
}