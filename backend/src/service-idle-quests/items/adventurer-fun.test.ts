import path from "path"
import { v4 } from "uuid"
import { QueryInterface, Sequelize } from "sequelize"
import { Umzug } from "umzug"
import { wellKnownPoliciesMainnet } from "../../registry-policies"
import { Inventory } from "../../service-asset-management"
import { buildMigrator, connectToDB } from "../../tools-database"
import { testMetadataRegistry } from "../../tools-utils/mocks/test-metadata-registry"
import Random from "../../tools-utils/random"
import { aps } from "../challenges/quest-requirement"
import { Adventurer } from "../models"
import * as adventurersDB from "./adventurer-db"
import AdventurerFun, { apsSum, generateRandomAPS } from "./adventurer-fun"

let database: Sequelize
let migrator: Umzug<QueryInterface>
let adventurers: Adventurer[]
const userId = v4()
const advFun = new AdventurerFun(testMetadataRegistry, wellKnownPoliciesMainnet)

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
    await migrator.up()
    const assetInventory1: Inventory = {
        [wellKnownPoliciesMainnet.grandMasterAdventurers.policyId]: [ 
            { unit: "GrandmasterAdventurer1", quantity: "1", chain: false },
            { unit: "GrandmasterAdventurer2", quantity: "1", chain: false },
        ]
    }
    adventurers = await advFun.syncAdventurers(userId, assetInventory1)
})

afterAll(async () => {
    await database.close()
})

test("generateRandomAPS simple check", () => {
    const rand = new Random("test")
    expect(apsSum(generateRandomAPS(30, rand))).toBe(30)
    expect(apsSum(generateRandomAPS(28, rand))).toBe(28)
    expect(apsSum(generateRandomAPS(21, rand))).toBe(21)
    expect(apsSum(generateRandomAPS(16, rand))).toBe(16)
    expect(apsSum(generateRandomAPS(11, rand))).toBe(11)
    expect(apsSum(generateRandomAPS(10, rand))).toBe(10)
    expect(apsSum(generateRandomAPS(6, rand))).toBe(6)
    expect(apsSum(generateRandomAPS(3, rand))).toBe(3)
})

test("level up adventurers", async () => {
    await advFun.levelUpAdventurers(adventurers, { apsExperience: aps(50,50,50) })
    const adventurersAfter = await adventurersDB.AdventurerDB.findAll({ where: { userId }})
    expect(adventurersAfter.map(a => [a.athXP, a.intXP, a.chaXP]))
        .toStrictEqual([[20,23,10], [3,15,5]])
})

test("syncAdventurers path 1", async () => {
    const userId = v4()
    const assetInventory1: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ 
            { unit: "PixelTile1", quantity: "2", chain: false },
            { unit: "PixelTile2", quantity: "10", chain: false } 
        ]
    }
    const assetInventory2: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ { unit: "PixelTile1", quantity: "1", chain: false } ]
    }
    await advFun.syncAdventurers(userId, assetInventory1)
    const adventurers1 = await adventurersDB.AdventurerDB.findAll({ where: { userId }})
    await advFun.syncAdventurers(userId, assetInventory2)
    const adventurers2 = await adventurersDB.AdventurerDB.findAll({ where: { userId }})

    expect(adventurers1.length).toBe(2)
    expect(adventurers1[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers2.length).toBe(1)
    expect(adventurers2[0].assetRef).toBe("PixelTile1")
    expect(adventurers1.some(adv => adv.adventurerId == adventurers2[0].adventurerId)).toBeTruthy()
})

test("syncAdventurers path 2", async () => {
    const userId = v4()
    const assetInventory1: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ { unit: "PixelTile1", quantity: "2", chain: false } ]
    }
    await advFun.syncAdventurers(userId, assetInventory1)
    const adventurers1 = await adventurersDB.AdventurerDB.findAll({ where: { userId }})
    await advFun.syncAdventurers(userId, assetInventory1)
    const adventurers2 = await adventurersDB.AdventurerDB.findAll({ where: { userId }})

    expect(adventurers1.length).toBe(2)
    expect(adventurers1[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers2.length).toBe(2)
    expect(adventurers2[0].assetRef).toBe("PixelTile1")
    expect(adventurers1[1].assetRef).toBe("PixelTile1")
    expect(adventurers1.map(a => a.adventurerId)).toStrictEqual(adventurers2.map(a => a.adventurerId))
})