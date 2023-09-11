import { MetadataRegistry } from "../../tools-assets/registry-metadata"

export const testMetadataRegistry: MetadataRegistry = {
    advOfThioldenAppMetadata: [{ "adv": "vimtyr", "n": "1", "ath": 10, "int": 11, "cha": 11, "chr": true }, { "adv": "terrorhertz", "n": "2", "ath": 10, "int": 11, "cha": 11, "chr": true }],
    advOfThioldenGameMetadata: {
        "terrorhertz": {
            "Adventurer": "Terrorhertz",
            "Title": "Herald of the Drunken Dragon",
            "Race": "Human",
            "Age": "35",
            "Faction": "Adventurer of the Drunken Dragon",
            "Game Class": "Bard",
            "Lore Class": "Metal Bard",
            "Concept Artists": ["@limakiki.art"],
            "Splash Art Composition Artists": ["@limakiki.art"],
            "Pixel Artists": ["@mayteesk"],
            "Miniature Pixel Artists": ["@lukegger", "@limakiki.art"]
        },
        "vimtyr": {
            "Adventurer": "Vimtyr",
            "Title": "The Whispering Axe",
            "Race": "Human",
            "Age": "29",
            "Faction": "Adventurer of the Drunken Dragon",
            "Game Class": "Rogue",
            "Lore Class": "Vilkyr",
            "Concept Artists": ["@limakiki.art"],
            "Splash Art Composition Artists": ["@limakiki.art", "@killerkun"],
            "Pixel Artists": ["@killerkun"],
            "Miniature Pixel Artists": ["@killerkun", "@lukegger"]
        }
    },
    gmasMetadata: {
        "GrandmasterAdventurer1": {
            "name": "Grandmaster Adventurer #1",
            "image": "ipfs://QmNdga26KW6mzYUiPb6N2iqfGk86BLLJhfGzoG7q5E67a6",
            "race": "Human",
            "subrace": "Eastern Kingdoms",
            "genre": "Female",
            "class": "Ranger",
            "armor": "2",
            "weapon": "5"
        },
        "GrandmasterAdventurer2": {
            "name": "Grandmaster Adventurer #2",
            "image": "ipfs://QmRd7CJayK7u7dNDjZdvJw3k9eTJQwVVEeNmAYT1j5Jb16",
            "race": "Human",
            "subrace": "Eastern Kingdoms",
            "genre": "Female",
            "class": "Paladin",
            "armor": "2",
            "weapon": "1"
        }
    },
    pixelTilesMetadata: {
        "PixelTile1": {
            "name": "PixelTile #1 Rogue",
            "image": "ipfs://QmUSw5cpbyKoey3tLCysjZ6hcoC9femAA34V6cjKGWJ97U",
            "alt": "https://www.drunkendragon.games/s1/PixelTile1.png",
            "rarity": "Uncommon",
            "type": "Adventurer"
        },
        "PixelTile2": {
            "name": "PixelTile #2 Table",
            "image": "ipfs://QmPmB7dPymWyvAkpQJfNtNSXjofGNkEWyfCdVVuuUsZsuk",
            "alt": "https://www.drunkendragon.games/s1/PixelTile5.png",
            "rarity": "Rare",
            "type": "Table"
        }
    },
    pixelTilesGameMetadata: {
        "PixelTile1": {
            "class": "Rogue",
            "race": "human"
        },
    }
}
