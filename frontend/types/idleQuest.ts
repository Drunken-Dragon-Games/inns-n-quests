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

