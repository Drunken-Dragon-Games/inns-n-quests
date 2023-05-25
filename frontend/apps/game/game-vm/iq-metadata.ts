
export type AdvOfThioldenAppMetadata = 
    { adv: string, n: string, ath: number, int: number, cha: number, chr: boolean }[]

export type AdvOfThioldenGameMetadata =
    {  [adventurer: string]: { 
        "Adventurer": string, "Title": string, "Race": string, "Age": string, "Faction": string, "Game Class": string,
        "Lore Class": string, "Concept Artists": string[], "Splash Art Composition Artists": string[], "Pixel Artists": string[],
        "Miniature Pixel Artists": string[]
    } }

export type GmasMetadata =
    { [assetName: string]: { name: string, image: string, race: string, subrace: string, genre: string, class: string, armor: string, weapon: string } }

export type PixelTilesMetadata = 
    { [assetName: string]: { name: string, image: string, alt: string, 
        rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Unique", 
        type: "Adventurer" | "Table" | "Hearth" | "Bar Barrels" | "Simple Prop" | "Townsfolk" | "Wall Banner" | "Artifact" | "Monster" | "Rug"
    } }

export type PixelTilesGameMetadata = 
    { [assetName: string]: { class: string, race: string } }

export type MetadataRegistry = {
    advOfThioldenAppMetadata: AdvOfThioldenAppMetadata,
    advOfThioldenGameMetadata: AdvOfThioldenGameMetadata,
    gmasMetadata: GmasMetadata,
    pixelTilesMetadata: PixelTilesMetadata,
    pixelTilesGameMetadata: PixelTilesGameMetadata,
}

export type RegistryPolicy =
    { policyId: string
    , name: string
    , description: string
    , tags: string[]
    }

export type WellKnownPolicies =
    { pixelTiles: RegistryPolicy 
    , grandMasterAdventurers: RegistryPolicy
    , adventurersOfThiolden: RegistryPolicy
    , dragonSilver: RegistryPolicy
    , ddeXjpgstore: RegistryPolicy
    , emojis: RegistryPolicy
    }

export const emptyMetadataRegistry: MetadataRegistry = {
    advOfThioldenAppMetadata: [],
    advOfThioldenGameMetadata: {},
    gmasMetadata: {},
    pixelTilesMetadata: {},
    pixelTilesGameMetadata: {},
} 

export const emptyWellKnownPolicies: WellKnownPolicies = {
    pixelTiles: { policyId: "", name: "", description: "", tags: [] },
    grandMasterAdventurers: { policyId: "", name: "", description: "", tags: [] },
    adventurersOfThiolden: { policyId: "", name: "", description: "", tags: [] },
    dragonSilver: { policyId: "", name: "", description: "", tags: [] },
    ddeXjpgstore: { policyId: "", name: "", description: "", tags: [] },
    emojis: { policyId: "", name: "", description: "", tags: [] },
}