import { DBConfig, connectToDB } from "../tools-database"
import { MutableCalendar } from "../tools-utils/calendar"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock"
import { testMetadataRegistry } from "../tools-utils/mocks/test-metadata-registry"
import { testPolicies } from "../tools-utils/mocks/test-policies"
import { CollectibleMetadata, CollectibleStakingInfo, Collection, CollectionFilter } from "./models"
import { CollectionServiceDsl } from "./service"
import { CollectionService, CollectionWithUIMetadataResult, GetPassiveStakingInfoResult } from "./service-spec"
import ServiceTestDsl from "./service.test-dsl"

let service: CollectionService
let dsl: ServiceTestDsl
const calendar: MutableCalendar = new MutableCalendar(new Date(2023, 6, 10))
const databaseConfig: DBConfig = 
    { host: "localhost"
    , port: 5432
    , username: "postgres"
    , password: "admin"
    , database: "service_db" 
    }
const userId = "b1925e1f-6820-4155-a917-fa68873906a7"
const expectedDailyReward = "8.1"
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

    identityService.listAllUserIdsReturns([userId, "962b8c9c-2c59-4935-a6e6-57e1f72b85e1"])

    service = await CollectionServiceDsl.loadFromConfig({}, {
        database: connectToDB(databaseConfig),
        assetManagementService: assetManagementService.service,
        identityService: identityService.service,
        metadataRegistry: testMetadataRegistry,
        wellKnownPolicies: testPolicies,
        calendar
    })

    dsl = new ServiceTestDsl(
        identityService,
        assetManagementService,
        service
    )
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

test("get Collection ok", async () => {
    const collection = await service.syncUserCollection(userId)
    const collectionResult = await  service.getCollection(userId, undefined, 6)
    if (collectionResult.ctype !== "success") fail("collection bad ctype")
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
    const collection = await service.syncUserCollection(userId)
    const collectionResult = await service.getCollectionWithUIMetadata({ctype: "IdAndFilter", userId: userId}, 6)
    if (collectionResult.ctype !== "success") fail("Collection bad ctype")
    const expectedCollection: Collection<CollectibleStakingInfo & CollectibleMetadata> = {
        pixelTiles: [
            {assetRef:"PixelTile1", quantity: "2", type: "Character", stakingContribution: 2, 
            splashArt: "https://cdn.ddu.gg/pixeltiles/xl/PixelTile1.png", 
            miniature: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_1.png", 
            name: "PixelTile #1 Rogue", aps: [4,4,4], class: "Rogue", mortalRealmsActive: 0 },
            
            {assetRef:"PixelTile2", quantity: "3", type: "Furniture", stakingContribution: 6, 
            splashArt: "https://cdn.ddu.gg/pixeltiles/xl/PixelTile2.png", 
            miniature: "https://cdn.ddu.gg/pixeltiles/x4/PixelTile2.png", 
            name: "PixelTile #2 Table", aps: [0,0,0], class: "furniture", mortalRealmsActive: 0}
    ],
        grandMasterAdventurers: [
            {assetRef: "GrandmasterAdventurer1", quantity: "1", type: "Character", stakingContribution: 5, 
            splashArt: "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer1.gif", 
            miniature: "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer1.png", 
            name: "Grandmaster Adventurer #1", aps: [8,9,4], class: "Ranger", mortalRealmsActive: 0},
            
            {assetRef: "GrandmasterAdventurer2", quantity: "1", type: "Character", stakingContribution: 3, 
            splashArt: "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer2.gif", 
            miniature: "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer2.png", 
            name: "Grandmaster Adventurer #2", aps: [1,6,2], class: "Paladin", mortalRealmsActive: 0 },
        ],
        adventurersOfThiolden: [
            { assetRef: "AdventurerOfThiolden1", quantity: "1", type: "Character", stakingContribution: 20, 
            splashArt: "https://cdn.ddu.gg/adv-of-thiolden/web/vimtyr_32_1.mp4", 
            miniature: "https://cdn.ddu.gg/adv-of-thiolden/x6/vimtyr-front-chroma.png", 
            name: "vimtyr The Whispering Axe", aps: [10,11,11], class: "Rogue", mortalRealmsActive: 0 },
            
            { assetRef: "AdventurerOfThiolden2", quantity: "1", type: "Character", stakingContribution: 20, 
            splashArt: "https://cdn.ddu.gg/adv-of-thiolden/web/terrorhertz_32_1.mp4", 
            miniature: "https://cdn.ddu.gg/adv-of-thiolden/x6/terrorhertz-front-chroma.png", 
            name: "terrorhertz Herald of the Drunken Dragon", aps: [10,11,11], class: "Bard", mortalRealmsActive: 0 },
        ]
    }

    expect(collectionResult.collection).toEqual(expectedCollection)
})

