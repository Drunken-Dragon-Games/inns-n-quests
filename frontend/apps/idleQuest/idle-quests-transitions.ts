import { useEffect } from "react"
import { Adventurer, SelectedQuest, takenQuestSecondsLeft } from "./dsl"
import { InventoryItem } from "./dsl/inventory"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import { IdleQuestsSnD } from "./idle-quests-state"
import {
    claimTakenQuest, fetchMintTest, getAdventurers, getAvailableQuests, getInProgressQuests,
    takeAvailableQuest
} from "./idle-quests-thunks"
import { worldTransitions, WorldTransitions } from "./modules/world"
import {
    clearAvailableQuests, pickAdventurerForQuest, removeAvailableQuest,
    removeTimedOutNotifications, selectAdventurer, selectQuest, toggleInventory,
    unPickAdventurerForQuest, unselectQuest
} from "./state"
import { useClockSeconds } from "./utils"

export const useInitEffects = (transitions: IdleQuestsTransitions, snd: IdleQuestsSnD): void => {
    // Binds keyboard keys to actions
    useIdleQuestsKeyMap(transitions, snd)
    // Ensures there is always at least 5 quests available
    useEffect(() => {
        if (snd.state.questBoard.availableQuests.length < 5) {
            snd.dispatch(getAvailableQuests())
        }
    }, [snd.state.questBoard.availableQuests.length])
    // Initial load of adventurers and quests in progress
    useEffect(() => {
        snd.dispatch(getAdventurers(true))
        snd.dispatch(getInProgressQuests())
    }, [])
    // Continuous clock (seconds)
    useClockSeconds((now) => {
        snd.dispatch(removeTimedOutNotifications(now))
    })
}

export type IdleQuestsTransitions = {
    onToggleInventory: () => void
    onSelectQuest: (quest: SelectedQuest) => void
    onCloseSelectedQuestAndInventory: () => void
    onSignQuest: (quest: SelectedQuest, adventurers: Adventurer[]) => void
    onFetchMoreQuests: () => void
    onUnselectAdventurer: (adventurer: Adventurer) => void
    onItemClick: (item: InventoryItem) => void
    onRecruitAdventurer: () => void

    world: WorldTransitions
}

export const idleQuestsTransitions = ({ state, dispatch }: IdleQuestsSnD): IdleQuestsTransitions => ({
    
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
            dispatch(removeAvailableQuest(quest))
            dispatch(toggleInventory())
        } else if (quest.ctype == "taken-quest" && quest.claimedAt) {
            dispatch(unselectQuest())
        } else if (quest.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0) {
            dispatch(claimTakenQuest(quest, adventurers))
        }
    },

    onFetchMoreQuests: () => {
        dispatch(clearAvailableQuests())
    },

    onUnselectAdventurer: (adventurer: Adventurer) => {
        dispatch(unPickAdventurerForQuest(adventurer))
    },

    onItemClick: (item: InventoryItem)=> {
        item.ctype == "adventurer" && 
        state.questBoard.selectedQuest && 
        state.questBoard.selectedQuest.ctype === "available-quest" ? 
            dispatch(pickAdventurerForQuest(item)) :

        item.ctype == "adventurer" && 
        state.questBoard.selectedQuest && 
        state.questBoard.selectedQuest.ctype === "taken-quest" ? 
            (() => { 
                dispatch(selectAdventurer(item)); 
                dispatch(unselectQuest()) 
            })() :

        item.ctype == "adventurer" && 
        state.questBoard.selectedAdventurer && 
        state.questBoard.selectedAdventurer.adventurerId === item.adventurerId ?
            dispatch(selectAdventurer(undefined)) :

        item.ctype == "adventurer" && 
        !state.questBoard.selectedQuest ?
            dispatch(selectAdventurer(item)) :

        item.ctype == "taken-quest" && 
        state.questBoard.selectedQuest && 
        state.questBoard.selectedQuest.ctype === "taken-quest" && 
        state.questBoard.selectedQuest.takenQuestId === item.takenQuestId ? 
            dispatch(unselectQuest()) :

        item.ctype == "taken-quest" ? 
            (() => { 
                dispatch(selectQuest(item))
                dispatch(selectAdventurer(undefined))
            })() :

        null
    },

    onRecruitAdventurer: () => {
        dispatch(fetchMintTest())
    },

    world: worldTransitions({ state, dispatch })
})
