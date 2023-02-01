import syncAdventurers from "./sync-adventurers"
import metadataCache from "./metadata-cache"
import { wellKnownPolicies } from "../../service-asset-management/registry/registry-testnet"
import { Inventory, WellKnownPolicies } from "../../service-asset-management"
import { buildMigrator, connectToDB, DBConfig } from "../../tools-database"
import * as adventurersDB from "./adventurer-db"
import path from "path"
import { Umzug } from "umzug"
import { QueryInterface } from "sequelize"

const databaseConfig: DBConfig = 
    { host: "localhost"
    , port: 5432
    , username: "postgres"
    , password: "admin"
    , database: "service_db" 
    }

let migrator: Umzug<QueryInterface>

beforeAll(async () => {
    const database = connectToDB(databaseConfig)
    adventurersDB.configureSequelizeModel(database)
    const migrationsPath: string = path.join(__dirname, "..", "migrations").replace(/\\/g, "/")
    migrator = buildMigrator(database, migrationsPath)
    // This causes open handles, that is becuase axios somehow maintains a connection pool which cannot be manually cloased
    // we will tolerate this for now, but it is not ideal
    await metadataCache.load()
})

beforeEach(async () => {
    await migrator.up()
})

afterEach(async () => {
    await migrator.down()
})

test("syncAdventurers path 1", async () => {
    const userId = "ae991e8c-361f-44e9-afbc-461fb94be2fc"
    const assetInventory1: Inventory = {
        [wellKnownPolicies.pixelTiles.policyId]: [ 
            { unit: "PixelTile1", quantity: "2", chain: false },
            { unit: "PixelTile5", quantity: "10", chain: false } 
        ]
    }
    const assetInventory2: Inventory = {
        [wellKnownPolicies.pixelTiles.policyId]: [ { unit: "PixelTile1", quantity: "1", chain: false } ]
    }
    await syncAdventurers(userId, assetInventory1, wellKnownPolicies)
    const adventurers1 = await adventurersDB.DBAdventurer.findAll()
    await syncAdventurers(userId, assetInventory2, wellKnownPolicies)
    const adventurers2 = await adventurersDB.DBAdventurer.findAll()

    expect(adventurers1.length).toBe(2)
    expect(adventurers1[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers2.length).toBe(1)
    expect(adventurers2[0].assetRef).toBe("PixelTile1")
    expect(adventurers1.some(adv => adv.adventurerId == adventurers2[0].adventurerId)).toBeTruthy()
})

test("syncAdventurers path 2", async () => {
    const userId = "ae991e8c-361f-44e9-afbc-461fb94be2fc"
    const assetInventory1: Inventory = {
        [wellKnownPolicies.pixelTiles.policyId]: [ { unit: "PixelTile1", quantity: "2", chain: false } ]
    }
    await syncAdventurers(userId, assetInventory1, wellKnownPolicies)
    const adventurers1 = await adventurersDB.DBAdventurer.findAll()
    await syncAdventurers(userId, assetInventory1, wellKnownPolicies)
    const adventurers2 = await adventurersDB.DBAdventurer.findAll()

    expect(adventurers1.length).toBe(2)
    expect(adventurers1[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers2.length).toBe(2)
    expect(adventurers2[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers1.map(a => a.adventurerId)).toStrictEqual(adventurers2.map(a => a.adventurerId))
})
