import { CharacterEntity } from "../character-entity"
import { AvailableQuest } from "./available-encounter"
import { Encounter } from "./encounter"
import { Reward } from "./reward"

export type TakenQuest = {
    takenQuestId: string,
    availableQuest: AvailableQuest,
    adventurerIds: string[],
    claimedAt?: Date,
    createdAt: Date,
    outcome?: QuestOutcome,
}

export type ActiveEncounter = {
    activeEncounterId: string,
    encounter: Encounter,
    chosenStrategyIndex: number,
    party: string[],
    claimedAt?: Date,
    createdAt: Date,
    outcome?: QuestOutcome,
}

export type QuestOutcome = SuccessOutcome | FailureOutcome

export type SuccessOutcome = {
    ctype: "success-outcome",
    party: CharacterEntity[]
    reward: Reward
}

export type FailureOutcome = {
    ctype: "failure-outcome",
    party: CharacterEntity[]
}

