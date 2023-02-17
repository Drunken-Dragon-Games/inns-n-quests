import { useEffect } from "react"
import { notEmpty } from "../utils"
import IdleQuestsTransitions, { IdleQuestsStateAndDispatch } from "./idle-quests-transitions"

/**
 * Global key map for the Idle Quests app.
 * 
 * @param key 
 * @param state 
 * @param dispatch 
 */
const GlobalKeyMap = (key: string, snd: IdleQuestsStateAndDispatch) => { 
    const q = snd.state.questBoard

    if (key == "b" || key == "B" || key == "i" || key == "I") {
        IdleQuestsTransitions.onToggleInventory(snd)()

    } else if (key == "Escape" && q.selectedQuest) {
        IdleQuestsTransitions.onCloseSelectedQuestAndInventory(snd)()

    } else if (key == "Escape" && q.inventoryOpen) {
        IdleQuestsTransitions.onToggleInventory(snd)()

    } else if (key == "Enter" && q.selectedQuest) {
        const quest = q.selectedQuest
        const adventurers = q.adventurerSlots.filter(notEmpty)
        IdleQuestsTransitions.onSignQuest(snd)(quest, adventurers)
    }
}

/**
 * This hook is used to map keyboard keys to actions.
 * Uses the keyMap function to map keys to actions.
 */
export const useIdleQuestsKeyMap = (snd: IdleQuestsStateAndDispatch) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => 
            GlobalKeyMap(e.key, snd)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [snd.state])
}
