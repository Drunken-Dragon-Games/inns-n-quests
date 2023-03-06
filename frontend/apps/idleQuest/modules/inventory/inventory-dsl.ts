import { RefObject } from "react"
import { Character, Furniture, AvailableQuest, SealType, TakenQuest, AvailableEncounter } from "../../common"
import { notEmpty } from "../../utils"
import * as vm from "../../game-vm"

export type SelectedQuest = AvailableQuest | TakenQuest | AvailableEncounter

export type InventoryPageName = "characters" | "taken-quests" | "furniture"

export type InventoryAsset = Character | Furniture

export type InventoryItem = Character | TakenQuest | Furniture

export type ActivitySelection = SelectedQuest | Character | Furniture

export type DraggableItem = Character | Furniture

export type DraggingState = {
    item: DraggableItem
    hide?: boolean
    position: [number, number]
}

export type DropBox = {
    top: number
    bottom: number
    left: number
    right: number
    dropped?: DraggableItem
    hovering?: DraggableItem
}

export type DropBoxesState = {
    utility: DropBoxUtility
    dragging: boolean
    dropBoxes: DropBox[]
}

export type DropBoxUtility = "party-pick" | "overworld-drop" | "other"

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

export const activityId = (activity?: ActivitySelection): string =>
    activity?.ctype === "character" ? activity.entityId :
    activity?.ctype === "taken-quest" ? activity.takenQuestId :
    activity?.ctype === "furniture" ? activity.entityId :
    "no-activity"

export const takenQuestId = (quest?: SelectedQuest): string =>
    quest?.ctype === "taken-quest" ? quest.takenQuestId : ""

export const questId = (quest: SelectedQuest): string =>
    quest.ctype === "taken-quest" ? quest.availableQuest.questId : 
    quest.ctype === "available-quest" ? quest.questId :
    quest.encounterId

export const questName = (quest: SelectedQuest): string =>
    quest.ctype === "taken-quest" ? quest.availableQuest.name : quest.name

export const questDescription = (quest: SelectedQuest): string =>
    quest.ctype === "taken-quest" ? quest.availableQuest.description : quest.description

//export const questPaper = (quest: SelectedQuest): number =>
    //0
    //quest.ctype === "taken-quest" ? quest.availableQuest.paper : quest.paper

export const questSeal = (quest: SelectedQuest): SealType =>
    "townsfolk"
    //quest.ctype === "taken-quest" ? quest.availableQuest.seal : quest.seal

export function inventoryItemId(item: InventoryItem): string {
    if (item.ctype === "character")
        return item.entityId
    else if (item.ctype === "furniture")
        return item.entityId
    else //if (item.ctype === "taken-quest")
        return item.takenQuestId
}

export function isDraggableItem(item?: any): item is DraggableItem {
    return item && (item.ctype === "character" || item.ctype === "furniture")
}

export function draggableItemId(item: DraggableItem): string {
    if (item.ctype === "character")
        return item.entityId
    else //if (item.ctype === "furniture")
        return item.entityId
}

export const mapQuestScroll = (takenQuest: TakenQuest) => {
    return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/townsfolk.png"
    /*
    switch (takenQuest.availableQuest.seal) {
        case "kings-plea": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/kings_plea.png"
        case "heroic-quest": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/heroic_quest.png"
        case "valiant-adventure": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/valiant_adventure.png"
        case "townsfolk": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/townsfolk.png"
        default: return ""
    }
    */
}

export function getQuestAPSRequirement(selectedQuest: SelectedQuest): vm.APS {
    /*
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
    */
    return { athleticism: 10, intellect: 10, charisma: 10 }
}

export const sortCharacters = (adventurers: Character[]) => {
    return adventurers.sort((a, b) => {
        if(a.inActivity && !b.inActivity){
            return 1
        }
        if(!a.inActivity && b.inActivity){
            return -1
        }
        return 0
    })
}

export const makeDropBox = (ref: RefObject<HTMLDivElement>): DropBox => {
    if (!ref.current) throw new Error("Ref for dropbox not set")
    const { top, left, bottom, right } = ref.current.getBoundingClientRect()
    return { top, left, bottom, right }
}

export function draggingIntersects(dropBoxesState?: DropBoxesState, draggingState?: DraggingState): [DropBoxesState | undefined, DraggingState | undefined] {
    if (!dropBoxesState) return [undefined, undefined]
    else {
        const dropBoxes: DropBox[] = dropBoxesState.dropBoxes.map(dropBox => {
            const hovering =
                draggingState &&
                    dropBox.top < draggingState.position[1] &&
                    dropBox.bottom > draggingState.position[1] &&
                    dropBox.left < draggingState.position[0] &&
                    dropBox.right > draggingState.position[0] ?
                    draggingState.item : undefined
            return { ...dropBox, hovering }
        })
        const dragging = notEmpty(draggingState)
        const hide = dropBoxes.some(dropBox => dropBox.hovering)
        return [{
            ...dropBoxesState,
            dropBoxes,
            dragging
        },
            draggingState ? {
                ...draggingState,
                hide
            } : undefined
        ]
    }
}