test("get Passsive staking Info", async () => {
    const pasiveInfo = await service.getPassiveStakingInfo("18e099c5-06d2-4efa-aacf-e087658aab2f")
    if (pasiveInfo.ctype !== "success") fail("pasive info bad ctype")
    const expectedInfo = {
        ctype: "success",
        weeklyAccumulated: "0.0", 
        dragonSilverToClaim: "10", 
        dragonSilver: "15"}

    expect(pasiveInfo).toEqual(expectedInfo)
})

/* test("update and get passive 5 year test", async () => {
    const startingpoint = 0
    const timeeeee = 365 * 5
    calendar.moveDays(startingpoint)
    for (let i = startingpoint; i < timeeeee; i++){
    await service.unloadDatabaseModels()
    await service.loadDatabaseModels()
    console.log(i)
    calendar.moveDays(1)
    await service.updateGlobalDailyStakingContributions()
    const pasiveInfo = await service.getPassiveStakingInfo(userId)
    //This (And all smilar test) expects 7 DS pasive per asset
    const expectedPasiveInfo:GetPassiveStakingInfoResult  = {
        ctype: 'success',
        weeklyAccumulated: '6',
        dragonSilverToClaim: '10',
        dragonSilver: '15'
      }
    expect(pasiveInfo).toEqual(expectedPasiveInfo)

    await service.updateGlobalDailyStakingContributions()
    const SameDayPasiveInfo = await service.getPassiveStakingInfo(userId)

    expect(SameDayPasiveInfo).toEqual(expectedPasiveInfo)
}
}, 1500000) */

test("update and get passive staking Info Same Day", async () => {
    await service.updateGlobalDailyStakingContributions()
    const pasiveInfo = await service.getPassiveStakingInfo(userId)
    //This (And all smilar test) expects 7 DS pasive per asset
    const expectedPasiveInfo:GetPassiveStakingInfoResult  = {
        ctype: 'success',
        weeklyAccumulated: expectedDailyReward,
        dragonSilverToClaim: '10',
        dragonSilver: '15'
      }
    expect(pasiveInfo).toEqual(expectedPasiveInfo)

    await service.updateGlobalDailyStakingContributions()
    const SameDayPasiveInfo = await service.getPassiveStakingInfo(userId)

    expect(SameDayPasiveInfo).toEqual(expectedPasiveInfo)
    
})

test("update and get passive staking Info Diff Day", async () => {
    await service.updateGlobalDailyStakingContributions()
    const pasiveInfo = await service.getPassiveStakingInfo(userId)
    const expectedPasiveInfo:GetPassiveStakingInfoResult  = {
        ctype: 'success',
        weeklyAccumulated: expectedDailyReward,
        dragonSilverToClaim: '10',
        dragonSilver: '15'
      }
    expect(pasiveInfo).toEqual(expectedPasiveInfo)

    calendar.moveDays(1)
    await service.updateGlobalDailyStakingContributions()
    const NextDayPasiveInfo = await service.getPassiveStakingInfo(userId)
    const secondExpectedPasiveInfo:GetPassiveStakingInfoResult  = {
        ctype: 'success',
        weeklyAccumulated: (Number(expectedDailyReward) * 2).toString(),
        dragonSilverToClaim: '10',
        dragonSilver: '15'
      }
    expect(NextDayPasiveInfo).toEqual(secondExpectedPasiveInfo)
})

