type Collectible = { assetRef: string, quantity: string, type: "Character" | "Furniture" }

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

export type CollectionFetchingState
    = { ctype: "idle" }
    | { ctype: "loading", details: string }
    | { ctype: "error", details: string }