import { config } from "../tools-utils"

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
    , dragonGold: RegistryPolicy
    }

export const onlyPolicies = (wellKnownPolicies: WellKnownPolicies): string[] =>
    Object.values(wellKnownPolicies).map(policy => policy.policyId)

export const wellKnownPoliciesMainnet: WellKnownPolicies = {
    pixelTiles:
    {
        "policyId": "f4988f549728dc76b58d7677849443caf6e5385dc67e6c25f6aa901e",
        "name": "Pixel Tiles",
        "description": "First Drunken Dragon collection ever. Adventurers awaiting epic quests and furniture to expand your Inn & Tavern.",
        "tags": ["adventurers", "furniture"],
    },
    grandMasterAdventurers:
    {
        "policyId": "95d9a98c2f7999a3d5e0f4d795cb1333837c09eb0f24835cd2ce954c",
        "name": "Grandmaster Adventurers",
        "description": "10,000 unique looking adventurers made exclusively to reward our early supporters.",
        "tags": ["adventurers"],
    },
    adventurersOfThiolden:
    {
        "policyId": "702cbdb06a81ef2fa4f85f9e32159c03f502539d762a71194fc11eb3",
        "name": "Adventurers of Thiolden",
        "description": "50 Characters from the Thiolden region.",
        "tags": ["adventurers"],
    },
    dragonSilver:
    {
        "policyId": "cfd283330fdb8b57d67029a06a96e02bd84ed48c14c951f8e70a5736",
        "name": "Dragon Silver",
        "description": "",
        "tags": ["resource"],
    },
    ddeXjpgstore:
    {
        "policyId": "e41ec94a758ca2e670a1c2d6ce2037589251d434ff19d46705a72716",
        "name": "DDE x JPG Dragon TestMint",
        "description": "",
        "tags": ["pets"],
    },
    emojis:
    {
        "policyId": "f04013fcf5d7eec7c2f7623332900f9691c75a73c740f9f1459fe6ee",
        "name": "Emojis",
        "description": "Vanity emoji sets for Drunken Dragon Inns",
        "tags": ["vanity"],
    },
    dragonGold:
    {
        "policyId": "f5f8e854af532d828d00381df799ba6db22d825c9b140e1d5795cf85",
        "name": "Dragon Gold",
        "description": "Governance token of the Drunken Dragon Universe decentralized fantasy franchise",
        "tags": ["governance"], 
    }
}

export const loadWellKnownPoliciesFromEnv = (): WellKnownPolicies => ({
    pixelTiles:
    {
        "policyId": config.stringOrError("POLICY_PIXEL_TILES"), 
        "name": "Pixel Tiles",
        "description": "First Drunken Dragon collection ever. Adventurers awaiting epic quests and furniture to expand your Inn & Tavern.",
        "tags": ["adventurers", "furniture"],
    },
    grandMasterAdventurers:
    {
        "policyId": config.stringOrError("POLICY_GMAS"),
        "name": "Grandmaster Adventurers",
        "description": "10,000 unique looking adventurers made exclusively to reward our early supporters.",
        "tags": ["adventurers"],
    },
    adventurersOfThiolden:
    {
        "policyId": config.stringOrError("POLICY_THIOLDEN"),
        "name": "Adventurers of Thiolden",
        "description": "50 Characters from the Thiolden region.",
        "tags": ["adventurers"],
    },
    dragonSilver:
    {
        "policyId": config.stringOrError("POLICY_DRAGON_SILVER"),
        "name": "Dragon Silver",
        "description": "",
        "tags": ["resource"],
    },
    ddeXjpgstore:
    {
        "policyId": "e41ec94a758ca2e670a1c2d6ce2037589251d434ff19d46705a72716",
        "name": "DDE x JPG Dragon TestMint",
        "description": "",
        "tags": ["pets"],
    },
    emojis:
    {
        "policyId": config.stringOrError("POLICY_EMOJIS"),
        "name": "Emojis",
        "description": "Vanity emoji sets for Drunken Dragon Inns",
        "tags": ["vanity"],
    },
    dragonGold:
    {
        "policyId": config.stringOrError("POLICY_DRAGON_GOLD"),
        "name": "Dragon Gold",
        "description": "",
        "tags": ["governance"],
    }
})