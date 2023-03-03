import { AvailableQuest } from "./available-quest"
import { Reward } from "./quest"

export type TakenQuest = {
    takenQuestId: string,
    availableQuest: AvailableQuest,
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

