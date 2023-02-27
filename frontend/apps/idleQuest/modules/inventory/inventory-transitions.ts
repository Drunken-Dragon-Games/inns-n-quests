import { Adventurer, takenQuestSecondsLeft } from "../../dsl"
import { IdleQuestsSnD } from "../../idle-quests-state"
import { DraggableItem, InventoryItem, SelectedQuest } from "./inventory-dsl"
import {
    dragItemEnded, dragItemStarted, finishLoadingModule, pickAdventurerForQuest,
    selectAdventurer, selectQuest, toggleInventory, unPickAdventurerForQuest, unselectQuest
} from "./inventory-state"
import { claimTakenQuest, fetchMintTest, getInProgressQuests, getInventory, takeAvailableQuest } from "./inventory-thunks"

export type InventoryTransitions = {
    onFinishLoadingModule: (module: number) => void
    onRefreshInventory: (firstTime: boolean) => void
    onToggleInventory: () => void
    onSelectQuest: (quest: SelectedQuest) => void
    onCloseSelectedQuestAndInventory: () => void
    onSignQuest: (quest: SelectedQuest, adventurers: Adventurer[]) => void
    onUnselectAdventurer: (adventurer: Adventurer) => void
    onItemClick: (item: InventoryItem) => void
    onItemDragStarted: (item: DraggableItem) => void
    onItemDragEnded: (item: DraggableItem) => void
    onRecruitAdventurer: () => void
}

export const inventoryTransitions = ({ state, dispatch }: IdleQuestsSnD): InventoryTransitions => ({
    
    onFinishLoadingModule: (module: number) => 
        dispatch(finishLoadingModule({ module })),

    onRefreshInventory: (firstTime: boolean) => {
        dispatch(getInventory(firstTime))
        dispatch(getInProgressQuests())
    },

    onToggleInventory: () => {
        dispatch(toggleInventory())
    },

    onSelectQuest: (quest: SelectedQuest) => {
        dispatch(selectQuest(quest))
        dispatch(toggleInventory())
    },

    onCloseSelectedQuestAndInventory: () => {
        dispatch(unselectQuest())
        dispatch(toggleInventory())
    },
    
    onSignQuest: (quest: SelectedQuest, adventurers: Adventurer[]) => {
        if (quest.ctype == "available-quest" && adventurers.length > 0) {
            dispatch(takeAvailableQuest(quest, adventurers))
            //dispatch(removeAvailableQuest(quest))
            dispatch(toggleInventory())
        } else if (quest.ctype == "taken-quest" && quest.claimedAt) {
            dispatch(unselectQuest())
        } else if (quest.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0) {
            dispatch(claimTakenQuest(quest, adventurers))
        }
    },

    onUnselectAdventurer: (adventurer: Adventurer) => {
        dispatch(unPickAdventurerForQuest(adventurer))
    },

    onItemClick: (item: InventoryItem)=> {
        item.ctype == "adventurer" && 
        state.inventory.selection && 
        state.inventory.selection.ctype === "available-quest" ? 
            dispatch(pickAdventurerForQuest(item)) :

        item.ctype == "adventurer" && 
        state.inventory.selection && 
        state.inventory.selection.ctype === "taken-quest" ? 
            (() => { 
                dispatch(unselectQuest()) 
                dispatch(selectAdventurer(item)); 
            })() :

        item.ctype == "adventurer" && 
        state.inventory.selection && 
        state.inventory.selection.ctype === "adventurer" &&
        state.inventory.selection.adventurerId === item.adventurerId ?
            dispatch(selectAdventurer(undefined)) :

        item.ctype == "adventurer" ?
            dispatch(selectAdventurer(item)) :

        item.ctype == "taken-quest" && 
        state.inventory.selection && 
        state.inventory.selection.ctype === "taken-quest" && 
        state.inventory.selection.takenQuestId === item.takenQuestId ? 
            dispatch(unselectQuest()) :

        item.ctype == "taken-quest" ? 
            dispatch(selectQuest(item)) :

        null
    },

    onItemDragStarted: (item: DraggableItem) => {
        dispatch(dragItemStarted(item))
    },

    onItemDragEnded: (item: DraggableItem) => {
        dispatch(dragItemEnded(item))
    },

    onRecruitAdventurer: () => {
        dispatch(fetchMintTest())
    },
})
