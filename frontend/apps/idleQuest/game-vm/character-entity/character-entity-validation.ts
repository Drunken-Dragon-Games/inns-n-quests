import { APS } from "./aps"
import { AdventurerClass, AdventurerClasses } from "./character-entity"

export function isAPS(obj: any): obj is APS {
    return typeof obj.athleticism === "number" && typeof obj.intellect === "number" && typeof obj.charisma === "number"
}

export function isAdventurerClass(obj: any): obj is AdventurerClass {
    return typeof obj === "string" && (AdventurerClasses as string[]).includes(obj)
}
