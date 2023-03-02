import { Adventurer, takenQuestSecondsLeft, takenQuestStatus } from "../../common"
import { notEmpty } from "../../utils"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { QuestBoardApi } from "../quest-board"
import { activityId, DraggingState, DropBox, DropBoxUtility, InventoryItem, inventoryItemId, SelectedQuest } from "./inventory-dsl"
import { addAdventurerToParty, closeActivity, dragItemEnded, inventoryStore, openActivity, registerDropBoxes, removeAdventurerFromParty, setDraggingState, toggleInventory } from "./inventory-state"
import { claimTakenQuest, fetchMintTest, getInProgressQuests, getInventory, takeAvailableQuest } from "./inventory-thunks"

const InventoryTransitions = {

    trackInventoryState: () => {
        const interval = setInterval(() => {
            const state = inventoryStore.getState()
            const finishedQuests = state.takenQuests.filter(quest => takenQuestSecondsLeft(quest) == -1)
            finishedQuests.forEach(quest => NotificationsApi.notify(`Quest ${quest.quest.name} finished!`, "info"))
        }, 1000)

        inventoryStore.subscribe(() => {
            const state = inventoryStore.getState()
            const dropBoxesState = state.dropBoxesState
            const draggingState = state.draggingState
            if (dropBoxesState?.utility == "overworld-drop") {
                const hovering = dropBoxesState?.dropBoxes[0]?.hovering
                const droped = dropBoxesState?.dropBoxes[0]?.dropped
                if ((droped?.ctype === "adventurer" || droped?.ctype == "furniture") && !draggingState)
                    OverworldApi.draggingItemIntoOverworld(droped)
                else if ((hovering?.ctype === "adventurer" || hovering?.ctype == "furniture") && draggingState?.position)
                    OverworldApi.draggingItemIntoOverworld(hovering, draggingState.position)
                else if (!hovering && !droped)
                    OverworldApi.cancelDraggingItemIntoOverworld()
            }
        })

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

    registerDropBoxes: (utility: DropBoxUtility, dropBoxes: DropBox[]) => {
        inventoryStore.dispatch(registerDropBoxes({ utility, dropBoxes, }))
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
