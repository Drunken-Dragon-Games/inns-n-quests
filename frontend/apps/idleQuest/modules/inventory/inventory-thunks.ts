import { compose } from "@reduxjs/toolkit"
import { axiosCustomInstance } from "../../../../axios/axiosApi"
import {
    addVisualDataToTakenQuests,
    Adventurer, AvailableQuest, Outcome, tagAdventurer, tagRealAPS,
    tagTakenQuest, TakenQuest, withTokenRefresh
} from "../../common"
import { tagFurniture } from "../../common/furniture"
import {
    addTakenQuest, changeAdventurersInChallenge, claimQuestOutcome, 
    InventoryThunk, removeTakenQuest, setInventory, setTakenQuests, closeActivity, inventoryStore
} from "../../state"
import { NotificationsApi } from "../notifications"
import { activityId } from "./inventory-dsl"

export const getInventory = (): InventoryThunk => async (dispatch) =>
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
        console.log(response.data.length)
        dispatch(setInventory(response.data.map(compose(tagRealAPS, tagAdventurer, tagFurniture))))
    })

export const takeAvailableQuest = (quest: AvailableQuest, adventurers: Adventurer[]): InventoryThunk  => async (dispatch) =>
    await withTokenRefresh(async () => {
        const adventurer_ids = adventurers.map(adventurer => adventurer.adventurerId)
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: quest.questId, adventurer_ids})
        const takenQuest = tagTakenQuest(addVisualDataToTakenQuests(response.data)) as TakenQuest
        NotificationsApi.notify(`Quest taken: ${quest.name}`, "info")
        dispatch(addTakenQuest(takenQuest))
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: true }))
        dispatch(closeActivity())
    })

export const getInProgressQuests = (): InventoryThunk => async (dispatch) =>
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        const takenQuests = response.data.map(compose(addVisualDataToTakenQuests, tagTakenQuest))
        dispatch(setTakenQuests(takenQuests));
    })

export const claimTakenQuest = (takenQuest: TakenQuest, adventurers: Adventurer[]): InventoryThunk => async (dispatch) =>
   await withTokenRefresh(async () => {
        console.log("lol")
        const response = await axiosCustomInstance('/quests/api/claim').post('/quests/api/claim', {taken_quest_id: takenQuest.takenQuestId })
        const outcome = response.data as Outcome
        NotificationsApi.notify(`Quest ${outcome.ctype == "success-outcome" ? "succeeded" : "failed"}: ${takenQuest.quest.name}`, "info")
        dispatch(removeTakenQuest(takenQuest))
        dispatch(claimQuestOutcome({ adventurers, outcome, takenQuest }))
        setTimeout(() => {
            if (activityId(inventoryStore.getState().activitySelection) === takenQuest.takenQuestId)
                dispatch(closeActivity())
        }, 3000)
    })

export const fetchMintTest = (): InventoryThunk => async (dispatch) => 
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/grant-test-inventory').get('/quests/api/grant-test-inventory')
        dispatch(setInventory(response.data.map(compose(tagRealAPS, tagAdventurer, tagFurniture))))
    })
