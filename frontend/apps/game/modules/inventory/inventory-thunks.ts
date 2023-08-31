import { AvailableStakingQuest, Character, TakenStakingQuest } from "../../../common"
import IdleQuestsApi from "../../idle-quests-api"
import { NotificationsApi } from "../notifications"
import { OverworldApi } from "../overworld"
import { activityId } from "./inventory-dsl"
import { inventoryState, inventoryStore, InventoryThunk } from "./inventory-state"
import router from "next/router"

const actions = inventoryState.actions

const InventoryThunks = {

    getInventory: (): InventoryThunk => async (dispatch) => {
        const itemResponse = await IdleQuestsApi.getInventory()
        if (itemResponse.status == "ok") {
            if (Object.keys(itemResponse.inventory.characters).length === 0) router.push("/collection")
            else {
                dispatch(actions.setInventory(itemResponse.inventory))
                OverworldApi.setInitialInnState(itemResponse.inventory)
            }
        }
        else
            NotificationsApi.notify(`Error getting inventory: ${itemResponse.status}`, "alert")

        const stakingQuestsResponse = await IdleQuestsApi.getInProgressStakingQuests()
        if (stakingQuestsResponse.status == "ok") {
            dispatch(actions.setTakenQuests(stakingQuestsResponse.takenQuests))
        } else {
            NotificationsApi.notify(`Error getting in progress quests: ${stakingQuestsResponse.status}`, "alert")
        }
    },

    getInnStateForGuests: (host: string): InventoryThunk => async (dispatch) => {
        const response = await IdleQuestsApi.getInnStateForGuests(host)
        if (response.status == "ok") {
            dispatch(actions.setInventory(response.inventory))
            OverworldApi.setInitialInnState(response.inventory)
        } else if (response.status == "unknown-user") {
            NotificationsApi.notify(`Unknown host: ${host}`, "alert")
        }
    },

    takeAvailableQuest: (quest: AvailableStakingQuest, characters: Character[]): InventoryThunk  => async (dispatch) => {
        const response = await IdleQuestsApi.takeAvailableStakingQuest(quest, characters)
        if (response.status == "ok") {
            NotificationsApi.notify(`Quest taken: ${quest.name}`, "info")
            dispatch(actions.addTakenQuest(response.takenQuest))
            dispatch(actions.changeCharactersInChallenge({ characters, inActivity: true }))
            dispatch(actions.closeActivity())
        } else {
            NotificationsApi.notify(`Error taking quest: ${response.status}`, "alert")
        }
    },

    claimTakenQuest: (takenQuest: TakenStakingQuest, characters: Character[]): InventoryThunk => async (dispatch) => {
        const response = await IdleQuestsApi.claimTakenStakingQuest(takenQuest)
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
