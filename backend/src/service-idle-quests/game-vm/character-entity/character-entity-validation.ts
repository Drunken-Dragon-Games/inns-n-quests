import { APS } from "./aps.js"
import { AdventurerClass, AdventurerClasses, CharacterClass, CharacterCollection, CharacterCollections, CrafterClass, CrafterClasses } from "./character-entity.js"

export function isAPS(obj: any): obj is APS {
    return typeof obj.athleticism === "number" && typeof obj.intellect === "number" && typeof obj.charisma === "number"
}

export function isCharacterCollection(obj: any): obj is CharacterCollection {
    return typeof obj === "string" && (CharacterCollections as string[]).includes(obj)
}

export function isCharacterClass(obj: any): obj is CharacterClass {
    return typeof obj === "string" && (AdventurerClasses as string[]).concat(CrafterClasses as string[]).includes(obj)
}

export function isAdventurerClass(obj: any): obj is AdventurerClass {
    return typeof obj === "string" && (AdventurerClasses as string[]).includes(obj)
}

export function isCrafterClass(obj: any): obj is CrafterClass {
    return typeof obj === "string" && (CrafterClasses as string[]).includes(obj)
}

export function isAssetRef(obj: any): obj is string {
    return typeof obj === "string" && (/^[PixelTile|GrandmasterAdventurer|AdventurerOfThiolden]+\d+$/).test(obj)
}
