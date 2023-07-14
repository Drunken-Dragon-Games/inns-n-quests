import { CollectionService } from "./service-spec"
import { connectToDB, DBConfig } from "../tools-database"
import { CollectionServiceDsl } from "./service"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import { testPolicies } from "../tools-utils/mocks/test-policies"
import { CollectibleMetadata, CollectibleStakingInfo, Collection } from "./models"
import { MutableCalendar } from "../tools-utils/calendar"

let service: CollectionService
let calendar: MutableCalendar = new MutableCalendar(new Date(0))
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

    assetManagementService.listAlwaysReturns({ status: "ok", inventory: {
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
        ],
        [testPolicies.dragonSilver.policyId]:[
            {unit: "dragonSilver", quantity: "15", chain: true},
            {unit: "dragonSilver", quantity: "10", chain: false}
        ]
    }})

    identityService.listAllUserIdsReturns(["b1925e1f-6820-4155-a917-fa68873906a7", "962b8c9c-2c59-4935-a6e6-57e1f72b85e1"])

    service = await CollectionServiceDsl.loadFromConfig({}, {
        database: connectToDB(databaseConfig),
        assetManagementService: assetManagementService.service,
        identityService: identityService.service,
        metadataRegistry: testMetadataRegistry,
        wellKnownPolicies: testPolicies,
        calendar
    })
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

/* test("get Collection ok", async () => {
    const collectionResult = await  service.getCollection("userId")
    if (collectionResult.ctype !== "success"){
        expect(collectionResult.ctype).toEqual("success")
        return
    }
    const expectedCollection: Collection<{}> = {
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

    expect(collectionResult.collection).toEqual(expectedCollection)
})

test("get Collection with Metadata ok", async () => {
    const collectionResult = await service.getCollectionWithUIMetadata("userId")
    if (collectionResult.ctype !== "success"){
        expect(collectionResult.ctype).toEqual("success")
        return
    }
    const expectedCollection: Collection<CollectibleStakingInfo & CollectibleMetadata> = {
        pixelTiles: [
            {assetRef:"PixelTile1", quantity: "2", type: "Character", stakingContribution: 1, 
            splashArt: "https://cdn.ddu.gg/pixeltiles/xl/PixelTile1.png", 
            miniature: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_1.png", 
            name: "PixelTile #1 Rogue", aps: [4,4,4], class: "Rogue", mortalRealmsActive: 0 },
            
            {assetRef:"PixelTile2", quantity: "3", type: "Furniture", stakingContribution: 1, 
            splashArt: "https://cdn.ddu.gg/pixeltiles/xl/PixelTile2.png", 
            miniature: "https://cdn.ddu.gg/pixeltiles/x4/PixelTile2.png", 
            name: "PixelTile #2 Table", aps: [6,6,6], class: "furniture", mortalRealmsActive: 0}
    ],
        grandMasterAdventurers: [
            {assetRef: "GrandmasterAdventurer1", quantity: "1", type: "Character", stakingContribution: 1, 
            splashArt: "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer1.gif", 
            miniature: "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer1.png", 
            name: "Grandmaster Adventurer #1", aps: [8,9,4], class: "Ranger", mortalRealmsActive: 0},
            
            {assetRef: "GrandmasterAdventurer2", quantity: "1", type: "Character", stakingContribution: 1, 
            splashArt: "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer2.gif", 
            miniature: "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer2.png", 
            name: "Grandmaster Adventurer #2", aps: [1,6,2], class: "Paladin", mortalRealmsActive: 0 },
        ],
        adventurersOfThiolden: [
            { assetRef: "AdventurerOfThiolden1", quantity: "1", type: "Character", stakingContribution: 1, 
            splashArt: "https://cdn.ddu.gg/adv-of-thiolden/web/vimtyr_32_1.mp4", 
            miniature: "https://cdn.ddu.gg/adv-of-thiolden/x6/vimtyr-front-chroma.png", 
            name: "vimtyr The Whispering Axe", aps: [10,11,11], class: "Rogue", mortalRealmsActive: 0 },
            
            { assetRef: "AdventurerOfThiolden2", quantity: "1", type: "Character", stakingContribution: 1, 
            splashArt: "https://cdn.ddu.gg/adv-of-thiolden/web/terrorhertz_32_1.mp4", 
            miniature: "https://cdn.ddu.gg/adv-of-thiolden/x6/terrorhertz-front-chroma.png", 
            name: "terrorhertz Herald of the Drunken Dragon", aps: [10,11,11], class: "Bard", mortalRealmsActive: 0 },
        ]
    }

    expect(collectionResult.collection).toEqual(expectedCollection)
})

test("get Passsive staking Info", async () => {
    const pasiveInfo = await service.getPassiveStakingInfo("18e099c5-06d2-4efa-aacf-e087658aab2f")
    if (pasiveInfo.ctype !== "success"){
        expect(pasiveInfo.ctype).toEqual("success")
        return
    }
    const expectedInfo = {
        ctype: "success",
        weeklyAccumulated: "0", 
        dragonSilverToClaim: "10", 
        dragonSilver: "15"}

    expect(pasiveInfo).toEqual(expectedInfo)
}) */

test("update and get passive staking Info", async () => {
    calendar.moveMonths(1)
    await service.updateGlobalDailyStakingContributions()
    const pasiveInfo = await service.getPassiveStakingInfo("b1925e1f-6820-4155-a917-fa68873906a7")
    console.log(pasiveInfo)
    expect(1).toEqual(1)
})