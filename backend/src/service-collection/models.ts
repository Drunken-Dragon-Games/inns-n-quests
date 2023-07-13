
export type CollectionPolicyNames = "pixel-tiles" | "adventurers-of-thiolden" | "grandmaster-adventurers"

export type CollectionFilter 
    = { policy: CollectionPolicyNames, page: number, keyWords?: string[]}

export type Collectible = { assetRef: string, quantity: string, type: "Character" | "Furniture" }

export type CollectibleStakingInfo = {
    stakingContribution: number 
}

export type PartialMetadata = {
    splashArt: string,
    miniature: string,
    name: string,
    class: string, // "furniture" for furniture
    mortalRealmsActive: number,
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
