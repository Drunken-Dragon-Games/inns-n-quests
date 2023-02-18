import { useEffect } from "react"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import { IdleQuestsSnD, IdleQuestsState } from "./idle-quests-state"
import { inventoryTransitions, InventoryTransitions } from "./modules/inventory"
import { NotificationsTransitions, notificationsTransitions } from "./modules/notifications"
import { questBoardTransitions, QuestBoardTransitions } from "./modules/quest-board"
import { worldTransitions, WorldTransitions } from "./modules/world"
import { useClockSeconds } from "./utils"

export const useInitEffects = (transitions: IdleQuestsTransitions, state: IdleQuestsState): void => {
    // Binds keyboard keys to actions
    useIdleQuestsKeyMap(transitions, state)
    // Ensures there is always at least 5 quests available
    useEffect(() => {
        if (state.questBoard.availableQuests.length < 5) {
            transitions.questBoard.onFetchAvailableQuests()
        }
    }, [state.questBoard.availableQuests.length])
    // Initial load of adventurers and quests in progress
    useEffect(() => {
        transitions.inventory.onRefreshInventory(true)
    }, [])
    // Continuous clock (seconds)
    useClockSeconds((now) => {
        transitions.notifications.onRemoveTimedOutNotifications(now)
    })
}

export type IdleQuestsTransitions = {
    world: WorldTransitions
    notifications: NotificationsTransitions
    questBoard: QuestBoardTransitions
    inventory: InventoryTransitions
}

export const idleQuestsTransitions = ({ state, dispatch }: IdleQuestsSnD): IdleQuestsTransitions => ({
    world: worldTransitions({ state, dispatch }),
    notifications: notificationsTransitions({ state, dispatch }),
    questBoard: questBoardTransitions({ state, dispatch }),
    inventory: inventoryTransitions({ state, dispatch }),
})
