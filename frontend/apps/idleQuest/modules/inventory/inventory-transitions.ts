import { Character, notEmpty, takenQuestSecondsLeft, takenQuestStatus } from "../../common"
import { NotificationsApi } from "../notifications"
import { QuestBoardApi } from "../quest-board"
import { activityId, InventoryItem, inventoryItemId, InventoryPageName, SelectedQuest } from "./inventory-dsl"
import { inventoryState, inventoryStore } from "./inventory-state"
import InventoryThunks from "./inventory-thunks"

const actions = inventoryState.actions

const dispatch = inventoryStore.dispatch

const InventoryTransitions = {

    trackInventoryState: () => {
        const interval = setInterval(() => {
            const state = inventoryStore.getState()
            const finishedQuests = state.takenQuests.filter(quest => takenQuestSecondsLeft(quest) == -1)
            finishedQuests.forEach(quest => {
                NotificationsApi.notify(`Quest ${quest.availableQuest.name} finished!`, "info")
            })
        }, 1000)
        return interval 
    },

    onRefreshInventory: () => {
        dispatch(InventoryThunks.getInventory())
    },

    onToggleInventory: () => {
        dispatch(actions.toggleInventory())
    },

    selectInventoryPage: (page: InventoryPageName) => 
        dispatch(actions.setInventoryPage(page)),

    openOverworldDropbox: () => {
        dispatch(actions.openActivity({ ctype: "overworld-dropbox" }))
    },

    closeOverworldDropbox: () => {
        const activity = inventoryStore.getState().activitySelection
        if (activity?.ctype == "overworld-dropbox") 
            dispatch(actions.closeActivity())
    },

    closeActivity: () => {
        dispatch(actions.closeActivity())
    },

    onSelectQuest: (quest: SelectedQuest) => {
        dispatch(actions.openActivity(quest))
        dispatch(actions.toggleInventory(true))
        if(quest.ctype == "available-staking-quest") 
            dispatch(actions.setInventoryPage("characters"))
    },

    onSignQuest: () => {
        const state = inventoryStore.getState()
        const quest = state.activitySelection
        const adventurers = state.selectedParty.filter(notEmpty)
        if (quest?.ctype == "available-staking-quest" && adventurers.length > 0) {
            dispatch(InventoryThunks.takeAvailableQuest(quest, adventurers))
            dispatch(actions.setInventoryPage("taken-quests"))
            dispatch(actions.closeActivity())
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

    onRecruitCharacter: () => {
        dispatch(InventoryThunks.fetchMintTest())
    },
}

export default InventoryTransitions
