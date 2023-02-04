import { wellKnownPoliciesMainnet } from "../../registry-policies"
import { Inventory } from "../../service-asset-management"
import { buildMigrator, connectToDB } from "../../tools-database"
import * as adventurersDB from "./adventurer-db"
import path from "path"
import { Umzug } from "umzug"
import { QueryInterface, Sequelize } from "sequelize"
import { MetadataRegistry } from "../../registry-metadata"
import AdventurerFun from "./adventurer-fun"

const metadataRegistry: MetadataRegistry = {
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
            "name": "PixelTile #2 Test",
            "image": "ipfs://QmPmB7dPymWyvAkpQJfNtNSXjofGNkEWyfCdVVuuUsZsuk",
            "alt": "https://www.drunkendragon.games/s1/PixelTile5.png",
            "rarity": "Rare",
            "type": "Table"
        }
    },
    pixelTilesGameMetadata: {
        "PixelTile1": {
            "class": "rogue",
            "race": "human"
        },
    }
}

let database: Sequelize
let migrator: Umzug<QueryInterface>
const adventurerSynchronizer = new AdventurerFun(metadataRegistry, wellKnownPoliciesMainnet)

beforeAll(async () => {
    database = connectToDB({
        host: "localhost", 
        port: 5432, 
        username: "postgres", 
        password: "admin", 
        database: "service_db" 
    })
    adventurersDB.configureSequelizeModel(database)
    const migrationsPath: string = path.join(__dirname, "..", "migrations").replace(/\\/g, "/")
    migrator = buildMigrator(database, migrationsPath)
})

afterAll(async () => {
    await database.close()
})

beforeEach(async () => {
    await migrator.up()
})

afterEach(async () => {
    await migrator.down()
})

test("syncAdventurers path 1", async () => {
    const userId = "ae991e8c-361f-44e9-afbc-461fb94be2fa"
    const assetInventory1: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ 
            { unit: "PixelTile1", quantity: "2", chain: false },
            { unit: "PixelTile2", quantity: "10", chain: false } 
        ]
    }
    const assetInventory2: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ { unit: "PixelTile1", quantity: "1", chain: false } ]
    }
    await adventurerSynchronizer.syncAdventurers(userId, assetInventory1)
    const adventurers1 = await adventurersDB.AdventurerDB.findAll()
    await adventurerSynchronizer.syncAdventurers(userId, assetInventory2)
    const adventurers2 = await adventurersDB.AdventurerDB.findAll()

    expect(adventurers1.length).toBe(2)
    expect(adventurers1[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers2.length).toBe(1)
    expect(adventurers2[0].assetRef).toBe("PixelTile1")
    expect(adventurers1.some(adv => adv.adventurerId == adventurers2[0].adventurerId)).toBeTruthy()
})

test("syncAdventurers path 2", async () => {
    const userId = "be991e8c-361f-44e9-afbc-461fb94be2fc"
    const assetInventory1: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ { unit: "PixelTile1", quantity: "2", chain: false } ]
    }
    await adventurerSynchronizer.syncAdventurers(userId, assetInventory1)
    const adventurers1 = await adventurersDB.AdventurerDB.findAll()
    await adventurerSynchronizer.syncAdventurers(userId, assetInventory1)
    const adventurers2 = await adventurersDB.AdventurerDB.findAll()

    expect(adventurers1.length).toBe(2)
    expect(adventurers1[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers2.length).toBe(2)
    expect(adventurers2[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers1.map(a => a.adventurerId)).toStrictEqual(adventurers2.map(a => a.adventurerId))
})
