import { SealType, SelectedQuest, TakenQuest, TakenQuestStatus } from "./models"

export function takenQuestStatus(takenQuest: TakenQuest): TakenQuestStatus {
    if (takenQuest.claimedAt) return "claimed"
    const isDone = takenQuestSecondsLeft(takenQuest) <= 0
    return isDone ? "finished" : "in-progress"
}

export function takenQuestSecondsLeft(takenQuest: TakenQuest): number {
    const nowSeconds = Date.now() / 1000
    return new Date(takenQuest.createdAt).getSeconds() + takenQuest.quest.duration - nowSeconds
}

export function takenQuestTimeLeft(takenQuest: TakenQuest): string {
    const secondsLeft = takenQuestSecondsLeft(takenQuest)
    const minutesLeft = Math.floor(secondsLeft / 60)
    const hoursLeft = Math.floor(minutesLeft / 60)
    if (hoursLeft > 0) return `${hoursLeft}h ${minutesLeft}m`
    else if (minutesLeft > 0) return `${minutesLeft}m ${secondsLeft}s`
    else if (secondsLeft > 0) return `${secondsLeft}s`
    else return "Finished"
}

export const tagTakenQuest = (takenQuest: object): object => 
    ({...takenQuest, ctype: "taken-quest"})

export const tagAvailableQuest = (availableQuest: object): object =>
    ({...availableQuest, ctype: "available-quest"})

export const takenQuestId = (quest?: SelectedQuest): string =>
    quest?.ctype === "taken-quest" ? quest.takenQuestId : ""

export const questId = (quest: SelectedQuest): string =>
    quest.ctype === "taken-quest" ? quest.quest.questId : quest.questId

export const questName = (quest: SelectedQuest): string =>
    quest.ctype === "taken-quest" ? quest.quest.name : quest.name

export const questDescription = (quest: SelectedQuest): string =>
    quest.ctype === "taken-quest" ? quest.quest.description : quest.description

export const questPaper = (quest: SelectedQuest): number =>
    quest.ctype === "taken-quest" ? quest.quest.paper : quest.paper

export const questSeal = (quest: SelectedQuest): SealType =>
    quest.ctype === "taken-quest" ? quest.quest.seal : quest.seal