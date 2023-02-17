
export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export interface Adventurer {
    adventurerId?: string,
    userId: string,
    name: string,
    class: AdventurerClass,
    race: Race,
    collection: AdventurerCollection,
    assetRef: string,
    sprite?: string,
    hp: number,
    inChallenge?: boolean,
    athleticism: number,
    intellect: number,
    charisma: number,
    athXP: number,
    intXP: number,
    chaXP: number,
}

export type APS = {
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type AssetReward = { policyId: string, unit: string, quantity: string }

export type Reward = { 
    currencies?: AssetReward[], 
    apsExperience?: APS 
}

export type Race = "human" | "elf" | "tiefling" | "dragonkin" | "worgenkin" | "undead" | "viera" | "troll" | "vulkin" | "orc" | "tauren"

export const races = ["human", "elf", "tiefling", "dragonkin", "worgenkin", "undead", "viera", "troll", "vulkin", "orc", "tauren"]

export type AdventurerClass = "fighter" | "paladin" | "ranger" | "rogue" | "bard" | "mage" | "warlock" | "cleric" | "druid" | "knight"

export const adventurerClasses = ["fighter", "paladin", "ranger", "rogue", "bard", "mage", "warlock", "cleric", "druid", "knight"]

export type AdventurerCollection = "grandmaster-adventurers" | "adventurers-of-thiolden" | "pixel-tiles"

export const adventurerCollections = ["grandmaster-adventurers", "adventurers-of-thiolden", "pixel-tiles"]

export type Quest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: QuestRequirement,
    timeModifier?: { operator: "multiply" | "add" | "replace", modifier: number },
    rewardModifier?: { operator: "multiply" | "add" | "replace", modifier: Reward },
    slots?: number,
}

export type AvailableQuest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: QuestRequirement,
    reward: Reward,
    duration: number,
    slots: number,
}

export type TakenQuest = {
    takenQuestId?: string,
    userId: string,
    quest: AvailableQuest,
    adventurerIds: string[],
    claimedAt?: Date,
    createdAt: Date,
    outcome?: Outcome,
}

export type Outcome = SuccessOutcome | FailureOutcome

export type SuccessOutcome = {
    ctype: "success-outcome",
    reward: Reward
}

export type FailureOutcome = {
    ctype: "failure-outcome",
    hpLoss: { adventurerId: string, hp: number }[],
}

export type QuestRequirement 
    = APSRequirement | ClassRequirement | OrRequirement | AndRequirement 
    | BonusRequirement | SuccessBonusRequirement | NotRequirement | EmptyRequirement

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

export type NotRequirement = {
    ctype: "not-requirement",
    continuation: QuestRequirement,
}

export type EmptyRequirement = {
    ctype: "empty-requirement",
}

export type BattleReport = {
    latestFinishedQuest?: TakenQuest & { adventurers: Adventurer[] },
}

export type GetAllAdventurersResult 
    = { status: "ok", adventurers: Adventurer[] }
    | { status: "unknown-user" }

export type AcceptQuestResult
    = { status: "ok", takenQuest: TakenQuest }
    | { status: "unknown-quest" }
    | { status: "invalid-adventurers" }

export type GetAvailableQuestsResult
    = { status: "ok", quests: AvailableQuest[] }

export type GetTakenQuestsResult
    = { status: "ok", quests: TakenQuest[] }

export type ClaimQuestResult
    = { status: "ok", outcome: Outcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }
