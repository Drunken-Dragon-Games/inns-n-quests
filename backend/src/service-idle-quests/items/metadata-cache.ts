import axios from "axios"

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
    { [assetName: string]: { name: string, image: string, alt: string, rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary", type: string } }

export type PixelTilesGameMetadata = 
    { [assetName: string]: { class: string, race: string } }

class MetadataCacheLoader {

    advOfThioldenAppMetadata: AdvOfThioldenAppMetadata = []
    advOfThioldenGameMetadata: AdvOfThioldenGameMetadata = {}
    gmasMetadata: GmasMetadata = {}
    pixelTilesMetadata: PixelTilesMetadata = {}
    pixelTilesGameMetadata: PixelTilesGameMetadata = {}

    async load(): Promise<void> {
        this.advOfThioldenAppMetadata = (await axios.get("https://cdn.ddu.gg/adv-of-thiolden/metadata-app.json")).data
        this.advOfThioldenGameMetadata = (await axios.get("https://cdn.ddu.gg/adv-of-thiolden/metadata-game.json")).data
        this.gmasMetadata = (await axios.get("https://cdn.ddu.gg/gmas/metadata.json")).data
        this.pixelTilesMetadata = (await axios.get("https://cdn.ddu.gg/pixeltiles/metadata.json")).data
        this.pixelTilesGameMetadata = (await axios.get("https://cdn.ddu.gg/pixeltiles/metadata-game.json")).data
    }
}

export default new MetadataCacheLoader()
