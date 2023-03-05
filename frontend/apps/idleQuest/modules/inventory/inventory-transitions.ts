import { Character, takenQuestSecondsLeft, takenQuestStatus } from "../../common"
import { notEmpty } from "../../utils"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { QuestBoardApi } from "../quest-board"
import { activityId, DraggingState, DropBox, DropBoxUtility, InventoryItem, inventoryItemId, SelectedQuest } from "./inventory-dsl"
import { addCharacterToParty, closeActivity, dragItemEnded, inventoryStore, openActivity, registerDropBoxes, removeCharacterFromParty, setDraggingState, toggleInventory } from "./inventory-state"
import { claimTakenQuest, fetchMintTest, getInProgressQuests, getInventory, takeAvailableQuest } from "./inventory-thunks"

const InventoryTransitions = {

    trackInventoryState: () => {
        const interval = setInterval(() => {
            const state = inventoryStore.getState()
            const finishedQuests = state.takenQuests.filter(quest => takenQuestSecondsLeft(quest) == -1)
            finishedQuests.forEach(quest => NotificationsApi.notify(`Quest ${quest.availableQuest.name} finished!`, "info"))
        }, 1000)

        inventoryStore.subscribe(() => {
            const state = inventoryStore.getState()
            const dropBoxesState = state.dropBoxesState
            const draggingState = state.draggingState
            if (dropBoxesState?.utility == "overworld-drop") {
                const hovering = dropBoxesState?.dropBoxes[0]?.hovering
                const droped = dropBoxesState?.dropBoxes[0]?.dropped
                if ((droped?.ctype === "character" || droped?.ctype == "furniture") && !draggingState)
                    OverworldApi.draggingItemIntoOverworld(droped)
                else if ((hovering?.ctype === "character" || hovering?.ctype == "furniture") && draggingState?.position)
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

    removeCharacterFromParty: (character: Character | null) => {
        const activity = inventoryStore.getState().activitySelection
        if (character && activity?.ctype === "available-quest")
            inventoryStore.dispatch(removeCharacterFromParty(character))
    },

    addCharacterToParty: (character: Character, slot?: number) => {
        const activity = inventoryStore.getState().activitySelection
        if (activity?.ctype === "available-quest")
            inventoryStore.dispatch(addCharacterToParty({ character, slot }))
    },

    onItemClick: (item: InventoryItem) => {
        const activeActivity = inventoryStore.getState().activitySelection
        if (activityId(activeActivity) === inventoryItemId(item))
            inventoryStore.dispatch(closeActivity()) 
        else if(item.ctype == "character" && activeActivity?.ctype === "available-quest")
            inventoryStore.dispatch(addCharacterToParty({ character: item })) 
        else 
            inventoryStore.dispatch(openActivity(item))
    },

    setDraggingState: (state: DraggingState) => {
        //if (state.item.ctype == "character")
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

    onRecruitCharacter: () => {
        inventoryStore.dispatch(fetchMintTest())
    },
}

export default InventoryTransitions