test("grant 1 week", async () => {
    //radom monday
    calendar.setNow(new Date(2023, 6, 10))
    for (let i = 1; i <= 7; i++){
        const expectedPasiveInfo:GetPassiveStakingInfoResult  = {
            ctype: 'success',
            weeklyAccumulated: (Number(expectedDailyReward) * i).toFixed(1),
            dragonSilverToClaim: '10',
            dragonSilver: '15'
          }
        await service.updateGlobalDailyStakingContributions()
        const pasiveInfo = await service.getPassiveStakingInfo(userId)
        expect(pasiveInfo).toEqual(expectedPasiveInfo)
        calendar.moveDays(1)
    }

    //now its monday again
    await service.grantGlobalWeeklyStakingGrant()
    await service.updateGlobalDailyStakingContributions()
    const pasiveInfo = await service.getPassiveStakingInfo(userId)
    expect(pasiveInfo).toEqual({
        ctype: 'success',
        weeklyAccumulated: expectedDailyReward,
        dragonSilverToClaim: '10',
        dragonSilver: '15'
      })
})

test("syncUserCollection create", async () => {
    const collection = await service.syncUserCollection(userId)
    const collectionDB = await service.getCollection(userId, undefined, 6)

    if(collection.ctype !== "success" || collectionDB.ctype !== "success") fail("Collection bad ctype")

    expect(dsl.areCollectionsEqual(collection, collectionDB)).toBe(true)
})

test("syncUserCollection delete", async () => {
    await service.syncUserCollection(userId)
    dsl.assetListReturnsOnce({ status: "ok", inventory: {
        [testPolicies.pixelTiles.policyId]: [
            { unit: "PixelTile1", quantity: "2", chain: true },
            { unit: "PixelTile2", quantity: "3", chain: true},
        ],
        [testPolicies.grandMasterAdventurers.policyId]: [
            { unit: "GrandmasterAdventurer1", quantity: "1", chain: true },
        ],
        [testPolicies.dragonSilver.policyId]:[
            {unit: "dragonSilver", quantity: "15", chain: true},
            {unit: "dragonSilver", quantity: "10", chain: false}
        ]
    }})
    
    const collection = await service.syncUserCollection(userId)
    const collectionDB = await service.getCollection(userId, undefined, 6)
    
    if(collection.ctype !== "success" || collectionDB.ctype !== "success") fail("Collection bad ctype")
    
    expect(dsl.areCollectionsEqual(collection, collectionDB)).toBe(true)
})

