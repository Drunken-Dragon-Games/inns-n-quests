import { AssetClass } from "../models"

export type CreateSyncedAsset = {
    userId: string
    assetRef: string
    quantity: string
    policyName: string
    type: "Character" | "Furniture",
    class: AssetClass,
    ath: number,
    int: number,
    cha: number
}
export type SyncedAssetChanges = {
    toCreate: CreateSyncedAsset[]
    toDelete: string[]
    //toUpdate: {dbIds: string[], updatedAssets: CreateSyncedAsset[]}
    toUpdate: {dbId: string, quantity: string}[]
}