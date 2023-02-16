import { APS } from "./aptitude-points-system"
import { QuestRequirement, APSRequirement, mergeAPSRequirementMax } from "./quest-requirements"

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

export type SelectedQuest = AvailableQuest | TakenQuest

export type TakenQuestStatus = "in-progress" | "finished" | "claimed"

export type SealType = "kings-plea" | "heroic-quest" | "valiant-adventure" | "townsfolk"

export const sealTypes = ["kings-plea", "heroic-quest", "valiant-adventure", "townsfolk"] 

export type AssetReward = { policyId: string, unit: string, quantity: string }

export type Reward = { 
    currencies?: AssetReward[], 
    apsExperience?: APS 
}

export const mapSealImage = (quest: SelectedQuest): { src: string, width: number, height: number } => {
    switch (questSeal(quest)) {
        case "heroic-quest": return { 
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest_big.png",
            width: 6, height: 9
        }
        case "kings-plea": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea_big.png",
            width: 9, height: 9.5
        }
        case "valiant-adventure": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/valiant_adventure_big.png",
            width: 6, height: 6
        }
        default: return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/townsfolk_big.png",
            width: 8, height: 3
        }
    }
}

export const mapQuestScroll = (takenQuest: TakenQuest) => {
    switch (takenQuest.quest.seal) {
        case "kings-plea": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/kings_plea.png"
        case "heroic-quest": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/heroic_quest.png"
        case "valiant-adventure": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/valiant_adventure.png"
        case "townsfolk": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/townsfolk.png"
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
    if (hoursLeft > 0) return `${hoursLeft}h ${minutesLeft % 60}m`
    else if (minutesLeft > 0) return `${minutesLeft}m ${secondsLeft % 60}s`
    else if (secondsLeft > 0) return `${secondsLeft}s`
    else return "finished"
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