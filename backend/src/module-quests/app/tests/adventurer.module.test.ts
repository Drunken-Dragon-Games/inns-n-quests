import SyncAssets from "../../adventurers/sync_assets.js";
import { getAdventurerPolicies } from "../../adventurers/utils.js";
import { getAdvofThioldenMetadata } from "../metadata/metadata.js"
import { logger } from "../../base-logger.js"
import { ListResponse } from "../../../service-asset-management/index.js";

test("placeholder", async () => {
    expect(true).toBeTruthy()
})

/*
beforeEach(() => {
    assetManagementServiceClient.list = jest.fn(async (): Promise<ListResponse> => {
        return {
            status: "ok",
            inventory: {
                "pixeltilePolicy": [
                    { unit: "PixelTile1", quantity: "1", chain: true },
                    { unit: "PixelTile4", quantity: "1", chain: true },
                ],
                "gmaPolicy": [
                    { unit: "GrandMasterAdventurer1", quantity: "1", chain: true },
                ],
                "aotPolicy": [
                    { unit: "AdventurerOfThiolden1", quantity: "1", chain: true },
                ]
            }
        }
    })

    console.log = jest.fn()
})

describe("Asset Management Tests", () => {
    test("Request Assets", async () => {
        const thioldenMetadata = await getAdvofThioldenMetadata()
        const userId = "abear"
        const stakeAddress = "stake_test1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4k"
        const policies = {
            "pixeltiles": "pixeltilePolicy", 
            "gmas": "gmaPolicy", 
            "aots": "aotPolicy"
        }

        const assets = new SyncAssets(userId, thioldenMetadata, policies, logger);
        const nfts = await assets.requestCurrentNFT(logger)
        expect(nfts?.pixeltiles).toHaveLength(2)
        expect(nfts?.gmas).toHaveLength(1)
        expect(nfts?.adv_of_thiolden).toHaveLength(1)
        expect(nfts?.pixeltiles[0].name).toEqual("PixelTile1")
        expect(nfts?.pixeltiles[1].name).toEqual("PixelTile4")
        expect(nfts?.gmas[0].name).toEqual("GrandMasterAdventurer1")
        expect(nfts?.adv_of_thiolden[0].name).toEqual("AdventurerOfThiolden1")
    })

    test("Filter PixelTiles", async () => {
        const thioldenMetadata = await getAdvofThioldenMetadata()
        const userId = "abear"
        const stakeAddress = "stake_test1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4k"
        const policies = {
            "pixeltiles": "pixeltilePolicy", 
            "gmas": "gmaPolicy", 
            "aots": "aotPolicy"
        }

        const assets = new SyncAssets(userId, thioldenMetadata, policies, logger)
        await assets.init(logger)
        const filteredNFTs = assets.filterAdventurerPixelTiles()
        expect(filteredNFTs).toHaveLength(3)      
        const shouldContain = filteredNFTs?.filter(nft => nft.name == "PixelTile1")           
        const shouldNotContain = filteredNFTs?.filter(nft => nft.name == "PixelTile4")        
        expect(shouldContain![0].name).toContain("PixelTile1")
        expect(shouldContain).toHaveLength(1)
        expect(shouldNotContain).toHaveLength(0)
    })

    test("Get Adventurers to Create", async () => {
        const thioldenMetadata = await getAdvofThioldenMetadata()
        const userId = "abear"
        const stakeAddress = "stake_test1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4k"
        const policies = {
            "pixeltiles": "pixeltilePolicy", 
            "gmas": "gmaPolicy",
            "aots": "aotPolicy"
        }

        const assets = new SyncAssets(userId, thioldenMetadata, policies, logger)
        await assets.init(logger)
        const nfts = assets.getAdventurersToCreate()
        const adventurers = nfts?.map(nft => nft.name)
        expect(adventurers).toHaveLength(3)      
        expect(adventurers).toContain("GrandMasterAdventurer1")
        expect(adventurers).toContain("AdventurerOfThiolden1")
    })
})
*/