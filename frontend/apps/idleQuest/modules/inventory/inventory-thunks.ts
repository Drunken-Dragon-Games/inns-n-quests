import { AvailableQuest, Character, TakenQuest } from "../../common"
import IdleQuestsApi from "../../idle-quests-api"
import {
    inventoryState, inventoryStore, InventoryThunk
} from "../../state"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { activityId } from "./inventory-dsl"

const actions = inventoryState.actions

const InventoryThunks = {

    getInventory: (): InventoryThunk => async (dispatch) => {
        const response = await IdleQuestsApi.getInventory()
        if (response.status == "ok") {
            dispatch(actions.setInventory(response.inventory))
            OverworldApi.setInitialInnState(response.inventory)
        }
        else
            NotificationsApi.notify(`Error getting inventory: ${response.status}`, "alert")
    },

    takeAvailableQuest: (quest: AvailableQuest, characters: Character[]): InventoryThunk  => async (dispatch) => {
        const response = await IdleQuestsApi.takeAvailableQuest(quest, characters)
        if (response.status == "ok") {
            NotificationsApi.notify(`Quest taken: ${quest.name}`, "info")
            dispatch(actions.addTakenQuest(response.takenQuest))
            dispatch(actions.changeCharactersInChallenge({ characters, inActivity: true }))
            dispatch(actions.closeActivity())
        } else {
            NotificationsApi.notify(`Error taking quest: ${response.status}`, "alert")
        }
    },

    getInProgressQuests: (): InventoryThunk => async (dispatch) => {
        const response = await IdleQuestsApi.getInProgressQuests()
        if (response.status == "ok") {
            dispatch(actions.setTakenQuests(response.takenQuests))
        } else {
            NotificationsApi.notify(`Error getting in progress quests: ${response.status}`, "alert")
        }
    },

    claimTakenQuest: (takenQuest: TakenQuest, characters: Character[]): InventoryThunk => async (dispatch) => {
        const response = await IdleQuestsApi.claimTakenQuest(takenQuest)
        if (response.status == "ok") {
            NotificationsApi.notify(`Quest ${response.outcome.ctype == "success-outcome" ? "succeeded" : "failed"}: ${takenQuest.availableQuest.name}`, "info")
            dispatch(actions.removeTakenQuest(takenQuest))
            dispatch(actions.claimQuestOutcome({ characters, outcome: response.outcome, takenQuest }))
            setTimeout(() => {
                if (activityId(inventoryStore.getState().activitySelection) === takenQuest.takenQuestId)
                    dispatch(actions.closeActivity())
            }, 3000)
        } else if (response.status == "missing-adventurers") {
            NotificationsApi.notify(`Missing characters on wallet: ${response.missing.length} characters.`, "alert")
            dispatch(actions.changeCharactersInChallenge({ characters, inActivity: false }))
            dispatch(actions.removeFromInventory(response.missing))
            dispatch(actions.removeTakenQuest(takenQuest))
            dispatch(actions.closeActivity())
        } else {
            NotificationsApi.notify(`Error claiming quest: ${response.status}`, "alert")
        }
    },

    fetchMintTest: (): InventoryThunk => async (dispatch) => {
        const response = await IdleQuestsApi.grantTestInventory()
        if (response.status == "ok") 
            dispatch(actions.setInventory(response.inventory))
    }
}

export default InventoryThunks
