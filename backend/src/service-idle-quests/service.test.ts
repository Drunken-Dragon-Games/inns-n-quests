import path from "path"
import { Sequelize } from "sequelize"
import { wellKnownPoliciesMainnet } from "../registry-policies"
import { loadQuestRegistryFromFs } from "../registry-quests"
import { connectToDB } from "../tools-database"
import { failure, success } from "../tools-utils"
import { expectResponse } from "../tools-utils/api-expectations"
import { Calendar, MutableCalendar } from "../tools-utils/calendar"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import Random from "../tools-utils/random"
import { Adventurer, AvailableQuest, ClaimQuestOutcome, TakenQuest } from "./models"
import { IdleQuestsServiceDsl } from "./service"
import { IdleQuestsService } from "./service-spec"

let service: IdleQuestsService
let database: Sequelize
let calendar: MutableCalendar = new MutableCalendar(new Date(0))

beforeAll(async () => {
    const assetManagementService = new AssetManagementServiceMock()
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
        assetManagementService: assetManagementService.service,
        metadataRegistry: testMetadataRegistry,
        questsRegistry: await loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "stubs", "test-quest-registry.yaml"), "yaml"),
        wellKnownPolicies: wellKnownPoliciesMainnet
    }
    service = await IdleQuestsServiceDsl.loadFromConfig(idleQuestsServiceConfig, idleQuestServiceDependencies)
})

afterAll(async () => {
    await database.close()
})

beforeEach(async () => {
    await service.loadDatabaseModels()
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

test("health endpoint", async () => {
    expect(await service.health()).toBeTruthy()
})

test("Normal user flow 1", async () => {
    const userId = "ae991e8c-361f-44e9-afbc-461fb94be2fa"
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
    expect(outcome.status).toBe("success")
})

async function getAllAdventurers(userId: string): Promise<Adventurer[]> {
    return await expectResponse(
        service.getAllAdventurers(userId),
        response =>
            response.status === "ok" ?
            success(response.adventurers) :
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

async function claimQuestResult(userId: string, takenQuestId: string): Promise<ClaimQuestOutcome> {
    return await expectResponse(
        service.claimQuestResult(userId, takenQuestId),
        response =>
            response.status === "ok" ?
            success(response.outcome) :
            failure(`Expected 'ok' but got ${JSON.stringify(response)}`)

    )
}