import axios from "axios"
import { config } from "./tools-utils/index.js"

export type AdvOfThioldenAppMetadata = 
    { adv: string, n: string, ath: number, int: number, cha: number, chr: boolean }[]

export type AdvOfThioldenGameMetadata =
    {  [adventurer: string]: { 
        "Adventurer": string, "Title": string, "Race": string, "Age": string, "Faction": string, "Game Class": string,
        "Lore Class": string, "Concept Artists": string[], "Splash Art Composition Artists": string[], "Pixel Artists": string[],
        "Miniature Pixel Artists": string[]
    } }

export type GmasMetadata =
    { [assetName: string]: { name: string, image: string, race: string, subrace: string, genre: string, class: string, armor: string, weapon: string } }

export type PixelTilesMetadata = 
    { [assetName: string]: { name: string, image: string, alt: string, 
        rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Unique", 
        type: "Adventurer" | "Table" | "Hearth" | "Bar Barrels" | "Simple Prop" | "Townsfolk" | "Wall Banner" | "Artifact" | "Monster" | "Rug"
    } }

export type PixelTilesGameMetadata = 
    { [assetName: string]: { class: string, race: string } }

export type MetadataRegistry = {
    advOfThioldenAppMetadata: AdvOfThioldenAppMetadata,
    advOfThioldenGameMetadata: AdvOfThioldenGameMetadata,
    gmasMetadata: GmasMetadata,
    pixelTilesMetadata: PixelTilesMetadata,
    pixelTilesGameMetadata: PixelTilesGameMetadata,
}

export type MetadataLocations = {
    adventurersOfThioldenGameMetada: string,
    adventurersOfThioldenAppMetadata: string,
    grandmasterAdventurersMetadata: string,
    pixelTilesMetadata: string,
    pixelTilesGameMetadata: string,
}

export function loadMetadataLocationsFromEnv(): MetadataLocations {
    return {
        adventurersOfThioldenAppMetadata: config.stringOrElse("ADV_OF_THIOLDEN_APP_METADATA_LOCATION", "https://cdn.ddu.gg/adv-of-thiolden/metadata-app.json"),
        adventurersOfThioldenGameMetada: config.stringOrElse("ADV_OF_THIOLDEN_GAME_METADATA_LOCATION", "https://cdn.ddu.gg/adv-of-thiolden/metadata-game.json"),
        grandmasterAdventurersMetadata: config.stringOrElse("GMAS_METADATA_LOCATION", "https://cdn.ddu.gg/gmas/metadata.json"),
        pixelTilesMetadata: config.stringOrElse("PIXEL_TILES_METADATA_LOCATION", "https://cdn.ddu.gg/pixeltiles/metadata.json"),
        pixelTilesGameMetadata: config.stringOrElse("PIXEL_TILES_GAME_METADATA_LOCATION", "https://cdn.ddu.gg/pixeltiles/metadata-game.json"),
    }
}

export async function loadMetadataCache(locations: MetadataLocations): Promise<MetadataRegistry> {
    const advOfThioldenAppMetadata = (await axios.get(locations.adventurersOfThioldenAppMetadata)).data
    const advOfThioldenGameMetadata = (await axios.get(locations.adventurersOfThioldenGameMetada)).data
    const gmasMetadata = (await axios.get(locations.grandmasterAdventurersMetadata)).data
    const pixelTilesMetadata = (await axios.get(locations.pixelTilesMetadata)).data
    const pixelTilesGameMetadata = (await axios.get(locations.pixelTilesGameMetadata)).data

    return {
        advOfThioldenAppMetadata,
        advOfThioldenGameMetadata,
        gmasMetadata,
        pixelTilesMetadata,
        pixelTilesGameMetadata,
    }
}
