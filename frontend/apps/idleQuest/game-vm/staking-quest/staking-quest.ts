import { StakingQuestRuleset } from "../iq-ruleset"
import { StakingQuestRequirement } from "./staking-quest-requirements"

export type StakingQuest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: StakingQuestRequirement,
    timeModifier?: { operator: "multiply" | "add" | "replace", modifier: number },
    rewardModifier?: { operator: "multiply" | "add" | "replace", modifier: StakingReward },
    slots?: number,
}

export type AvailableStakingQuest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: StakingQuestRequirement,
    reward: StakingReward,
    duration: number,
    slots: number,
}

export type TakenStakingQuest = {
    takenQuestId: string,
    availableQuest: AvailableStakingQuest,
    adventurerIds: string[],
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

export const noStakingReward: StakingReward = { currency: 0 }

export const addStakingRewards = (a: StakingReward, b: StakingReward): StakingReward => ({
    currency: a.currency + b.currency,
})
