import path from "path"
import { Sequelize } from "sequelize"
import { v4 } from "uuid"
import { wellKnownPoliciesMainnet } from "../registry-policies"
import { loadQuestRegistryFromFs } from "../registry-quests"
import { connectToDB } from "../tools-database"
import { failure, success } from "../tools-utils"
import { expectResponse } from "../tools-utils/api-expectations"
import { MutableCalendar } from "../tools-utils/calendar"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import EvenstatsServiceMock from "../tools-utils/mocks/evenstats-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import Random from "../tools-utils/random"
import { aps } from "./challenges/quest-requirement"
import { Adventurer, AvailableQuest, Outcome, TakenQuest } from "./models"
import { IdleQuestsServiceDsl } from "./service"
import { IdleQuestsService } from "./service-spec"
import * as adventurersDB from "./items/adventurer-db"
import * as furnitureDB from "./items/furniture-db"
import { Inventory } from "../service-asset-management"

let service: IdleQuestsService
let database: Sequelize
let calendar: MutableCalendar = new MutableCalendar(new Date(0))

beforeAll(async () => {
    const assetManagementService = new AssetManagementServiceMock()
    const evenstatsService = new EvenstatsServiceMock()
    assetManagementService.listReturns({ status: "ok", inventory: {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [
            { unit: "PixelTile1", quantity: "2", chain: false },
        ],
        [wellKnownPoliciesMainnet.grandMasterAdventurers.policyId]: [
            { unit: "GrandmasterAdventurer1", quantity: "1", chain: false },
            { unit: "GrandmasterAdventurer2", quantity: "1", chain: false },
        ],
        [wellKnownPoliciesMainnet.adventurersOfThiolden.policyId]: [
            { unit: "AdventurerOfThiolden1", quantity: "1", chain: false },
            { unit: "AdventurerOfThiolden2", quantity: "1", chain: false },
        ]
    }})
    database = connectToDB({
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "admin",
        database: "service_db"
    })
    const idleQuestsServiceConfig = {
        rewardFactor: 1,
        durationFactor: 1
    }
    const idleQuestServiceDependencies = {
        random: new Random("test"),
        calendar,
        database,
        evenstatsService: evenstatsService.service,
        assetManagementService: assetManagementService.service,
        metadataRegistry: testMetadataRegistry,
        questsRegistry: await loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "stubs", "test-quest-registry.yaml"), "yaml"),
        wellKnownPolicies: wellKnownPoliciesMainnet
    }
    service = await IdleQuestsServiceDsl.loadFromConfig(idleQuestsServiceConfig, idleQuestServiceDependencies)
    await service.loadDatabaseModels()
})

afterAll(async () => {
    await service.unloadDatabaseModels()
    await database.close()
})

test("health endpoint", async () => {
    expect(await service.health()).toBeTruthy()
})

test("Sync Adventurers", async () => {
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
    await service.adventurerFun.syncAdventurers(userId, assetInventory1)
    const assets1 = await adventurersDB.AdventurerDB.findAll({ where: { userId }})
    await service.adventurerFun.syncAdventurers(userId, assetInventory2)
    const assets2 = await adventurersDB.AdventurerDB.findAll({ where: { userId }})

    expect(assets1.length).toBe(2)
    expect(assets1[0].assetRef).toBe("PixelTile1")
    expect(assets1[1].assetRef).toBe("PixelTile1")
    expect(assets2.length).toBe(1)
    expect(assets2[0].assetRef).toBe("PixelTile1")
    expect(assets1.some(adv => adv.adventurerId == assets2[0].adventurerId)).toBeTruthy()
})

