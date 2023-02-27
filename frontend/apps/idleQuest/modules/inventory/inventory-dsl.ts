import { Adventurer, APS, APSRequirement, AvailableQuest, mergeAPSRequirementMax, QuestRequirement, TakenQuest } from "../../dsl"
import { Furniture } from "../../dsl/furniture"
import { simpleHash } from "../../utils"

export type SelectedQuest = AvailableQuest | TakenQuest

export type InventoryAsset = Adventurer | Furniture

export type InventoryItem = Adventurer | TakenQuest | Furniture

export type InventorySelection = SelectedQuest | Adventurer | Furniture

export type DraggableItem = Adventurer | Furniture

export type SealType = "kings-plea" | "heroic-quest" | "valiant-adventure" | "townsfolk"

export const sealTypes = ["kings-plea", "heroic-quest", "valiant-adventure", "townsfolk"] 

export const mapSealImage = (quest: SelectedQuest): { src: string, width: number, height: number, offset: number } => {
    const scale = 1.8
    switch (questSeal(quest)) {
        case "heroic-quest": return { 
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest_big.png",
            width: 6 * scale, height: 9 * scale, offset: 0
        }
        case "kings-plea": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea_big.png",
            width: 9 * scale, height: 9.5 * scale, offset: 0
        }
        case "valiant-adventure": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/valiant_adventure_big.png",
            width: 6 * scale, height: 6 * scale, offset: 0
        }
        default: return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/townsfolk_big.png",
            width: 8 * scale, height: 3 * scale, offset: 4.5
        }
    }
}

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

export const addVisualQuestData = (quest: any) => ({
    ...quest,
    seal: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
    paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
})

export const addVisualDataToTakenQuests = (quest: any) =>
    ({ ...quest, quest: addVisualQuestData(quest.quest) })

export function inventoryItemId(item: InventoryItem): string {
    if (item.ctype === "adventurer")
        return item.adventurerId
    else if (item.ctype === "furniture")
        return item.furnitureId
    else //if (item.ctype === "taken-quest")
        return item.takenQuestId
}

export function isDraggableItem(item?: any): item is DraggableItem {
    return item && (item.ctype === "adventurer" || item.ctype === "furniture")
}

export function draggableItemId(item: DraggableItem): string {
    if (item.ctype === "adventurer")
        return item.adventurerId
    else //if (item.ctype === "furniture")
        return item.furnitureId
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
