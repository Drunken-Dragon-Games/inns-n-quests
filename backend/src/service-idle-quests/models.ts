
export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export type Adventurer = {
    adventurerId?: string,
    userId: string,
    name: string,
    class: AdventurerClass,
    race: Race,
    collection: AdventurerCollection,
    assetRef: string,
    sprite?: string,
    inChallenge?: boolean,
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type APS = {
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type Reward = { 
    currencies?: { policyId: string, unit: string, quantity: string }[], 
    apsExperience?: APS 
}

export type Race = "human" | "elf" | "tiefling" | "dragonkin" | "worgenkin" | "undead" | "viera" | "troll" | "vulkin" | "orc" | "tauren"

export const races = ["human", "elf", "tiefling", "dragonkin", "worgenkin", "undead", "viera", "troll", "vulkin", "orc", "tauren"]

export type AdventurerClass = "fighter" | "paladin" | "ranger" | "rogue" | "bard" | "mage" | "warlock" | "cleric" | "druid" | "knight"

export const adventurerClasses = ["fighter", "paladin", "ranger", "rogue", "bard", "mage", "warlock", "cleric", "druid", "knight"]

export type AdventurerCollection = "grandmaster-adventurers" | "adventurers-of-thiolden" | "pixel-tiles"

export const adventurerCollections = ["grandmaster-adventurers", "adventurers-of-thiolden", "pixel-tiles"]

export type AvailableQuest = {
    questId?: string,
    name: string,
    description: string,
    requirements: QuestRequirement,
    duration: number,
    slots: number,
}

export type TakenQuest = {
    questId?: string,
    userId: string,
    name: string,
    description: string,
    requirements: QuestRequirement,
    duration: number,
    adventurerIds: string[],
}

export type QuestRequirement 
    = APSRequirement | ClassRequirement | OrRequirement | AndRequirement 
    | BonusRequirement | OnlySuccessBonusRequirement

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

export type OnlySuccessBonusRequirement = {
    ctype: "only-success-bonus-requirement",
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

export type GetAllAdventurersResult 
    = { status: "ok", adventurers: Adventurer[] }
    | { status: "unknown-user" }