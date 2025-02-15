import path from "path"
import { Sequelize } from "sequelize"
import { v4 } from "uuid"
import { wellKnownPoliciesMainnet } from "../tools-assets/registry-policies"
import { Inventory } from "../service-asset-management"
import { connectToDB } from "../tools-database"
import { sfailure, success } from "../tools-utils"
import { expectResponse } from "../tools-utils/api-expectations"
import { MutableCalendar } from "../tools-utils/calendar"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import EvenstatsServiceMock from "../tools-utils/mocks/evenstats-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import * as vm from "./game-vm"
import { EncounterOutcome } from "./game-vm"
import { AvailableStakingQuest, Character, TakenStakingQuest } from "./models"
import { IdleQuestsServiceDsl } from "./service"
import { IdleQuestsService } from "./service-spec"
import { CharacterDB, CharacterState } from "./state/character-state"
import { FurnitureDB, FurnitureState } from "./state/furniture-state"
import { loadQuestRegistryFromFs } from "./state/staking-quests-registry"
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock"
import CollectionServiceMock from "../tools-utils/mocks/collection-service-mock"

let service: IdleQuestsService
let database: Sequelize
let calendar: MutableCalendar = new MutableCalendar(new Date(0))
let characterState: CharacterState
let furnitureState: FurnitureState
let rules: vm.IQRuleset

beforeAll(async () => {
    const assetManagementService = new AssetManagementServiceMock()
    const evenstatsService = new EvenstatsServiceMock()
    const identityService = new IdentityServiceMock()
    const collecitonService = new CollectionServiceMock()
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
    const idleQuestServiceDependencies = {
        randomSeed: "test",
        calendar,
        database,
        evenstatsService: evenstatsService.service,
        identityService: identityService.service,
        assetManagementService: assetManagementService.service,
        collectionService: collecitonService.service,
        metadataRegistry: testMetadataRegistry,
        questsRegistry: await loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "stubs", "test-quest-registry.yaml"), "yaml"),
        wellKnownPolicies: wellKnownPoliciesMainnet
    }
    service = await IdleQuestsServiceDsl.loadFromConfig(idleQuestServiceDependencies)
    rules = vm.DefaultRuleset.seed("test")
    const objectBuilder = new vm.IQMeatadataObjectBuilder(rules, testMetadataRegistry, wellKnownPoliciesMainnet)
    characterState = new CharacterState(objectBuilder)
    furnitureState = new FurnitureState(objectBuilder)
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
    await characterState.syncCharacters(userId, assetInventory1)
    const assets1 = await CharacterDB.findAll({ where: { userId }})
    await characterState.syncCharacters(userId, assetInventory2)
    const assets2 = await CharacterDB.findAll({ where: { userId }})

    expect(assets1.length).toBe(2)
    expect(assets1[0].assetRef).toBe("PixelTile1")
    expect(assets1[1].assetRef).toBe("PixelTile1")
    expect(assets2.length).toBe(1)
    expect(assets2[0].assetRef).toBe("PixelTile1")
    expect(assets1.some(adv => adv.entityId == assets2[0].entityId)).toBeTruthy()
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
    await furnitureState.syncFurniture(userId, assetInventory1)
    const assets1 = await FurnitureDB.findAll({ where: { userId }})
    await furnitureState.syncFurniture(userId, assetInventory2)
    const assets2 = await FurnitureDB.findAll({ where: { userId }})

    expect(assets1.length).toBe(2)
    expect(assets1[0].assetRef).toBe("PixelTile2")
    expect(assets1[1].assetRef).toBe("PixelTile2")
    expect(assets2.length).toBe(1)
    expect(assets2[0].assetRef).toBe("PixelTile2")
    expect(assets1.some(adv => adv.entityId == assets2[0].entityId)).toBeTruthy()
})

/*
test("Normal quest flow 1", async () => {
    const userId = v4()
    const adventurers = await getAllAdventurers(userId)
    const availableQuests = await getAvailableQuests("Auristar")
    const adventurersToGoOnQuest = adventurers.map(a => a.entityId)
    const acceptedQuest = await acceptQuest(userId, availableQuests[0].questId, adventurersToGoOnQuest)
    const takenQuests1 = await getTakenQuests(userId)
    const claimBeforeTimeResponse = await service.claimStakingQuestResult(userId, acceptedQuest.takenQuestId!)
    calendar.moveSeconds(60 * 60 * 24 * 7 * 4)
    const outcome = await claimQuestResult(userId, acceptedQuest.takenQuestId!)
    const takenQuests2 = await getTakenQuests(userId)

    expect(adventurers.length).toBe(6)
    expect(acceptedQuest.availableQuest.questId).toBe(availableQuests[0].questId)
    expect(takenQuests1.length).toBe(1)
    expect(takenQuests1[0].partyIds).toStrictEqual(adventurersToGoOnQuest)
    expect(takenQuests1[0].availableQuest.questId).toEqual(availableQuests[0].questId)
    expect(claimBeforeTimeResponse.status).toBe("quest-not-finished")
    expect(takenQuests2.length).toBe(0)
    expect(outcome.ctype).toBe("success-outcome")
})
*/

async function getAllAdventurers(userId: string): Promise<Character[]> {
    return await expectResponse(
        service.getInventory(userId),
        response =>
            response.status === "ok" ?
            success(Object.values(response.inventory.characters)) :
            sfailure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function getAvailableQuests(location: string): Promise<AvailableStakingQuest[]> {
    return await expectResponse(
        service.getAvailableStakingQuests(location, 20),
        response =>
            response.status === "ok" ?
            success(response.availableQuests) :
            sfailure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<TakenStakingQuest> {
    return await expectResponse(
        service.acceptStakingQuest(userId, questId, adventurerIds),
        response =>
            response.status === "ok" ?
            success(response.takenQuest) :
            sfailure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function getTakenQuests(userId: string): Promise<TakenStakingQuest[]> {
    return await expectResponse(
        service.getTakenStakingQuests(userId),
        response =>
            response.status === "ok" ?
            success(response.takenQuests) :
            sfailure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}

async function claimQuestResult(userId: string, takenQuestId: string): Promise<EncounterOutcome> {
    return await expectResponse(
        service.claimStakingQuestResult(userId, takenQuestId),
        response =>
            response.status === "ok" ?
            success(response.outcome) :
            sfailure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}