import { RefObject, useEffect } from "react"
import { Adventurer, takenQuestSecondsLeft, takenQuestStatus } from "../../common"
import { notEmpty } from "../../utils"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { QuestBoardApi } from "../quest-board"
import { activityId, DraggableItem, DraggingState, InventoryItem, inventoryItemId, SelectedQuest } from "./inventory-dsl"
import {
    dragItemEnded, inventoryStore, addAdventurerToParty,
    openActivity, setDraggingState, toggleInventory, removeAdventurerFromParty, closeActivity, registerDropBoxes
} from "./inventory-state"
import { claimTakenQuest, fetchMintTest, getInProgressQuests, getInventory, takeAvailableQuest } from "./inventory-thunks"

const InventoryTransitions = {

    trackInventoryState: () => {
        const interval = setInterval(() => {
            const state = inventoryStore.getState()
            const finishedQuests = state.takenQuests.filter(quest => takenQuestSecondsLeft(quest) == -1)
            finishedQuests.forEach(quest => NotificationsApi.notify(`Quest ${quest.quest.name} finished!`, "info"))
        }, 1000)
        return interval 
    },

    onRefreshInventory: () => {
        inventoryStore.dispatch(getInventory())
        inventoryStore.dispatch(getInProgressQuests())
    },

    onToggleInventory: () => {
        inventoryStore.dispatch(toggleInventory())
    },

    onSelectQuest: (quest: SelectedQuest) => {
        inventoryStore.dispatch(openActivity(quest))
        inventoryStore.dispatch(toggleInventory(true))
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
        else if (quest?.ctype == "taken-quest" && takenQuestStatus(quest) === "claimed")
            inventoryStore.dispatch(closeActivity())
        else if (quest?.ctype == "taken-quest" && takenQuestStatus(quest) === "finished") 
            inventoryStore.dispatch(claimTakenQuest(quest, adventurers))
    },

    removeAdventurerFromParty: (adventurer: Adventurer | null) => {
        const activity = inventoryStore.getState().activitySelection
        if (adventurer && activity?.ctype === "available-quest")
            inventoryStore.dispatch(removeAdventurerFromParty(adventurer))
    },

    addAdventurerToParty: (adventurer: Adventurer, slot?: number) => {
        const activity = inventoryStore.getState().activitySelection
        if (activity?.ctype === "available-quest")
            inventoryStore.dispatch(addAdventurerToParty({ adventurer, slot }))
    },

    onItemClick: (item: InventoryItem) => {
        const activeActivity = inventoryStore.getState().activitySelection
        if (activityId(activeActivity) === inventoryItemId(item))
            inventoryStore.dispatch(closeActivity()) 
        else if(item.ctype == "adventurer" && activeActivity?.ctype === "available-quest")
            inventoryStore.dispatch(addAdventurerToParty({ adventurer: item })) 
        else 
            inventoryStore.dispatch(openActivity(item))
    },

    setDraggingState: (state: DraggingState) => {
        //if (state.item.ctype == "adventurer")
        //    OverworldApi.draggingItemIntoOverworld(state.item, state.position)
        inventoryStore.dispatch(setDraggingState(state))
    },

    registerDropBoxes: (utility: "party-pick" | "other", refs: RefObject<HTMLDivElement>[]) => {
        inventoryStore.dispatch(registerDropBoxes({ 
            utility, 
            dropBoxes: refs.map(ref => {
                if (!ref.current) throw new Error("Ref for dropbox not set")
                const { top, left, bottom, right } = ref.current.getBoundingClientRect()
                return { top, left, bottom, right }
            })
        }))
    },

    deregisterDropBoxes: () => {
        inventoryStore.dispatch(registerDropBoxes({utility: "other", dropBoxes: []}))
    },

    onItemDragEnded: () => {
        inventoryStore.dispatch(dragItemEnded())
    },

    onRecruitAdventurer: () => {
        inventoryStore.dispatch(fetchMintTest())
    },
}

export default InventoryTransitions
