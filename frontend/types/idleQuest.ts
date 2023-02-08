import { AdventurerClass, AdventurerCollection, QuestRequirement, Race, Reward } from "../apps/idleQuest"

export interface AvailableQuestType {
    name: string
    description: string
    duration: number

    questId: string
    location: string
    reward: Reward
    requirements: QuestRequirement

    // Deprecated, remove asap
    uiid?: string
    id: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    width?: number
    height?: number
    //requirements: RequirementType
}

export interface RequirementType{
    character?: CharacterType []
    all?: boolean
    party?: PartyTYpe
}

export interface CharacterType {
    class?: string
    race?: string
}

export interface PartyTYpe {
    balanced: boolean
}



export interface MetadataType{
    is_alive?: boolean,
    dead_cooldown?: number
}

export interface inProgressQuestType{
    enrolls: EnrollsType []
    id: string
    is_claimed: boolean
    player_stake_address: string
    quest: QuestType
    quest_id: string
    started_on: string
    state: "failed" | "succeeded" | "in_progress" | null
}

interface QuestType{
    description: string
    difficulty: number
    duration: number
    id: string
    name: string
    rarity: string
    reward_ds: number
    reward_xp: number
    slots: number
    requirements: RequirementType
}

export interface EnrollsType{
    adventurer: AdventurerInQuestType
    adventurer_id: string
    taken_quest_id: string
}

interface AdventurerInQuestType{
    experience: number
    adventurerId: string
    in_quest: boolean
    metadata: MetadataType
    on_chain_ref: string
    player_stake_address: string
    type: "pixeltile" | "gma"
}

export interface DataAdventurerType{
    adventurerId: string
    name: string
    class: AdventurerClass
    race: Race

    assetRef: string
    sprite: string
    hp: number
    athleticism: number
    intellect: number
    charisma: number
    inChallenge: boolean
    collection: AdventurerCollection

    // Old properties, remove once the new backend models have been implemented 
    experience: number
    in_quest: boolean
    on_chain_ref: string
    onRecruitment?: boolean
    //sprites: string
    //type: "pixeltile" | "gma"
    metadata: MetadataType
}