test("Sync Furniture", async () => {
    const userId = v4()
    const assetInventory1: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ 
            { unit: "PixelTile1", quantity: "10", chain: false },
            { unit: "PixelTile2", quantity: "2", chain: false } 
        ]
    }
    const assetInventory2: Inventory = {
        [wellKnownPoliciesMainnet.pixelTiles.policyId]: [ { unit: "PixelTile2", quantity: "1", chain: false } ]
    }
    await service.furnitureFun.syncFurniture(userId, assetInventory1)
    const assets1 = await furnitureDB.FurnitureDB.findAll({ where: { userId }})
    await service.furnitureFun.syncFurniture(userId, assetInventory2)
    const assets2 = await furnitureDB.FurnitureDB.findAll({ where: { userId }})

    expect(assets1.length).toBe(2)
    expect(assets1[0].assetRef).toBe("PixelTile2")
    expect(assets1[1].assetRef).toBe("PixelTile2")
    expect(assets2.length).toBe(1)
    expect(assets2[0].assetRef).toBe("PixelTile2")
    expect(assets1.some(adv => adv.furnitureId == assets2[0].furnitureId)).toBeTruthy()
})

test("Level up adventurers", async () => {
    const userId = v4()
    const adventurers = await service.adventurerFun.syncAdventurers(userId, {
        [wellKnownPoliciesMainnet.grandMasterAdventurers.policyId]: [ 
            { unit: "GrandmasterAdventurer1", quantity: "1", chain: false },
            { unit: "GrandmasterAdventurer2", quantity: "1", chain: false },
        ]
    })
    await service.adventurerFun.levelUpAdventurers(adventurers, { apsExperience: aps(50,50,50) })
    const adventurersAfter = await adventurersDB.AdventurerDB.findAll({ where: { userId }})
    expect(adventurersAfter.map(a => [a.athXP, a.intXP, a.chaXP]))
        .toStrictEqual([[20,23,10], [3,15,5]])
})

test("Normal quest flow 1", async () => {
    const userId = v4()
    const adventurers = await getAllAdventurers(userId)
    const availableQuests = await getAvailableQuests("Auristar")
    const adventurersToGoOnQuest = adventurers.map(a => a.adventurerId!)
    const acceptedQuest = await acceptQuest(userId, availableQuests[0].questId, adventurersToGoOnQuest)
    const takenQuests1 = await getTakenQuests(userId)
    const claimBeforeTimeResponse = await service.claimQuestResult(userId, acceptedQuest.takenQuestId!)
    calendar.moveSeconds(acceptedQuest.quest.duration)
    const outcome = await claimQuestResult(userId, acceptedQuest.takenQuestId!)
    const takenQuests2 = await getTakenQuests(userId)

    expect(adventurers.length).toBe(6)
    expect(acceptedQuest.quest.questId).toBe(availableQuests[0].questId)
    expect(takenQuests1.length).toBe(1)
    expect(takenQuests1[0].adventurerIds).toStrictEqual(adventurersToGoOnQuest)
    expect(takenQuests1[0].quest.questId).toEqual(availableQuests[0].questId)
    expect(claimBeforeTimeResponse.status).toBe("quest-not-finished")
    expect(takenQuests2.length).toBe(0)
    expect(outcome.ctype).toBe("success-outcome")
})

async function getAllAdventurers(userId: string): Promise<Adventurer[]> {
    return await expectResponse(
        service.getInventory(userId),
        response =>
            response.status === "ok" ?
            success(response.inventory) :
            failure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function getAvailableQuests(location: string): Promise<AvailableQuest[]> {
    return await expectResponse(
        service.getAvailableQuests(location),
        response =>
            response.status === "ok" ?
            success(response.quests) :
            failure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<TakenQuest> {
    return await expectResponse(
        service.acceptQuest(userId, questId, adventurerIds),
        response =>
            response.status === "ok" ?
            success(response.takenQuest) :
            failure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function getTakenQuests(userId: string): Promise<TakenQuest[]> {
    return await expectResponse(
        service.getTakenQuests(userId),
        response =>
            response.status === "ok" ?
            success(response.quests) :
            failure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function claimQuestResult(userId: string, takenQuestId: string): Promise<Outcome> {
    return await expectResponse(
        service.claimQuestResult(userId, takenQuestId),
        response =>
            response.status === "ok" ?
            success(response.outcome) :
            failure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}