import { pixelTileMetaData, gmasMetadata } from "../../app/metadata/metadata.js"
import { SPRITE_SCALE, SPRITE_SITE } from "../../app/settings.js"
import { IAdventurerRes } from "../../adventurers/models/adventurer_model.js";

const tokenNameToIdx = (advOfThioldenOnChainRef: string): number => 
    parseInt(advOfThioldenOnChainRef.replace("AdventurerOfThiolden", "")) - 1

export const getAdventurerToReturn = (adventurer: IAdventurerRes, thioldenMetadata: any): IAdventurerRes => {
    let onChainRef = adventurer.on_chain_ref
    let name: string
    let sprite: string
    if (adventurer.type == "pixeltile") {
        name = pixelTileMetaData[onChainRef].name.split(" ").slice(2, pixelTileMetaData[onChainRef].name.split(" ").length).join(" ") 
        sprite = getPixeltileSprite(onChainRef)
        adventurer["sprites"] = SPRITE_SITE + sprite
    } else if(adventurer.type == "gma") {
        name = gmasMetadata[onChainRef].name
        sprite = getGmaSprite(onChainRef)
        adventurer["sprites"] = SPRITE_SITE + sprite
    } else {
        const idx = tokenNameToIdx(onChainRef)
        name = thioldenMetadata[idx].adv
        sprite = getAdvOfThioldenSprite(idx, thioldenMetadata)
        adventurer["sprites"] = sprite
    }
    adventurer["name"] = name.charAt(0).toUpperCase() + name.slice(1);

    return adventurer
}

const getPixeltileSprite = (adventurerName: string): string => {
    return `/pixeltiles/x${SPRITE_SCALE}/pixel_tile_${adventurerName.slice(9, adventurerName.length)}.png`
}

const getGmaSprite = (adventurerName: string): string => {
    return `/gmas/x${SPRITE_SCALE}/${adventurerName}.png`
}

const getAdvOfThioldenSprite = (idx: number, thioldenMetadata: any): string => {
    const adventurerName = thioldenMetadata[idx].adv
    const chromaOrPlain = thioldenMetadata[idx].chr ? "chroma" : "plain"
    return `https://cdn.ddu.gg/adv-of-thiolden/x6/${adventurerName}-front-${chromaOrPlain}.png`
}