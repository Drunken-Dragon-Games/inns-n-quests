import { getRandomElement } from "../../../app/utils";
import { ADVENTURER_PIXELTILES } from "../../../app/settings";
import { pixelTileMetaData, gmasMetadata, getAdvofThioldenMetadata } from "../../../app/metadata/metadata";
import { IPixelTileMetaData, IGMAMetadata, IAdvOfThioldenMetadata } from "../../../app/metadata/metadata";
import { registry } from "../../../app/utils"

type NFTMetadata = IPixelTileMetaData | IGMAMetadata | IAdvOfThioldenMetadata

const getRandomNFT = async (): Promise<[string, string]> => {
    const nftType: string = getRandomElement(["GrandmasterAdventurer", "PixelTile", "AdventurerOfThiolden"]);
    let assetName: string, nftMetadata: NFTMetadata
    if (nftType == "PixelTile") {
        assetName = getRandomElement(ADVENTURER_PIXELTILES)
        nftMetadata = pixelTileMetaData[assetName]
    } else if (nftType == "GrandmasterAdventurer") {
        assetName = `GrandmasterAdventurer${Math.round(Math.random() * (1 - 10000) + 10000)}`
        nftMetadata = gmasMetadata[assetName]
    } else if (nftType == "AdventurerOfThiolden") {
        const advOfThioldenMetadata = await getAdvofThioldenMetadata()
        assetName = `AdventurerOfThiolden${Math.round(Math.random() * (1 - 25000) + 25000)}`
        nftMetadata = advOfThioldenMetadata[assetName]
    }

    return [assetName!, nftType!]
}

const getCollectionPolicy = async (collection: string): Promise<string> => {
    let policy: string | undefined
    if (collection == "PixelTile") {
        policy = registry.policies.pixeltiles
    } else if (collection == "GrandmasterAdventurer")
       policy = registry.policies.gmas
    else {
        policy = registry.policies.aots
    }
    if (policy == undefined) throw new Error("Policy is undefined")
    return policy
}

export {
    getRandomNFT,
    getCollectionPolicy,
    NFTMetadata
}