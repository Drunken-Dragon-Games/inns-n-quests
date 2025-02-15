import { simpleHash } from "."
import { Character, rules, TakenStakingQuest } from "./backend-api"

export type SealType = "kings-plea" | "heroic-quest" | "valiant-adventure" | "townsfolk"

export const sealTypes = ["kings-plea", "heroic-quest", "valiant-adventure", "townsfolk"] 

export type TakenQuestStatus = "in-progress" | "finished" | "claimed"

export type HydratedTakenQuest 
    = { ctype: "valid-quest", quest: TakenStakingQuest } 
    | { ctype: "missing-adventurers", quest: TakenStakingQuest, missing: number }

export const hydrateTakenQuests = (characters: Record<string, Character>) => (takenQuest: TakenStakingQuest): HydratedTakenQuest => {
    const missingAdventurers = takenQuest.partyIds.filter(entityId => !characters[entityId])
    if (missingAdventurers.length > 0) return {
        ctype: "missing-adventurers",
        quest: takenQuest,
        missing: missingAdventurers.length
    }
    const configuration = rules.stakingQuest.questConfiguration(takenQuest.availableQuest, takenQuest.partyIds.map(id => characters[id]))
    return {
        ctype: "valid-quest",
        quest: {
            ...takenQuest,
            configuration,
        }
    }
}

export function takenQuestStatus(takenQuest: TakenStakingQuest): TakenQuestStatus {
    if (takenQuest.claimedAt) return "claimed"
    const isDone = takenQuestSecondsLeft(takenQuest) <= 0
    return isDone ? "finished" : "in-progress"
}

export function takenQuestSecondsLeft(takenQuest: TakenStakingQuest): number {
    const nowSeconds = Math.round(Date.now() / 1000)
    const createdOn = Math.round(new Date(takenQuest.createdAt).getTime() / 1000)
    const configuration = takenQuest.configuration.configurations[takenQuest.configuration.bestIndex]
    return createdOn + configuration.satisfactionInfo.requirementInfo.duration - nowSeconds
}

export function takenQuestTimeLeft(takenQuest: TakenStakingQuest): string {
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
