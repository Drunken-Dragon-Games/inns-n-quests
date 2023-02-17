import { useEffect } from "react"
import { Adventurer, SelectedQuest, takenQuestSecondsLeft } from "./dsl"
import { InventoryItem } from "./dsl/inventory"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import {
    clearAvailableQuests, IdleQuestsDispatch, IdleQuestsState, pickAdventurerForQuest, removeAvailableQuest,
    removeTimedOutNotifications, selectAdventurer, selectQuest, toggleInventory, unPickAdventurerForQuest,
    unselectQuest
} from "./idle-quests-state"
import {
    claimTakenQuest, fetchMintTest, getAdventurers, getAvailableQuests, getInProgressQuests,
    takeAvailableQuest
} from "./idle-quests-thunks"
import { useClockSeconds } from "./utils"

export type IdleQuestsStateAndDispatch = {
    state: IdleQuestsState,
    dispatch: IdleQuestsDispatch
}

export default class IdleQuestsTransitions {
    
    static useInitEffects = (snd: IdleQuestsStateAndDispatch) => {
        // Binds keyboard keys to actions
        useIdleQuestsKeyMap(snd)
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

    static onToggleInventory = ({ state, dispatch }: IdleQuestsStateAndDispatch) => () => {
        dispatch(toggleInventory())
    }

    static onSelectQuest = ({ state, dispatch }: IdleQuestsStateAndDispatch) => (quest: SelectedQuest) => {
        dispatch(selectQuest(quest))
        dispatch(toggleInventory())
    }

    static onCloseSelectedQuestAndInventory = ({ state, dispatch }: IdleQuestsStateAndDispatch) => () => {
        dispatch(unselectQuest())
        dispatch(toggleInventory())
    }
    
    static onSignQuest = ({ state, dispatch }: IdleQuestsStateAndDispatch) => (quest: SelectedQuest, adventurers: Adventurer[]) => {
        if (quest.ctype == "available-quest" && adventurers.length > 0) {
            dispatch(takeAvailableQuest(quest, adventurers))
            dispatch(removeAvailableQuest(quest))
            dispatch(toggleInventory())
        } else if (quest.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0) {
            dispatch(claimTakenQuest(quest, adventurers))
        }
    }

    static onFetchMoreQuests = ({ state, dispatch }: IdleQuestsStateAndDispatch) => () => {
        dispatch(clearAvailableQuests())
    }

    static onUnselectAdventurer = ({ state, dispatch }: IdleQuestsStateAndDispatch) => (adventurer: Adventurer) => {
        dispatch(unPickAdventurerForQuest(adventurer))
    }

    static onItemClick = ({ state, dispatch }: IdleQuestsStateAndDispatch) => (item: InventoryItem)=> {
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
    }

    static onRecruitAdventurer = ({ state, dispatch }: IdleQuestsStateAndDispatch) => () => {
        dispatch(fetchMintTest())
    }
}