test("syncUserCollection update", async () => {
    await service.syncUserCollection(userId)
    dsl.assetListReturnsOnce({ status: "ok", inventory: {
        [testPolicies.pixelTiles.policyId]: [
            { unit: "PixelTile1", quantity: "1", chain: true },
            { unit: "PixelTile2", quantity: "7", chain: true},
        ],
        [testPolicies.grandMasterAdventurers.policyId]: [
            { unit: "GrandmasterAdventurer1", quantity: "1", chain: true },
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
    
    const collection = await service.syncUserCollection(userId)
    const collectionDB = await service.getCollection(userId, undefined, 6)
    
    if(collection.ctype !== "success" || collectionDB.ctype !== "success") fail("Collection bad ctype")
    
    expect(dsl.areCollectionsEqual(collection, collectionDB)).toBe(true)
})

test("mortal collection add and remove",async () => {
    await service.syncUserCollection(userId)
    const emptyMortal = await service.getMortalCollection(userId)
    if(emptyMortal.ctype !== "success") fail("get mortal bad ctype")
    expect(emptyMortal).toEqual({"ctype":"success","collection":{"pixelTiles":[],"adventurersOfThiolden":[],"grandMasterAdventurers":[]}})
    await service.addMortalCollectible(userId, "GrandmasterAdventurer1")
    const oneMortal = await service.getMortalCollection(userId)
    if(oneMortal.ctype !== "success") fail("get mortal one bad ctype")
    emptyMortal.collection.grandMasterAdventurers.push({
        assetRef:"GrandmasterAdventurer1",
        quantity:"1",
        type:"Character",
        aps:[8,9,4],
        mortalRealmsActive:1,
        name:"Grandmaster Adventurer #1",
        splashArt:"https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer1.gif",
        miniature:"https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer1.png",
        class:"Ranger"
    })
    expect(dsl.areCollectionsEqual(oneMortal, emptyMortal)).toBe(true)
    const failedMortals = await service.addMortalCollectible(userId, "PixelTile5")
    expect(failedMortals).toEqual({"ctype":"failure","error":"Could not Add asset asset does not belong to user in sync DB"})
    await service.addMortalCollectible(userId, "PixelTile1")
    await service.addMortalCollectible(userId, "PixelTile1")
    const twoMortal = await service.getMortalCollection(userId)
    if(twoMortal.ctype !== "success") fail("get mortal one bad ctype")
    emptyMortal.collection.pixelTiles.push({
        assetRef: "PixelTile1",
        quantity: "2",
        type: "Character",
        aps: [4, 4, 4],
        mortalRealmsActive: 2,
        name: "PixelTile #1 Rogue",
        miniature: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_1.png",
        splashArt: "https://cdn.ddu.gg/pixeltiles/xl/PixelTile1.png",
        class: "Rogue"
    })
    expect(dsl.areCollectionsEqual(twoMortal, emptyMortal)).toBe(true)
    //User Only has 2 PixelTiles1
    const failedAdd = await service.addMortalCollectible(userId, "PixelTile1")
    expect(failedAdd).toEqual({"ctype":"failure","error":"Could not Add asset No more assets available to add"})
    await service.removeMortalCollectible(userId, "PixelTile1")
    const modifiedAsset = emptyMortal.collection.pixelTiles.find(tile => tile.assetRef === "PixelTile1")
    if(!modifiedAsset) fail("this should not be possible")
    modifiedAsset.quantity = "1"
    modifiedAsset.mortalRealmsActive = 1
    const twoMortalMod = await service.getMortalCollection(userId)
    if(twoMortalMod.ctype !== "success") fail("get mortal one bad ctype")
    expect(dsl.areCollectionsEqual(twoMortalMod, emptyMortal)).toBe(true)
})

test("filter by class",async () => {
    await service.syncUserCollection(userId)
    const filter: CollectionFilter = {policyFilter: ["grandmaster-adventurers"], page: 1, classFilter: ["Ranger"], APSFilter: {ath: {}, int: {}, cha: {}}}
    const collectionResult = await service.getCollectionWithUIMetadata({ctype: "IdAndFilter", userId, filter}, 4)
    if(collectionResult.ctype !== "success") fail("get getCollectionWithUIMetadata bad ctype")
    const expectedCollection: CollectionWithUIMetadataResult = {
        "ctype": "success",
        "collection": {
            "pixelTiles": [],
            "adventurersOfThiolden": [],
            "grandMasterAdventurers": [
                {
                    "assetRef": "GrandmasterAdventurer1",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        8,
                        9,
                        4
                    ],
                    "class": "Ranger",
                    "mortalRealmsActive": 0,
                    "name": "Grandmaster Adventurer #1",
                    "splashArt": "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer1.gif",
                    "miniature": "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer1.png",
                    "stakingContribution": 1
                }
            ]
        },
        "hasMore": false
    }
    expect(dsl.areCollectionsEqual(collectionResult, expectedCollection)).toBe(true)
})

test("filter by APS",async () => {
    await service.syncUserCollection(userId)
    const filter: CollectionFilter = {page: 1, policyFilter: [], classFilter: [], APSFilter: {ath: {}, int: {from: 7}, cha: {}}}
    const collectionResult = await service.getCollectionWithUIMetadata({ctype: "IdAndFilter", userId, filter}, 4)
    if(collectionResult.ctype !== "success") fail("get getCollectionWithUIMetadata bad ctype")
    const expectedCollection: CollectionWithUIMetadataResult = {
        "ctype": "success",
        "collection": {
            "pixelTiles": [],
            "adventurersOfThiolden": [
                {
                    "assetRef": "AdventurerOfThiolden1",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        10,
                        11,
                        11
                    ],
                    "class": "Rogue",
                    "mortalRealmsActive": 0,
                    "name": "vimtyr The Whispering Axe",
                    "splashArt": "https://cdn.ddu.gg/adv-of-thiolden/web/vimtyr_32_1.mp4",
                    "miniature": "https://cdn.ddu.gg/adv-of-thiolden/x6/vimtyr-front-chroma.png",
                    "stakingContribution": 1
                },
                {
                    "assetRef": "AdventurerOfThiolden2",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        10,
                        11,
                        11
                    ],
                    "class": "Bard",
                    "mortalRealmsActive": 0,
                    "name": "terrorhertz Herald of the Drunken Dragon",
                    "splashArt": "https://cdn.ddu.gg/adv-of-thiolden/web/terrorhertz_32_1.mp4",
                    "miniature": "https://cdn.ddu.gg/adv-of-thiolden/x6/terrorhertz-front-chroma.png",
                    "stakingContribution": 1
                }
            ],
            "grandMasterAdventurers": [
                {
                    "assetRef": "GrandmasterAdventurer1",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        8,
                        9,
                        4
                    ],
                    "class": "Ranger",
                    "mortalRealmsActive": 0,
                    "name": "Grandmaster Adventurer #1",
                    "splashArt": "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer1.gif",
                    "miniature": "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer1.png",
                    "stakingContribution": 1
                }
            ]
        },
        "hasMore": false
    }
    expect(dsl.areCollectionsEqual(collectionResult, expectedCollection)).toBe(true)
})

