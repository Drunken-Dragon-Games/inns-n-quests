import { StakingQuestRequirement, StakingQuestRequirementDSL } from "./staking-quest-requirements"

export type StakingQuest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: StakingQuestRequirement[],
    timeModifier?: { operator: "multiply" | "add" | "replace", modifier: number },
    rewardModifier?: { operator: "multiply" | "add" | "replace", modifier: StakingReward },
    slots?: number,
}

export type TakenStakingQuest = {
    takenQuestId: string,
    availableQuest: StakingQuest,
    characterIds: string[],
    claimedAt?: Date,
    createdAt: Date,
    outcome?: StakingQuestOutcome,
}

export type StakingQuestOutcome = StakingSuccessOutcome | StakingFailureOutcome

export type StakingSuccessOutcome = {
    ctype: "success-outcome",
    reward: StakingReward
}

export type StakingFailureOutcome = {
    ctype: "failure-outcome",
}

export type StakingReward = { 
    currency: number,
}

export const zeroStakingReward: StakingReward = { currency: 0 }

export const stakingReward: (currency: number) => StakingReward = (currency) => ({ currency })

export const addStakingReward: (a: StakingReward, b: StakingReward) => StakingReward = (a, b) => ({
    currency: a.currency + b.currency,
})

export const multiplyStakingReward: (a: StakingReward, b: StakingReward) => StakingReward = (a, b) => ({
    currency: a.currency * b.currency,
})
