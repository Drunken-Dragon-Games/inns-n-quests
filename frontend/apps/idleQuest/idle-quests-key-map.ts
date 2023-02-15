import { useEffect } from "react"
import { notEmpty } from "../utils"
import { takenQuestSecondsLeft } from "./dsl"
import { IdleQuestsDispatch, IdleQuestsState, idleQuestsStore, unselectQuest } from "./idle-quests-state"
import { claimTakenQuest, takeAvailableQuest } from "./idle-quests-transitions"

/**
 * Global key map for the Idle Quests app.
 * 
 * @param key 
 * @param state 
 * @param dispatch 
 */
const GlobalKeyMap = (key: string, state: IdleQuestsState, dispatch: IdleQuestsDispatch) => { 

    if (key == "Escape" && state.questBoard.selectedQuest) {
        dispatch(unselectQuest())

    } else if (key == "Enter" && state.questBoard.selectedQuest) {
        const quest = state.questBoard.selectedQuest
        const adventurers = state.questBoard.adventurerSlots.filter(notEmpty)
        if (quest.ctype === "available-quest" && adventurers.length > 0) {
            dispatch(takeAvailableQuest(quest, adventurers))
        } else if (quest.ctype === "taken-quest" && takenQuestSecondsLeft(quest) <= 0) {
            dispatch(claimTakenQuest(quest, adventurers))
        }
    }
}

/**
 * This hook is used to map keyboard keys to actions.
 * Uses the keyMap function to map keys to actions.
 */
export const useIdleQuestsKeyMap = (state: IdleQuestsState) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => 
            GlobalKeyMap(e.key, state, idleQuestsStore.dispatch)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [state])
}
