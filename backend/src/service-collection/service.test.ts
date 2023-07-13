import { CollectionService } from "./service-spec"
import { connectToDB, DBConfig } from "../tools-database"
import { CollectionServiceDsl } from "./service"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import { testPolicies } from "../tools-utils/mocks/test-policies"
import { Collection } from "./models"

let service: CollectionService

const databaseConfig: DBConfig = 
    { host: "localhost"
    , port: 5432
    , username: "postgres"
    , password: "admin"
    , database: "service_db" 
    }

beforeEach(async () => {
    const identityService = new IdentityServiceMock()
    const assetManagementService = new AssetManagementServiceMock()

    assetManagementService.listReturns({ status: "ok", inventory: {
        [testPolicies.pixelTiles.policyId]: [
            { unit: "PixelTile1", quantity: "2", chain: true },
            { unit: "PixelTile2", quantity: "3", chain: true},
        ],
        [testPolicies.grandMasterAdventurers.policyId]: [
            { unit: "GrandmasterAdventurer1", quantity: "1", chain: true },
            { unit: "GrandmasterAdventurer2", quantity: "1", chain: true },
        ],
        [testPolicies.adventurersOfThiolden.policyId]: [
            { unit: "AdventurerOfThiolden1", quantity: "1", chain: true },
            { unit: "AdventurerOfThiolden2", quantity: "1", chain: true },
        ]
    }})

    service = await CollectionServiceDsl.loadFromConfig({}, {
        database: connectToDB(databaseConfig),
        assetManagementService: assetManagementService.service,
        identityService: identityService.service,
        metadataRegistry: testMetadataRegistry,
        wellKnownPolicies: testPolicies
    })
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

afterAll(async () => {
    // Close the database connection after all tests have run
    await service.closeDatabaseConnection()
})

test("get Collection ok", async () => {
    const collectionResult = await  service.getCollection("userId")
    if (collectionResult.ctype !== "success"){
        expect(collectionResult.ctype).toEqual("success")
        return
    }
    console.log(collectionResult.collection)
    const expectedColelction: Collection<{}> = {
        pixelTiles: [
            {assetRef:"PixelTile1", quantity: "2", type: "Character" },
            {assetRef:"PixelTile2", quantity: "3", type: "Furniture"}
    ],
        grandMasterAdventurers: [
            {assetRef: "GrandmasterAdventurer1", quantity: "1", type: "Character"},
            {assetRef: "GrandmasterAdventurer2", quantity: "1", type: "Character" },
        ],
        adventurersOfThiolden: [
            { assetRef: "AdventurerOfThiolden1", quantity: "1", type: "Character" },
            { assetRef: "AdventurerOfThiolden2", quantity: "1", type: "Character" },
        ]
    }

    expect(collectionResult.collection).toEqual(expectedColelction)
})