test("filter pagination",async () => {
    await service.syncUserCollection(userId)
    const filter: CollectionFilter = {page: 1, policyFilter: [], classFilter: [], APSFilter: {ath: {}, int: {from: 5}, cha: {}}}
    const collectionResult = await service.getCollectionWithUIMetadata({ctype: "IdAndFilter", userId, filter}, 2)
    if(collectionResult.ctype !== "success") fail("get getCollectionWithUIMetadata bad ctype")
    const expectedCollectionPage1: CollectionWithUIMetadataResult = {
        "ctype": "success",
        "collection": {
            "pixelTiles": [],
            "adventurersOfThiolden": [
                {
                    "assetRef": "AdventurerOfThiolden1",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        10,
                        11,
                        11
                    ],
                    "class": "Rogue",
                    "mortalRealmsActive": 0,
                    "name": "vimtyr The Whispering Axe",
                    "splashArt": "https://cdn.ddu.gg/adv-of-thiolden/web/vimtyr_32_1.mp4",
                    "miniature": "https://cdn.ddu.gg/adv-of-thiolden/x6/vimtyr-front-chroma.png",
                    "stakingContribution": 20
                },
                {
                    "assetRef": "AdventurerOfThiolden2",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        10,
                        11,
                        11
                    ],
                    "class": "Bard",
                    "mortalRealmsActive": 0,
                    "name": "terrorhertz Herald of the Drunken Dragon",
                    "splashArt": "https://cdn.ddu.gg/adv-of-thiolden/web/terrorhertz_32_1.mp4",
                    "miniature": "https://cdn.ddu.gg/adv-of-thiolden/x6/terrorhertz-front-chroma.png",
                    "stakingContribution": 20
                }
            ],
            "grandMasterAdventurers": []
        },
        "hasMore": true
    }
    expect(dsl.areCollectionsEqual(collectionResult, expectedCollectionPage1)).toBe(true)
    filter.page = 2
    const collectionResult2 = await service.getCollectionWithUIMetadata({ctype: "IdAndFilter", userId, filter}, 2)
    if(collectionResult2.ctype !== "success") fail("get getCollectionWithUIMetadata bad ctype")
    const expectedCollectionPage2: CollectionWithUIMetadataResult ={
        "ctype": "success",
        "collection": {
            "pixelTiles": [],
            "adventurersOfThiolden": [],
            "grandMasterAdventurers": [
                {
                    "assetRef": "GrandmasterAdventurer1",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        8,
                        9,
                        4
                    ],
                    "class": "Ranger",
                    "mortalRealmsActive": 0,
                    "name": "Grandmaster Adventurer #1",
                    "splashArt": "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer1.gif",
                    "miniature": "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer1.png",
                    "stakingContribution": 5
                },
                {
                    "assetRef": "GrandmasterAdventurer2",
                    "quantity": "1",
                    "type": "Character",
                    "aps": [
                        1,
                        6,
                        2
                    ],
                    "class": "Paladin",
                    "mortalRealmsActive": 0,
                    "name": "Grandmaster Adventurer #2",
                    "splashArt": "https://cdn.ddu.gg/gmas/xl/GrandmasterAdventurer2.gif",
                    "miniature": "https://cdn.ddu.gg/gmas/x3/GrandmasterAdventurer2.png",
                    "stakingContribution": 3
                }
            ]
        },
        "hasMore": false
    }
    expect(dsl.areCollectionsEqual(collectionResult2, expectedCollectionPage2)).toBe(true)
})
