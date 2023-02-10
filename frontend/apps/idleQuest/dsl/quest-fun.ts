import { APS, APSRequirement, QuestRequirement, SealType, SelectedQuest, TakenQuest, TakenQuestStatus } from "./models"

export const zeroAPS: APS = { athleticism: 0, intellect: 0, charisma: 0 }

export function sameOrBetterAPS(a: APS, b: APS): boolean {
    return a.athleticism >= b.athleticism && a.intellect >= b.intellect && a.charisma >= b.charisma
}

export function mergeAPSRequirementMax(a: APSRequirement, b: APSRequirement): APSRequirement {
    return {
        ctype: "aps-requirement",
        athleticism: Math.max(a.athleticism, b.athleticism),
        intellect: Math.max(a.intellect, b.intellect),
        charisma: Math.max(a.charisma, b.charisma),
    }
}

export function mergeAPSSum(a: APS, b: APS): APS {
    return {
        athleticism: a.athleticism + b.athleticism,
        intellect: a.intellect + b.intellect,
        charisma: a.charisma + b.charisma,
    }
}

export function getQuestAPSRequirement(selectedQuest: SelectedQuest): APS {
    const search = (requirement: QuestRequirement): APSRequirement => {
        if (requirement.ctype === "aps-requirement") return requirement
        else if (requirement.ctype === "or-requirement") return mergeAPSRequirementMax(search(requirement.left), search(requirement.right))
        else if (requirement.ctype === "and-requirement") return mergeAPSRequirementMax(search(requirement.left), search(requirement.right))
        else if (requirement.ctype === "bonus-requirement") return search(requirement.right)
        else if (requirement.ctype === "success-bonus-requirement") return search(requirement.right)
        else if (requirement.ctype === "not-requirement") return search(requirement.continuation)
        else return { ctype: "aps-requirement", athleticism: 0, intellect: 0, charisma: 0 }
    }
    const quest = selectedQuest.ctype === "available-quest" ? selectedQuest : selectedQuest.quest
    const requirement = search(quest.requirements)
    return { athleticism: requirement.athleticism, intellect: requirement.intellect, charisma: requirement.charisma }
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