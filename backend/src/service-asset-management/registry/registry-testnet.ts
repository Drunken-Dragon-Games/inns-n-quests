import { RegistryPolicy } from "../models"
import dotenv from "dotenv"
import { config } from "../../tools-utils"

dotenv.config()

export const testnetRegistry: RegistryPolicy[] = [
    {
        "policyId": config.stringOrError("POLICY_PIXEL_TILES"), // new
        "name": "Pixel Tiles",
        "description": "First Drunken Dragon collection ever. Adventurers awaiting epic quests and furniture to expand your Inn & Tavern.",
        "tags": ["adventurers", "furniture"],
    },
    {
        "policyId": config.stringOrError("POLICY_GMAS"),
        "name": "Grandmaster Adventurers",
        "description": "10,000 unique looking adventurers made exclusively to reward our early supporters.",
        "tags": ["adventurers"],
    },
    {
        "policyId": config.stringOrError("POLICY_THIOLDEN"),
        "name": "Adventurers of Thiolden",
        "description": "50 Characters from the Thiolden region.",
        "tags": ["adventurers"],
    },
    {
        "policyId": config.stringOrError("POLICY_DRAGON_SILVER"),
        "name": "Dragon Silver",
        "description": "",
        "tags": ["resource"],
    },
    {
        "policyId": config.stringOrError("POLICY_EMOJIS"),
        "name": "Emojis",
        "description": "",
        "tags": ["vanity"],
    },
]
