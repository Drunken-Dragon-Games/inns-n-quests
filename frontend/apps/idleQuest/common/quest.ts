import { simpleHash } from "../utils"
import { APS } from "./aptitude-points-system"
import { QuestRequirement } from "./quest-requirements"

export type AvailableQuest = {
    ctype: "available-quest",
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: QuestRequirement,
    reward: Reward,
    duration: number,
    slots: number,
    seal: SealType,
    paper: 1 | 2 | 3 | 4
}

export type TakenQuest = {
    ctype: "taken-quest",
    takenQuestId: string,
    userId: string,
    quest: AvailableQuest,
    adventurerIds: string[],
    claimedAt?: string,
    createdAt: string,
}

export type SealType = "kings-plea" | "heroic-quest" | "valiant-adventure" | "townsfolk"

export const sealTypes = ["kings-plea", "heroic-quest", "valiant-adventure", "townsfolk"] 

export const tagTakenQuest = (takenQuest: object): object => 
    ({...takenQuest, ctype: "taken-quest"})

export const tagAvailableQuest = (availableQuest: object): object =>
    ({...availableQuest, ctype: "available-quest"})

export type Outcome = SuccessOutcome | FailureOutcome

export type SuccessOutcome = {
    ctype: "success-outcome",
    reward: Reward
}

export type FailureOutcome = {
    ctype: "failure-outcome",
    hpLoss: { adventurerId: string, hp: number }[],
}

export type TakenQuestStatus = "in-progress" | "finished" | "claimed"

export type AssetReward = { policyId: string, unit: string, quantity: string }

export type Reward = { 
    currencies?: AssetReward[], 
    apsExperience?: APS 
}

export function takenQuestStatus(takenQuest: TakenQuest): TakenQuestStatus {
    if (takenQuest.claimedAt) return "claimed"
    const isDone = takenQuestSecondsLeft(takenQuest) <= 0
    return isDone ? "finished" : "in-progress"
}

export function takenQuestSecondsLeft(takenQuest: TakenQuest): number {
    const nowSeconds = Math.round(Date.now() / 1000)
    const createdOn = Math.round(new Date(takenQuest.createdAt).getTime() / 1000)
    return createdOn + takenQuest.quest.duration - nowSeconds
}

export function takenQuestTimeLeft(takenQuest: TakenQuest): string {
    const secondsLeft = takenQuestSecondsLeft(takenQuest)
    const minutesLeft = Math.floor(secondsLeft / 60)
    const hoursLeft = Math.floor(minutesLeft / 60)
    if (hoursLeft > 0) return `${hoursLeft}h ${minutesLeft % 60}m`
    else if (minutesLeft > 0) return `${minutesLeft}m ${secondsLeft % 60}s`
    else if (secondsLeft > 0) return `${secondsLeft}s`
    else return "finished"
}

export const addVisualQuestData = (quest: any) => ({
    ...quest,
    seal: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
    paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
})

export const addVisualDataToTakenQuests = (quest: any) =>
    ({ ...quest, quest: addVisualQuestData(quest.quest) })
