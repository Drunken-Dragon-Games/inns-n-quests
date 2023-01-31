
export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export type Item = Adventurer | Pet

export type Adventurer = {
    ctype: "adventurer",
    adventurerId: string,
    name: string,
    class: string,
    race: string,
    collection: ItemCollection,
    assetRef: string,
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type ItemCollection = "gma" | "aot" | "px"

export type Pet = {
    ctype: "pet",
}

export type Challenge = Quest | Job

export type Quest = {
    ctype: "quest",
    questId: string,
    name: string,
    description: string,
    requirements: QuestRequirement,
    rewards: string,
    duration: number,
    slots: QuestSlot[],
    rarity: number,
}

export type QuestRequirement 
    = APSRequirement | ClassRequirement | OrRequirement | AndRequirement 
    | BonusRequirement

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

export type QuestSlot = "adventurer" | "pet"

export type Job = {
    ctype: "job",
}
