import { wellKnownPoliciesMainnet } from "../../registry-policies"
import { Inventory } from "../../service-asset-management"
import { buildMigrator, connectToDB } from "../../tools-database"
import * as adventurersDB from "./adventurer-db"
import path from "path"
import { Umzug } from "umzug"
import { QueryInterface, Sequelize } from "sequelize"
import AdventurerFun from "./adventurer-fun"
import { testMetadataRegistry } from "../../tools-utils/mocks/test-metadata-registry"

let database: Sequelize
let migrator: Umzug<QueryInterface>
const adventurerSynchronizer = new AdventurerFun(testMetadataRegistry, wellKnownPoliciesMainnet)

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
