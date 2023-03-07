import { Character, takenQuestSecondsLeft, takenQuestStatus } from "../../common"
import { notEmpty } from "../../utils"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { QuestBoardApi } from "../quest-board"
import { activityId, DraggingState, DropBox, DropBoxUtility, InventoryItem, inventoryItemId, SelectedQuest } from "./inventory-dsl"
import { inventoryStore, inventoryState } from "./inventory-state"
import InventoryThunks from "./inventory-thunks"

const actions = inventoryState.actions

const dispatch = inventoryStore.dispatch

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
        dispatch(InventoryThunks.getInventory())
        dispatch(InventoryThunks.getInProgressQuests())
    },

    onToggleInventory: () => {
        dispatch(actions.toggleInventory())
    },

    onSelectQuest: (quest: SelectedQuest) => {
        console.log(quest.ctype)
        dispatch(actions.openActivity(quest))
        dispatch(actions.toggleInventory(true))
    },

    closeActivity: () => {
        dispatch(actions.closeActivity())
    },
    
    onSignQuest: () => {
        const state = inventoryStore.getState()
        const quest = state.activitySelection
        const adventurers = state.selectedParty.filter(notEmpty)
        if (quest?.ctype == "available-staking-quest" && adventurers.length > 0) {
            dispatch(InventoryThunks.takeAvailableQuest(quest, adventurers))
            dispatch(actions.toggleInventory())
            QuestBoardApi.removeAvailableQuest(quest)
        } 
        else if (quest?.ctype == "taken-staking-quest" && takenQuestStatus(quest) === "claimed")
            dispatch(actions.closeActivity())
        else if (quest?.ctype == "taken-staking-quest" && takenQuestStatus(quest) === "finished") 
            dispatch(InventoryThunks.claimTakenQuest(quest, adventurers))
    },

    removeCharacterFromParty: (character: Character | null) => {
        const activity = inventoryStore.getState().activitySelection
        if (character && activity?.ctype !== "taken-staking-quest")
            dispatch(actions.removeCharacterFromParty(character))
    },

    addCharacterToParty: (character: Character, slot?: number) => {
        const activity = inventoryStore.getState().activitySelection
        if (activity?.ctype !== "taken-staking-quest")
            dispatch(actions.addCharacterToParty({ character, slot }))
    },

    onItemClick: (item: InventoryItem) => {
        const activeActivity = inventoryStore.getState().activitySelection
        if (activityId(activeActivity) === inventoryItemId(item))
            dispatch(actions.closeActivity()) 
        else if(item.ctype == "character" && activeActivity?.ctype !== "taken-staking-quest")
            dispatch(actions.addCharacterToParty({ character: item })) 
        else 
            dispatch(actions.openActivity(item))
    },

    setCharacterInfo: (character: Character) => {
        dispatch(actions.setCharacterInfo(character))
    },

    setDraggingState: (state: DraggingState) => {
        //if (state.item.ctype == "character")
        //    OverworldApi.draggingItemIntoOverworld(state.item, state.position)
        dispatch(actions.setDraggingState(state))
    },

    registerDropBoxes: (utility: DropBoxUtility, dropBoxes: DropBox[]) => {
        dispatch(actions.registerDropBoxes({ utility, dropBoxes, }))
    },

    deregisterDropBoxes: () => {
        dispatch(actions.registerDropBoxes({utility: "other", dropBoxes: []}))
    },

    onItemDragEnded: () => {
        dispatch(actions.dragItemEnded())
    },

    onRecruitCharacter: () => {
        dispatch(InventoryThunks.fetchMintTest())
    },
}

export default InventoryTransitions
