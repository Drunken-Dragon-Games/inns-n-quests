import { RegistryPolicy, WellKnownPolicies } from "../models"
import dotenv from "dotenv"
import { config } from "../../tools-utils"

dotenv.config()

export const wellKnownPolicies: WellKnownPolicies = {
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
}

export const registry: RegistryPolicy[] = Object.values(wellKnownPolicies)
