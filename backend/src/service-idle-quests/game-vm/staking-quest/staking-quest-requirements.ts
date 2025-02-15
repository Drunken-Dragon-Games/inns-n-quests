import { APS, addAPS, CharacterClass, CharacterCollection, isAssetRef, isCharacterClass, isCharacterCollection, zeroAPS } from "../character-entity"
import { addStakingReward, StakingReward, zeroStakingReward } from "./staking-quest"
import { isStakingQuestRequirementDSL } from "./staking-quest-validation"

export type StakingQuestRequirement = {
    aps: APS
    collection?: CharacterCollection[]
    class?: CharacterClass[]
    assetRef?: string[]
    rewardBonus?: StakingReward
    successBonus?: number
}

/**
 * Calculated duration and reward from a staking quest requirement.
 */
export type StakingQuestRequirementInfo = {
    duration: number
    reward: StakingReward
    rewardBonus?: StakingReward
    successBonus?: number
}

/**
 * Success rates of a party to succeed a staking quest.
 */
export type StakingQuestRequirementSatisfactionPercentage = {
    aps: APS
    collection?: number
    class?: number
    assetRef?: number
}

/**
 * Full information outcome of calculating the reward, duration, and success rate of a staking quest requirement 
 * given a party of characters.
 */
export type StakingQuestSatisfactionInfo = {
    requirement: StakingQuestRequirement
    satisfaction: StakingQuestRequirementSatisfactionPercentage
    requirementInfo: StakingQuestRequirementInfo
}

/**
 * The computed success rate and reward of a party to succeed a staking quest requirement with accounted bonuses.
 */
export type StakingQuestRequirementConfiguration = {
    satisfactionInfo: StakingQuestSatisfactionInfo 
    finalSuccessRate: number
    finalReward: StakingReward
}

export type StakingQuestConfiguration = {
    configurations: StakingQuestRequirementConfiguration[]
    bestIndex: number 
}

/**
 * Used to flatten "or" and "and" requirements. 
 * "and" requirements are flattened.
 * "or" requirements are represented as an array of possibilities.
 */
export type Possible<T> = 
    T | T[]

export type StakingQuestRequirementDSL 
    = APSRequirement | ClassRequirement | AssetRefRequirement 
    | CollectionRequirement | OrRequirement | AndRequirement 
    | RewardBonusRequirement | SuccessBonusRequirement | EmptyRequirement

export type OrRequirement = {
    ctype: "or-requirement",
    left: StakingQuestRequirementDSL,
    right: StakingQuestRequirementDSL,
}

export type AndRequirement = {
    ctype: "and-requirement",
    left: StakingQuestRequirementDSL,
    right: StakingQuestRequirementDSL,
}

export type RewardBonusRequirement = {
    ctype: "reward-bonus-requirement",
    bonus: StakingReward,
}

export type SuccessBonusRequirement = {
    ctype: "success-bonus-requirement",
    bonus: number,
}

