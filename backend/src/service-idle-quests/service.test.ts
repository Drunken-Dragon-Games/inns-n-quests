import dotenv from "dotenv"
import path from "path"
import { Sequelize } from "sequelize"
import { loadWellKnownPoliciesFromEnv } from "../registry-policies"
import { loadQuestRegistryFromFs } from "../registry-quests"
import { connectToDB, DBConfig } from "../tools-database"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import Random from "../tools-utils/random"
import { IdleQuestsServiceDsl } from "./service"
import { IdleQuestsService } from "./service-spec"

let service: IdleQuestsService
let database: Sequelize

beforeAll(async () => {
    dotenv.config()
    const assetManagementService = new AssetManagementServiceMock()
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
        database,
        assetManagementService: assetManagementService.service,
        metadataRegistry: testMetadataRegistry,
        questsRegistry: await loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "stubs", "test-quest-registry.yaml"), "yaml"),
        wellKnownPolicies: loadWellKnownPoliciesFromEnv()
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