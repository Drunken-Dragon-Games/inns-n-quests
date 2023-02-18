import { useEffect } from "react"
import { IdleQuestsState } from "./idle-quests-state"
import { IdleQuestsTransitions } from "./idle-quests-transitions"
import { notEmpty } from "./utils"

/**
 * Global key map for the Idle Quests app.
 * 
 * @param key 
 * @param transitions
 * @param state 
 * @param dispatch 
 */
const GlobalKeyMap = (key: string, transitions: IdleQuestsTransitions, state: IdleQuestsState) => { 

    if (key == "b" || key == "B" || key == "i" || key == "I") {
        transitions.inventory.onToggleInventory()

    } else if (key == "m" || key == "M") {
        transitions.world.onToggleWorldView()

    } else if (key == "Escape" && state.inventory.selection) {
        transitions.inventory.onCloseSelectedQuestAndInventory()

    } else if (key == "Escape" && state.inventory.open) {
        transitions.inventory.onToggleInventory()

    } else if (key == "Enter" && state.inventory.selection && state.inventory.selection.ctype !== "adventurer") {
        const quest = state.inventory.selection
        const adventurers = state.inventory.selectedParty.filter(notEmpty)
        transitions.inventory.onSignQuest(quest, adventurers)
    }
}

/**
 * This hook is used to map keyboard keys to actions.
 * Uses the keyMap function to map keys to actions.
 */
export const useIdleQuestsKeyMap = (transitions: IdleQuestsTransitions, state: IdleQuestsState) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => 
            GlobalKeyMap(e.key, transitions, state)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [state])
}
