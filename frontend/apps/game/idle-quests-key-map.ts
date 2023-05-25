import { useEffect } from "react"
import InventoryApi from "./modules/inventory/inventory-api"
import { QuestBoardApi } from "./modules/quest-board"

/**
 * Global key map for the Idle Quests app.
 * 
 * @param key 
 * @param transitions
 * @param state 
 * @param dispatch 
 */
const GlobalKeyMap = (key: string) => { 
    const activeActivity = InventoryApi.activeActivity()

    if (key == "b" || key == "B") {
        InventoryApi.toggleInventory()

    } else if (key == "q" || key == "Q") {
        QuestBoardApi.toggleQuestBoard()

    } else if (key == "Escape" && activeActivity) {
        InventoryApi.toggleInventory()
        InventoryApi.closeActivity()

    } else if (key == "Escape" && InventoryApi.isOpen()) {
        InventoryApi.toggleInventory()

    } else if (key == "Escape" && QuestBoardApi.isOpen()) {
        QuestBoardApi.toggleQuestBoard()

    } else if (key == "Enter" && (activeActivity === "available-staking-quest" || activeActivity === "taken-staking-quest")) {
        InventoryApi.signQuest()
    }
}

/**
 * This hook is used to map keyboard keys to actions.
 * Uses the keyMap function to map keys to actions.
 */
export const useIdleQuestsKeyMap = () => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => 
            GlobalKeyMap(e.key)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])
}
