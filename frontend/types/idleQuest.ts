export interface AvailableQuestType {
    uiid?: string
    id: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    width?: number
    height?: number
    requirements: RequirementType
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

export interface DataAdventurerType{
    id: string
    name: string,
    experience: number
    adventurer_img: string
    in_quest: boolean
    on_chain_ref: string
    onRecruitment?: boolean
    sprites: string
    type: "pixeltile" | "gma"
    metadata: MetadataType
    race: string
    class: string
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
    id: string
    in_quest: boolean
    metadata: MetadataType
    on_chain_ref: string
    player_stake_address: string
    type: "pixeltile" | "gma"
}

