import { CharacterClass, CharacterClasses } from "../game/game-vm"

type Collectible = { assetRef: string, quantity: string, type: "Character" | "Furniture" }
export type UICollectible = Collectible & CollectibleStakingInfo & CollectibleMetadata

export type PolicyCollectibles<A extends object> = (Collectible & A)[]

type Collection<A extends object> = { 
    pixelTiles: PolicyCollectibles<A>,
    adventurersOfThiolden: PolicyCollectibles<A>,
    grandMasterAdventurers: PolicyCollectibles<A>,
}

type CollectibleStakingInfo = {
    stakingContribution: number 
}

type CollectibleMetadata = {
    splashArt: string,
    miniature: string,
    name: string,
    aps: [number, number, number], // [0,0,0] for furniture
    class: string, // "furniture" for furniture
    mortalRealmsActive: number,
}

type GetCollectionResult<A extends object> 
    = { ctype: "success", collection: Collection<A> }
    | { ctype: "failure", error: string }

export type PolicyCollectiblesWithUIData = PolicyCollectibles<CollectibleStakingInfo & CollectibleMetadata>
export type CollectionWithUIMetada = Collection<CollectibleStakingInfo & CollectibleMetadata>
export type CollectionWithUIMetadataResult = GetCollectionResult<CollectibleStakingInfo & CollectibleMetadata>
export type CollectionWithGameData = Collection<CollectibleMetadata>

export type CollectionFetchingState
    = { ctype: "idle" }
    | { ctype: "loading", details: string }
    | { ctype: "error", details: string }

export type CollectionPolicyNames = "pixel-tiles" | "adventurers-of-thiolden" | "grandmaster-adventurers"
export type AssetClass = CharacterClass | "furniture"
export type APSRange = {from?: number, to?: number}
export type APSFilter = {ath:APSRange, int: APSRange, cha: APSRange }
export type CollectionFilter 
    = { page: number,  policyFilter: CollectionPolicyNames[], classFilter: AssetClass[], APSFilter: APSFilter}
export const filterClasses: AssetClass[] = [...CharacterClasses, 'furniture']
export const collectionPolicies: CollectionPolicyNames[] = ["pixel-tiles", "adventurers-of-thiolden", "grandmaster-adventurers"]