import { compose } from "@reduxjs/toolkit"
import { AxiosError } from "axios"
import { axiosCustomInstance } from "../../axios/axiosApi"
import { simpleHash } from "../utils"
import { actionsGenerator, createSliceStatus } from "../utils/features/utils"
import { Adventurer, AvailableQuest, ClaimQuestOutcome, sealTypes, tagAvailableQuest, 
         tagTakenQuest, TakenQuest } from "./dsl"
import { addAvailableQuests, addTakenQuest, changeAdventurersInChallenge, 
         IdleQuestsThunk, removeTakenQuest, setInventory, setTakenQuests, 
         unselectQuest } from "./idle-quests-state"

const addVisualQuestData = (quest: any) => {
    return ({
        ...quest,
        seal: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
        paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
    })
}

const addVisualDataToTakenQuests = (quest: any) =>
    ({ ...quest, quest: addVisualQuestData(quest.quest) })

export const getAdventurers = (): IdleQuestsThunk => async (dispatch) =>{
    dispatch(setFetchGetAdventurersStatusPending())
    try {  
        const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
        dispatch(setInventory(response.data))  
        dispatch(setFetchGetAdventurersStatusFulfilled())
    } catch (err: unknown) {
        const success = await refreshToken(err)
        if (success) dispatch(getAdventurers())
    }
}

export const  fetchGetAdventurersStatus  = createSliceStatus("fetchGetAdventurersStatus")
export const [ setFetchGetAdventurersStatusIdle, setFetchGetAdventurersStatusPending, setFetchGetAdventurersStatusFulfilled, setFetchGetAdventurersStatusErrors ] = actionsGenerator(fetchGetAdventurersStatus.actions)

export const getAvailableQuests = (firstTime? : boolean): IdleQuestsThunk => async (dispatch) =>{
    dispatch(setFetchGetAvailableQuestStatusPending())
    try { 
        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        const availableQuests = response.data
            .map(compose(addVisualQuestData, tagAvailableQuest))
        dispatch(setFetchGetAvailableQuestStatusFulfilled())
        dispatch(addAvailableQuests(availableQuests))
    } catch (err: unknown) {
        const success = await refreshToken(err)
        if (success) dispatch(getAvailableQuests(firstTime))
    }
}

export const  fetchGetAvailableQuestStatus  = createSliceStatus("fetchGetAvailableQuestStatus")
export const [ setFetchGetAvailableQuestStatusIdle, setFetchGetAvailableQuestStatusPending, setFetchGetAvailableQuestStatusFulfilled, setFetchGetAvailableQuestStatusErrors ] = actionsGenerator(fetchGetAvailableQuestStatus.actions)

export const takeAvailableQuest = (quest: AvailableQuest, adventurers: Adventurer[]): IdleQuestsThunk  => async (dispatch) =>{
    dispatch(setFetchTakeAvailableQuestStatusPending())  
    try {  
        const adventurer_ids = adventurers.map(adventurer => adventurer.adventurerId)
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: quest.questId, adventurer_ids})
        const takenQuest = tagTakenQuest(addVisualDataToTakenQuests(response.data)) as TakenQuest
        dispatch(addTakenQuest(takenQuest))
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: true }))
        dispatch(unselectQuest())
        dispatch(setFetchTakeAvailableQuestStatusFulfilled())
    } catch (err: unknown) {
        const success = await refreshToken(err)
        if (success) dispatch(takeAvailableQuest(quest, adventurers))
    }

}

export const  fetchTakeAvailableQuestStatus  = createSliceStatus("fetchTakeAvailableQuestStatus")
export const [ setFetchTakeAvailableQuestStatusIdle, setFetchTakeAvailableQuestStatusPending, setFetchTakeAvailableQuestStatusFulfilled, setFetchTakeAvailableQuestStatusErrors ] = actionsGenerator(fetchTakeAvailableQuestStatus.actions)

export const getInProgressQuests = (): IdleQuestsThunk => async (dispatch) =>{
    dispatch(setFetchGetInProgressQuestStatusPending())
    try {   
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        const takenQuests = response.data.map(compose(addVisualDataToTakenQuests, tagTakenQuest))
        dispatch(setTakenQuests(takenQuests))
        dispatch(setFetchGetInProgressQuestStatusFulfilled())
    } catch (err: unknown) {
        const success = await refreshToken(err)
        if (success) dispatch(getInProgressQuests())
    }

}

export const  fetchGetInProgressQuestStatus  = createSliceStatus("fetchGetInProgressQuestStatus")
export const [ setFetchGetInProgressQuestStatusIdle, setFetchGetInProgressQuestStatusPending, setFetchGetInProgressQuestStatusFulfilled, setFetchGetInProgressQuestStatusErrors ] = actionsGenerator(fetchGetInProgressQuestStatus.actions)

export const claimTakenQuest = (quest: TakenQuest, adventurers: Adventurer[]): IdleQuestsThunk => async (dispatch) =>{
    dispatch(setFetchPostClaimRewardInProgressQuestStatusPending())
    try {
        const response = await axiosCustomInstance('/quests/api/claim').post('/quests/api/claim', {taken_quest_id: quest.takenQuestId })
        const outcome = response.data.outcome as ClaimQuestOutcome
        console.log(outcome)
        dispatch(setFetchPostClaimRewardInProgressQuestStatusFulfilled())
        dispatch(removeTakenQuest(quest))
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: false }))
        dispatch(unselectQuest())
    } catch (err: unknown) {
        const success = await refreshToken(err)
        if (success) dispatch(claimTakenQuest(quest, adventurers))
    }
}

export const  fetchPostClaimRewardInProgressQuestStatus  = createSliceStatus("fetchPostClaimRewardInProgressQuestStatus")
export const [ setFetchPostClaimRewardInProgressQuestStatusIdle, setFetchPostClaimRewardInProgressQuestStatusPending, setFetchPostClaimRewardInProgressQuestStatusFulfilled, setFetchPostClaimRewardInProgressQuestStatusErrors ] = actionsGenerator(fetchPostClaimRewardInProgressQuestStatus.actions)

async function refreshToken(error: unknown): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh");
    if(error instanceof AxiosError && error.response?.status == 401 && refreshToken){
        try {
            const response = await axiosCustomInstance('/api/refreshSession/').post('/api/refreshSession/', { "fullRefreshToken": refreshToken })
            localStorage.setItem("refresh", response.data.refreshToken)
            return true
        }
        catch (err) { return false }
    } else 
        return false
}

export const fetchMintTest = (): IdleQuestsThunk => async (dispatch) =>{
    dispatch(setFetchAddressPostStatusPending())
    try {  
        const response = await axiosCustomInstance('/quests/api/mint-test-nft').post('/quests/api/mint-test-nft')
        dispatch(getAdventurers())
        dispatch(setFetchAddressPostStatusFulfilled())
      } catch (err: unknown) {
        const success = await refreshToken(err)
        if (success) dispatch(fetchMintTest())
      }
}

export const fetchAddressPostStatus = createSliceStatus("fetchAddressPostStatus")
export const [setFetchAddressPostStatusIdle, setFetchAddressPostStatusPending, setFetchAddressPostStatusFulfilled, setFetchAddressPostStatusErrors] = actionsGenerator(fetchAddressPostStatus.actions)
