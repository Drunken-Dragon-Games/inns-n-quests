import { useEffect } from "react"
import { IdleQuestsSnD } from "./idle-quests-state"
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
const GlobalKeyMap = (key: string, transitions: IdleQuestsTransitions, snd: IdleQuestsSnD) => { 
    const q = snd.state.questBoard

    if (key == "b" || key == "B" || key == "i" || key == "I") {
        transitions.onToggleInventory()

    } else if (key == "m" || key == "M") {
        transitions.world.onToggleWorldView()

    } else if (key == "Escape" && q.selectedQuest) {
        transitions.onCloseSelectedQuestAndInventory()

    } else if (key == "Escape" && q.inventoryOpen) {
        transitions.onToggleInventory()

    } else if (key == "Enter" && q.selectedQuest) {
        const quest = q.selectedQuest
        const adventurers = q.adventurerSlots.filter(notEmpty)
        transitions.onSignQuest(quest, adventurers)
    }
}

/**
 * This hook is used to map keyboard keys to actions.
 * Uses the keyMap function to map keys to actions.
 */
export const useIdleQuestsKeyMap = (transitions: IdleQuestsTransitions, snd: IdleQuestsSnD) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => 
            GlobalKeyMap(e.key, transitions, snd)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [snd.state])
}