export type APSRequirement = {
    ctype: "aps-requirement",
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type CollectionRequirement = {
    ctype: "collection-requirement",
    collection: CharacterCollection,
}

export type ClassRequirement = {
    ctype: "class-requirement",
    class: CharacterClass,
}

export type AssetRefRequirement = {
    ctype: "asset-ref-requirement",
    assetRef: string,
}

export type EmptyRequirement = {
    ctype: "empty-requirement",
}

/** Removed for now */
/*
export type NotRequirement = {
    ctype: "not-requirement",
    continuation: StakingQuestRequirementDSL,
}
*/

export const apsRequirement = (athleticism: number, intellect: number, charisma: number): APSRequirement => ({
    ctype: "aps-requirement",
    athleticism: athleticism,
    intellect: intellect,
    charisma: charisma,
})

export const rewardBonus = (bonus: number): RewardBonusRequirement => ({
    ctype: "reward-bonus-requirement",
    bonus: { currency: bonus }, 
})

export const all = (requirements: StakingQuestRequirementDSL[]): StakingQuestRequirementDSL => 
    requirements.reduce((left, right) => and(left, right), empty)

export const oneOf = (requirements: StakingQuestRequirementDSL[]): StakingQuestRequirementDSL =>
    requirements.reduce((left, right) => or(left, right), empty)

/*
export const none = (requirements: QuestRequirement[]): QuestRequirement =>
    not(all(requirements))
*/

export const successBonus = (bonus: number): SuccessBonusRequirement => ({
    ctype: "success-bonus-requirement",
    bonus, 
})

export const and = (left: StakingQuestRequirementDSL, right: StakingQuestRequirementDSL): AndRequirement => ({
    ctype: "and-requirement",
    left, right,
})

export const or = (left: StakingQuestRequirementDSL, right: StakingQuestRequirementDSL): OrRequirement => ({
    ctype: "or-requirement",
    left, right,
})

/*
export const not = (continuation: StakingQuestRequirementDSL): NotRequirement => ({
    ctype: "not-requirement",
    continuation,
})
*/

export const empty: EmptyRequirement = 
    { ctype: "empty-requirement" }

export const collectionReq = (collection: CharacterCollection): CollectionRequirement => ({
    ctype: "collection-requirement",
    collection,
})

export const classReq = (classType: CharacterClass): ClassRequirement => ({
    ctype: "class-requirement",
    class: classType,
})

export const assetRefReq = (assetRef: string): AssetRefRequirement => ({
    ctype: "asset-ref-requirement",
    assetRef,
})

export const fighter: ClassRequirement = {
    ctype: "class-requirement",
    class: "Fighter",
}

export const paladin: ClassRequirement = {
    ctype: "class-requirement",
    class: "Paladin",
}

export const knight: ClassRequirement = {
    ctype: "class-requirement",
    class: "Knight",
}

export const cleric: ClassRequirement = {
    ctype: "class-requirement",
    class: "Cleric",
}

export const druid: ClassRequirement = {
    ctype: "class-requirement",
    class: "Druid",
}

export const warlock: ClassRequirement = {
    ctype: "class-requirement",
    class: "Warlock",
}

export const mage: ClassRequirement = {
    ctype: "class-requirement",
    class: "Mage",
}

export const bard: ClassRequirement = {
    ctype: "class-requirement",
    class: "Bard",
}

export const rogue: ClassRequirement = {
    ctype: "class-requirement",
    class: "Rogue",
}

export const ranger: ClassRequirement = {
    ctype: "class-requirement",
    class: "Ranger",
}

export const zeroStakingQuestRequirement: StakingQuestRequirement = 
    { aps: zeroAPS, }

export const apsStakingQuestRequirement = (aps: APS): StakingQuestRequirement => 
    ({ ...zeroStakingQuestRequirement, aps })

export const collectionStakingQuestRequirement = (collection: CharacterCollection): StakingQuestRequirement =>
    ({ ...zeroStakingQuestRequirement, collection: [collection] })

export const classStakingQuestRequirement = (classType: CharacterClass): StakingQuestRequirement =>
    ({ ...zeroStakingQuestRequirement, class: [classType] })

export const assetRefStakingQuestRequirement = (assetRef: string): StakingQuestRequirement =>
    ({ ...zeroStakingQuestRequirement, assetRef: [assetRef] })

export const rewardBonusStakingQuestRequirement = (reward: StakingReward): StakingQuestRequirement =>
    ({ ...zeroStakingQuestRequirement, rewardBonus: reward})

export const successBonusStakingQuestRequirement = (success: number): StakingQuestRequirement =>
    ({ ...zeroStakingQuestRequirement, successBonus: success})

export const addStakingQuestRequirement = (a: StakingQuestRequirement, b: StakingQuestRequirement): StakingQuestRequirement => ({
    aps: addAPS(a.aps, b.aps),
    collection: a.collection && b.collection ? a.collection.concat(b.collection) : a.collection || b.collection,
    class: a.class && b.class ? a.class.concat(b.class) : a.class || b.class,
    assetRef: a.assetRef && b.assetRef ? a.assetRef.concat(b.assetRef) : a.assetRef || b.assetRef,
    rewardBonus: a.rewardBonus && b.rewardBonus ? addStakingReward(a.rewardBonus, b.rewardBonus) : a.rewardBonus || b.rewardBonus,
    successBonus: a.successBonus && b.successBonus ? a.successBonus + b.successBonus : a.successBonus || b.successBonus,
})

/**
 * Flattens two possible staking quest requirements together. 
 * In Possible Staking Quest Requirements, Arrays are used to represent "or"s while "and"s are added and flattened into harder singular requirements.
 * If both are arrays, they are concatenated. Resulting on an array of "or"s.
 * If one is an array and the other is not, the non-array is added to each element of the array. Resulting in distributing the "and"s over the "or"s.
 * 
 * Note that this was implemented with redundant code to avoid the need for type guards.
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export const andPossibilities = <T>(add: (a: T, b: T) => T) => (a: Possible<T>, b: Possible<T>): Possible<T> => {
    if (Array.isArray(a) && Array.isArray(b)) return a.concat(b)
    else if (Array.isArray(a) && !Array.isArray(b)) return a.map(req => add(req, b))
    else if (Array.isArray(b) && !Array.isArray(a)) return b.map(req => add(req, a))
    else if (!Array.isArray(a) && !Array.isArray(b)) return add(a, b)
    return a
}

/**
 * Flattens two possible staking quest requirements together. 
 * In Possible Staking Quest Requirements, Arrays are used to represent "or"s while "and"s are added and flattened into harder singular requirements.
 * If both are arrays, they are concatenated. Resulting on an array of "or"s.
 * If one is an array and the other is not, the non-array is concatenated to the array. Resulting in a bigger array of "or"s.
 * 
 * Note that this was implemented with redundant code to avoid the need for type guards.
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export const orPossibilities = <T>(a: Possible<T>, b: Possible<T>): Possible<T> => {
    if (Array.isArray(a) && Array.isArray(b)) return a.concat(b)
    else if (Array.isArray(a) && !Array.isArray(b)) return a.concat([b])
    else if (Array.isArray(b) && !Array.isArray(a)) return b.concat([a])
    else if (!Array.isArray(a) && !Array.isArray(b)) return [a, b]
    return a
}

/**
 * Intended to be used to extract the requirements for bonus requirements in the parsing of the requirements dsl.
 * 
 * @param possible 
 * @returns 
 */
/*
export const extractPossibleBaseStakingQuestRequirements = (requirements: Possible<StakingQuestRequirement>): Possible<BaseStakingQuestRequirement> => 
    Array.isArray(requirements) ? requirements.map(extractBaseRequirements) : extractBaseRequirements(requirements)

export const extractBaseRequirements = (requirements: StakingQuestRequirement): BaseStakingQuestRequirement =>
    ({ aps: requirements.aps, collection: requirements.collection, class: requirements.class, assetRef: requirements.assetRef })
*/

export const parseStakingQuestRequirementsDSL = (dsl: StakingQuestRequirementDSL): StakingQuestRequirement[] => {
    const parse = (requirements: StakingQuestRequirementDSL): Possible<StakingQuestRequirement> => {
        switch (requirements.ctype) {
            case "aps-requirement":
                return apsStakingQuestRequirement(requirements)
            case "collection-requirement":
                return collectionStakingQuestRequirement(requirements.collection)
            case "class-requirement":
                return classStakingQuestRequirement(requirements.class)
            case "asset-ref-requirement":
                return assetRefStakingQuestRequirement(requirements.assetRef)
            case "success-bonus-requirement":
                return successBonusStakingQuestRequirement(requirements.bonus)
            case "reward-bonus-requirement":
                return rewardBonusStakingQuestRequirement(requirements.bonus)
            case "empty-requirement":
                return zeroStakingQuestRequirement
            case "and-requirement":
                return andPossibilities(addStakingQuestRequirement)(parse(requirements.left), parse(requirements.right))
            case "or-requirement":
                return orPossibilities(parse(requirements.left), parse(requirements.right))
        }
    }
    const parsed = parse(dsl)
    return Array.isArray(parsed) ? parsed : [parsed]
}

export function parseEasyJsonSyntax(json: any): StakingQuestRequirementDSL {
    if (isStakingQuestRequirementDSL(json)) return json
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
            
            else if (key == "rewardBonus" && typeof value == "number" && (value > 100 || value <= 0))
                throw new Error("A reward bonus cannot be greater than 100 or less than or equal to 0: " + JSON.stringify(json))
            else if (key == "rewardBonus" && typeof value == "number")
                return rewardBonus(value)
            else if (key == "rewardBonus")
                throw new Error("Invalid reward bonus: " + JSON.stringify(json))  

            else if (key == "successBonus" && typeof value == "number" && (value > 1 || value <= 0))
                throw new Error("A success bonus cannot be greater than 1 or less than or equal to 0: " + JSON.stringify(json))
            else if (key == "successBonus" && typeof value == "number")
                return successBonus(value)
            else if (key == "successBonus")
                throw new Error("Invalid success bonus: " + JSON.stringify(json))  

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
            else if (key == "collections" && Array.isArray(value) && value.every(isCharacterCollection))
                return all(value.map(collectionReq))
            else if (key == "classes" && Array.isArray(value) && value.every(isCharacterClass))
                return all(value.map(classReq))
            else if (key == "assets" && Array.isArray(value) && value.every(isAssetRef))
                return all(value.map(assetRefReq))
            else 
                throw new Error(`Unknown key word ${key} and ${json[key]}`)
        } else
            return all(keys.map(key => parseEasyJsonSyntax({ [key]: json[key] })))
    } else 
        throw new Error("Invalid requirement: " + json)
}
