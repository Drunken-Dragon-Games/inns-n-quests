import {
    Character, AvailableQuest, TakenQuest
} from "../../common"
import IdleQuestsApi from "../../idle-quests-api"
import {
    addTakenQuest, changeCharactersInChallenge, claimQuestOutcome, closeActivity, inventoryStore, InventoryThunk, removeFromInventory, removeTakenQuest, setInventory, setTakenQuests
} from "../../state"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { activityId } from "./inventory-dsl"

export const getInventory = (): InventoryThunk => async (dispatch) => {
    const response = await IdleQuestsApi.getInventory()
    if (response.status == "ok") {
        dispatch(setInventory(response.inventory))
        OverworldApi.setInitialInnState(response.inventory)
    }
    else
        NotificationsApi.notify(`Error getting inventory: ${response.status}`, "alert")
}

export const takeAvailableQuest = (quest: AvailableQuest, characters: Character[]): InventoryThunk  => async (dispatch) => {
    const response = await IdleQuestsApi.takeAvailableQuest(quest, characters)
    if (response.status == "ok") {
        NotificationsApi.notify(`Quest taken: ${quest.name}`, "info")
        dispatch(addTakenQuest(response.takenQuest))
        dispatch(changeCharactersInChallenge({ characters, inActivity: true }))
        dispatch(closeActivity())
    } else {
        NotificationsApi.notify(`Error taking quest: ${response.status}`, "alert")
    }
}

export const getInProgressQuests = (): InventoryThunk => async (dispatch) => {
    const response = await IdleQuestsApi.getInProgressQuests()
    if (response.status == "ok") {
        dispatch(setTakenQuests(response.takenQuests))
    } else {
        NotificationsApi.notify(`Error getting in progress quests: ${response.status}`, "alert")
    }
}

export const claimTakenQuest = (takenQuest: TakenQuest, characters: Character[]): InventoryThunk => async (dispatch) => {
    const response = await IdleQuestsApi.claimTakenQuest(takenQuest)
    if (response.status == "ok") {
        NotificationsApi.notify(`Quest ${response.outcome.ctype == "success-outcome" ? "succeeded" : "failed"}: ${takenQuest.availableQuest.name}`, "info")
        dispatch(removeTakenQuest(takenQuest))
        dispatch(claimQuestOutcome({ characters, outcome: response.outcome, takenQuest }))
        setTimeout(() => {
            if (activityId(inventoryStore.getState().activitySelection) === takenQuest.takenQuestId)
                dispatch(closeActivity())
        }, 3000)
    } else if (response.status == "missing-adventurers") {
        NotificationsApi.notify(`Missing characters on wallet: ${response.missing.length} characters.`, "alert")
        dispatch(changeCharactersInChallenge({ characters, inActivity: false }))
        dispatch(removeFromInventory(response.missing))
        dispatch(removeTakenQuest(takenQuest))
        dispatch(closeActivity())
    } else {
        NotificationsApi.notify(`Error claiming quest: ${response.status}`, "alert")
    }
}

export const fetchMintTest = (): InventoryThunk => async (dispatch) => {
    const response = await IdleQuestsApi.grantTestInventory()
    if (response.status == "ok") 
        dispatch(setInventory(response.inventory))
}
