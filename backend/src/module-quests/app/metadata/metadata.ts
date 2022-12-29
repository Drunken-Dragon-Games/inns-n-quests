import fs from "fs"
import path from "path"
import axios from "axios"

export interface IPixelTileMetaData {
  name: string,
  image: string,
  alt: string,
  rarity: string,
  type: string
}

interface IPixelTile {
    [key: string]: IPixelTileMetaData
}
       
export interface IGMAMetadata {
    name: string,
    image: string,
    race: string,
    subrace: string,
    genre: string,
    class: string,
    armor: string,
    weapon: string
}

interface IGma {
    [key: string]: IGMAMetadata
}

interface IPixelTileClass {
    [key: string]: {
      class: string,
      race: string
    }
}

interface IAptitudPoints {
  Athleticism: string
  Intellect: string
  Charisma: string
}

interface IAdvFiles {
  "mediaType": string
  "src": string
}

export interface IAdvOfThioldenMetadata {
  "Adventurer": string
  "Faction": string
  "Class: Game": string
  "Class: Lore": string
  "Artists: Concept": string[]
  "Artists: Splash Art Composition": string[]
  "Artists: Pixel": string[]
  "Artists: Miniature Pixel": string[]
  "Aptitude Points": IAptitudPoints
  "APS": string
  "Chroma": string
  "name": string
  "image": string
  "mediaType": string
  "files": IAdvFiles[]
  "Rarity": string
}

export interface IAdvOfThioldenGameMetadata {
  [key: string]: {
    [key: string]: string
  }
}

interface IAdvOfThiolden {
  [key: string]: IAdvOfThioldenMetadata
}

const rawPixelTileMetadata: Buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'nfts_metadata', 'pixeltiles', 'metadata.json'))
export const pixelTileMetaData: IPixelTile = JSON.parse(rawPixelTileMetadata.toString())

const rawPixelTileGameMetadata: Buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'nfts_metadata', 'pixeltiles', 'game-metadata.json'))
export const pixelTileClass: IPixelTileClass = JSON.parse(rawPixelTileGameMetadata.toString())

const rawGmasMetadata: Buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'nfts_metadata', 'gmas', 'metadata.json'))
export const gmasMetadata: IGma = JSON.parse(rawGmasMetadata.toString())

// const rawAdvOfThioldenMetadata: Buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'nfts_metadata', 'thiolden', 'metadata.json'))
// export const advOfThioldenMetadata: IAdvOfThiolden = JSON.parse(rawAdvOfThioldenMetadata.toString())

const rawAdvOfThioldenGameMetadata: Buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'nfts_metadata', 'thiolden', 'game-metadata.json'))
export const advOfThioldenGameMetadata: IAdvOfThioldenGameMetadata = JSON.parse(rawAdvOfThioldenGameMetadata.toString())

export const getAdvofThioldenMetadata = () => 
  axios.get("https://cdn.ddu.gg/adv-of-thiolden/metadata-app.json").then(r => r.data)
