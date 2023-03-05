import { AdventurerClass, APS, isAdventurerClass } from "../character-entity"
import { isQuestRequirement } from "./encounter-validation"

export type QuestRequirement 
    = APSRequirement | ClassRequirement | OrRequirement | AndRequirement 
    | BonusRequirement | SuccessBonusRequirement | EmptyRequirement

/**
 * Percentages at which a party satisfies a requirement.
 */
export type SatisfiedRequirements = {
    aps: APS
    class: number
}

/**
 * Picked requirements for a party.
 */
export type TargetRequirements = {
    aps: APS
    class: string[]
}

export type OrRequirement = {
    ctype: "or-requirement",
    left: QuestRequirement,
    right: QuestRequirement,
}

export type AndRequirement = {
    ctype: "and-requirement",
    left: QuestRequirement,
    right: QuestRequirement,
}

export type BonusRequirement = {
    ctype: "bonus-requirement",
    bonus: number,
    left: QuestRequirement,
    right: QuestRequirement,
}

export type SuccessBonusRequirement = {
    ctype: "success-bonus-requirement",
    bonus: number,
    left: QuestRequirement,
    right: QuestRequirement,
}

export type APSRequirement = {
    ctype: "aps-requirement",
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type ClassRequirement = {
    ctype: "class-requirement",
    class: string,
}

/** Removed for now */
export type NotRequirement = {
    ctype: "not-requirement",
    continuation: QuestRequirement,
}

export type EmptyRequirement = {
    ctype: "empty-requirement",
}


export const apsRequirement = (athleticism: number, intellect: number, charisma: number): APSRequirement => ({
    ctype: "aps-requirement",
    athleticism: athleticism,
    intellect: intellect,
    charisma: charisma,
})

export const bonus = (bonus: number, left: QuestRequirement, right: QuestRequirement): BonusRequirement => ({
    ctype: "bonus-requirement",
    bonus, left, right,
})

export const all = (requirements: QuestRequirement[]): QuestRequirement => 
    requirements.reduce((left, right) => and(left, right), empty)

export const oneOf = (requirements: QuestRequirement[]): QuestRequirement =>
    requirements.reduce((left, right) => or(left, right), empty)

/*
export const none = (requirements: QuestRequirement[]): QuestRequirement =>
    not(all(requirements))
*/

export const successBonus = (bonus: number, left: QuestRequirement, right: QuestRequirement): SuccessBonusRequirement => ({
    ctype: "success-bonus-requirement",
    bonus, left, right,
})

export const and = (left: QuestRequirement, right: QuestRequirement): AndRequirement => ({
    ctype: "and-requirement",
    left, right,
})

export const or = (left: QuestRequirement, right: QuestRequirement): OrRequirement => ({
    ctype: "or-requirement",
    left, right,
})

export const not = (continuation: QuestRequirement): NotRequirement => ({
    ctype: "not-requirement",
    continuation,
})

export const empty: EmptyRequirement = 
    { ctype: "empty-requirement" }

export const classReq = (classType: AdventurerClass): ClassRequirement => ({
    ctype: "class-requirement",
    class: classType,
})

export const fighter: ClassRequirement = {
    ctype: "class-requirement",
    class: "fighter",
}

export const paladin: ClassRequirement = {
    ctype: "class-requirement",
    class: "paladin",
}

export const knight: ClassRequirement = {
    ctype: "class-requirement",
    class: "knight",
}

export const cleric: ClassRequirement = {
    ctype: "class-requirement",
    class: "cleric",
}

export const druid: ClassRequirement = {
    ctype: "class-requirement",
    class: "druid",
}

export const warlock: ClassRequirement = {
    ctype: "class-requirement",
    class: "warlock",
}

export const mage: ClassRequirement = {
    ctype: "class-requirement",
    class: "mage",
}

export const bard: ClassRequirement = {
    ctype: "class-requirement",
    class: "bard",
}

export const rogue: ClassRequirement = {
    ctype: "class-requirement",
    class: "rogue",
}

export const ranger: ClassRequirement = {
    ctype: "class-requirement",
    class: "ranger",
}

export function parseEasyJsonSyntax(json: any): QuestRequirement {
    if (isQuestRequirement(json)) return json
    else if (typeof json == "string" && json == "empty") return empty
    else if (typeof json == "string" && json == "fighter") return fighter
    else if (typeof json == "string" && json == "paladin") return paladin
    else if (typeof json == "string" && json == "knight") return knight
    else if (typeof json == "string" && json == "cleric") return cleric
    else if (typeof json == "string" && json == "druid") return druid
    else if (typeof json == "string" && json == "warlock") return warlock
    else if (typeof json == "string" && json == "mage") return mage
    else if (typeof json == "string" && json == "bard") return bard
    else if (typeof json == "string" && json == "rogue") return rogue
    else if (typeof json == "string" && json == "ranger") return ranger

    else if (Array.isArray(json)) 
        return all(json.map(parseEasyJsonSyntax))

    else if (typeof json == "object") {
        const keys = Object.keys(json)
        if (keys.length == 0) return empty
        else if (keys.length == 1) {
            const key = keys[0]
            const value = json[key]

            if (key == "aps" && Array.isArray(value) && value.length == 3 && typeof value[0] == "number" && typeof value[1] == "number" && typeof value[2] == "number")
                return apsRequirement(value[0], value[1], value[2])
            else if (key == "aps" && typeof value == "object" && typeof value["athleticism"] == "number" && typeof value["intellect"] == "number"  && typeof value["charisma"] == "number") 
                return apsRequirement(value.athleticism, value.intellect, value.charisma)
            else if (key == "aps" && typeof value == "object" && typeof value["ath"] == "number" && typeof value["int"] == "number"  && typeof value["cha"] == "number") 
                return apsRequirement(value.ath, value.int, value.cha)
            else if (key == "aps")
                throw new Error("Invalid APS requirement: " + JSON.stringify(json))
            
            else if (key == "bonus" && typeof value["amount"] == "number" && (value.amount > 1 || value.amount <= 0))
                throw new Error("A bonus cannot be greater than 1 or less than or equal to 0: " + JSON.stringify(json))
            else if (key == "bonus" && typeof value["amount"] == "number" && value.condition !== "undefined" && value.requirement !== "undefined")
                return bonus(value.amount, parseEasyJsonSyntax(value.condition), parseEasyJsonSyntax(value.requirement))
            else if (key == "bonus" && Array.isArray(value) && value.length == 3 && typeof value[0] == "number" && typeof value[1] !== "undefined" && typeof value[2] !== "undefined")
                return bonus(value[0], parseEasyJsonSyntax(value[1]), parseEasyJsonSyntax(value[2]))
            else if (key == "bonus")
                throw new Error("Invalid bonus requirement: " + JSON.stringify(json))

            else if (key == "successBonus" && typeof value["amount"] == "number" && (value.amount > 1 || value.amount <= 0))
                throw new Error("A success bonus cannot be greater than 1 or less than or equal to 0: " + JSON.stringify(json))
            else if (key == "successBonus" && typeof value["amount"] == "number" && value.condition !== "undefined" && value.requirement !== "undefined")
                return successBonus(value.amount, parseEasyJsonSyntax(value.condition), parseEasyJsonSyntax(value.requirement))
            else if (key == "successBonus" && Array.isArray(value) && value.length == 3 && typeof value[0] == "number" && typeof value[1] !== "undefined" && typeof value[2] !== "undefined")
                return successBonus(value[0], parseEasyJsonSyntax(value[1]), parseEasyJsonSyntax(value[2]))
            else if (key == "successBonus")
                throw new Error("Invalid success bonus requirement: " + JSON.stringify(json))

            else if (key == "and" && Array.isArray(value) && value.length == 2) 
                return and(parseEasyJsonSyntax(value[0]), parseEasyJsonSyntax(value[1]))
            else if (key == "and")
                throw new Error("Invalid and requirement: " + JSON.stringify(json))

            else if (key == "all" && Array.isArray(value))
                return all(value.map(parseEasyJsonSyntax))
            else if (key == "all")
                throw new Error("Invalid all requirement: " + JSON.stringify(json))

            else if (key == "or" && Array.isArray(value) && value.length == 2)
                return or(parseEasyJsonSyntax(value[0]), parseEasyJsonSyntax(value[1]))
            else if (key == "or") 
                throw new Error("Invalid or requirement: " + JSON.stringify(json))

            else if (key == "oneOf" && Array.isArray(value))
                return oneOf(value.map(parseEasyJsonSyntax))
            else if (key == "oneOf")
                throw new Error("Invalid oneOf requirement: " + JSON.stringify(json))

            /*
            else if (key == "not")
                return not(parseEasyJsonSyntax(value))
            */
            else if (key == "classes" && Array.isArray(value) && value.every(isAdventurerClass))
                return all(value.map(classReq))
            else 
                throw new Error(`Unknown key word ${key}`)
        } else
            return all(keys.map(key => parseEasyJsonSyntax({ [key]: json[key] })))
    } else 
        throw new Error("Invalid requirement: " + json)
}
