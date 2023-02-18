import { SelectedQuest, Adventurer, takenQuestSecondsLeft } from "../../dsl"
import { IdleQuestsSnD } from "../../idle-quests-state"
import { InventoryItem } from "./inventory-dsl"
import { toggleInventory, selectQuest, unselectQuest, unPickAdventurerForQuest, pickAdventurerForQuest, selectAdventurer } from "./inventory-state"
import { takeAvailableQuest, claimTakenQuest, fetchMintTest, getAdventurers, getInProgressQuests } from "./inventory-thunks"

export type InventoryTransitions = {
    onRefreshInventory: (firstTime: boolean) => void
    onToggleInventory: () => void
    onSelectQuest: (quest: SelectedQuest) => void
    onCloseSelectedQuestAndInventory: () => void
    onSignQuest: (quest: SelectedQuest, adventurers: Adventurer[]) => void
    onUnselectAdventurer: (adventurer: Adventurer) => void
    onItemClick: (item: InventoryItem) => void
    onRecruitAdventurer: () => void
}

export const inventoryTransitions = ({ state, dispatch }: IdleQuestsSnD): InventoryTransitions => ({
    
    onRefreshInventory: (firstTime: boolean) => {
        dispatch(getAdventurers(firstTime))
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

        item.ctype == "adventurer" && 
        !state.inventory.selection ?
            dispatch(selectAdventurer(item)) :

        item.ctype == "taken-quest" && 
        state.inventory.selection && 
        state.inventory.selection.ctype === "taken-quest" && 
        state.inventory.selection.takenQuestId === item.takenQuestId ? 
            dispatch(unselectQuest()) :

        item.ctype == "taken-quest" ? 
            (() => { 
                dispatch(selectQuest(item))
            })() :

        null
    },

    onRecruitAdventurer: () => {
        dispatch(fetchMintTest())
    },
})
