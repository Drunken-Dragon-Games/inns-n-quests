import { CharacterClass } from "../service-idle-quests/game-vm"

export type CollectionPolicyNames = "pixel-tiles" | "adventurers-of-thiolden" | "grandmaster-adventurers"
export type AssetClass = CharacterClass | "furniture"
export type APSRange = {from?: number, to?: number}
export type APSFilter = {ath:APSRange, int: APSRange, cha: APSRange }
export type CollectionFilter 
    = { page: number, policyFilter: CollectionPolicyNames[], classFilter: AssetClass[], APSFilter: APSFilter}

export type Collectible = { assetRef: string, quantity: string, type: "Character" | "Furniture" }

export type CollectibleStakingInfo = {
    stakingContribution: number 
}

export type PartialMetadata = {
    splashArt: string,
    miniature: string,
    name: string
}

export type CollectibleMetadata = {
    splashArt: string,
    miniature: string,
    name: string,
    aps: [number, number, number], // [0,0,0] for furniture
    class: string, // "furniture" for furniture
    mortalRealmsActive: number,
}

export type PolicyCollectibles<A extends object> = (Collectible & A)[]

export type Collection<A extends object> = { 
    pixelTiles: PolicyCollectibles<A>,
    adventurersOfThiolden: PolicyCollectibles<A>,
    grandMasterAdventurers: PolicyCollectibles<A>,
}
export type StoredMetadata = {class: string, ath: number, int: number, cha: number}
export type CollectionData = {ctype: "IdAndFilter", userId: string, filter?: CollectionFilter} | {ctype: "collection", userId: string, collection: Collection<StoredMetadata>}