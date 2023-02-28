import { Adventurer, takenQuestSecondsLeft } from "../../common"
import { notEmpty } from "../../utils"
import { QuestBoardApi } from "../quest-board"
import { activityId, DraggableItem, DraggingState, InventoryItem, inventoryItemId, SelectedQuest } from "./inventory-dsl"
import {
    dragItemEnded, inventoryStore, addAdventurerToParty,
    openActivity, setDraggingState, toggleInventory, removeAdventurerFromParty, closeActivity
} from "./inventory-state"
import { claimTakenQuest, fetchMintTest, getInProgressQuests, getInventory, takeAvailableQuest } from "./inventory-thunks"

const InventoryTransitions = {

    onRefreshInventory: () => {
        inventoryStore.dispatch(getInventory())
        inventoryStore.dispatch(getInProgressQuests())
    },

    onToggleInventory: () => {
        inventoryStore.dispatch(toggleInventory())
    },

    onSelectQuest: (quest: SelectedQuest) => {
        inventoryStore.dispatch(openActivity(quest))
        inventoryStore.dispatch(toggleInventory())
    },

    closeActivity: () => {
        inventoryStore.dispatch(closeActivity())
    },
    
    onSignQuest: () => {
        const state = inventoryStore.getState()
        const quest = state.activitySelection
        const adventurers = state.selectedParty.filter(notEmpty)
        if (quest?.ctype == "available-quest" && adventurers.length > 0) {
            inventoryStore.dispatch(takeAvailableQuest(quest, adventurers))
            inventoryStore.dispatch(toggleInventory())
            QuestBoardApi.removeAvailableQuest(quest)
        } 
        else if (quest?.ctype == "taken-quest" && quest.claimedAt) 
            inventoryStore.dispatch(closeActivity())
        else if (quest?.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0) 
            inventoryStore.dispatch(claimTakenQuest(quest, adventurers))
    },

    removeAdventurerFromParty: (adventurer: Adventurer | null) => {
        const activity = inventoryStore.getState().activitySelection
        if (adventurer && activity?.ctype === "taken-quest")
            inventoryStore.dispatch(removeAdventurerFromParty(adventurer))
    },

    onItemClick: (item: InventoryItem) => {
        const activeActivity = inventoryStore.getState().activitySelection
        if (activityId(activeActivity) === inventoryItemId(item))
            inventoryStore.dispatch(closeActivity()) 
        else if(item.ctype == "adventurer" && activeActivity?.ctype === "available-quest")
            inventoryStore.dispatch(addAdventurerToParty(item)) 
        else 
            inventoryStore.dispatch(openActivity(item))
    },

    setDraggingState: (state: DraggingState) => {
        inventoryStore.dispatch(setDraggingState(state))
    },

    onItemDragEnded: (item: DraggableItem) => {
        inventoryStore.dispatch(dragItemEnded(item))
    },

    onRecruitAdventurer: () => {
        inventoryStore.dispatch(fetchMintTest())
    },
}

export default InventoryTransitions
