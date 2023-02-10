import { compose } from "@reduxjs/toolkit"
import { AxiosError } from "axios"
import { axiosCustomInstance } from "../../../../../axios/axiosApi"
import { GeneralReducerThunk } from "../../../../../features/generalReducer"
import { fetchRefreshToken } from "../../../../../features/refresh"
import { simpleHash } from "../../../../utils"
import { createSliceStatus, actionsGenerator } from "../../../../utils/features/utils"
import { sealTypes, tagAvailableQuest, AvailableQuest, Adventurer, tagTakenQuest, TakenQuest, ClaimQuestOutcome } from "../../../dsl"
import { setInventory, addAvailableQuests, addTakenQuest, changeAdventurersInChallenge, unselectQuest, setTakenQuests, removeTakenQuest } from "./quest-board-state"

const addVisualQuestData = (quest: any) => {
    return ({
        ...quest,
        seal: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
        paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
    })
}

const addVisualDataToTakenQuests = (quest: any) =>
    ({ ...quest, quest: addVisualQuestData(quest.quest) })

export const getAdventurers = (): GeneralReducerThunk => async (dispatch) =>{
    dispatch(setFetchGetAdventurersStatusPending())
    try {  
        //fetch para obeter a los aventureros
        const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
        dispatch(setInventory(response.data))  
        dispatch(setFetchGetAdventurersStatusFulfilled())
    } catch (err: unknown) {
        if(err instanceof AxiosError ){
            dispatch(setFetchGetAdventurersStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getAdventurers()), err))
        }
    }
}

export const  fetchGetAdventurersStatus  = createSliceStatus("fetchGetAdventurersStatus")
export const [ setFetchGetAdventurersStatusIdle, setFetchGetAdventurersStatusPending, setFetchGetAdventurersStatusFulfilled, setFetchGetAdventurersStatusErrors ] = actionsGenerator(fetchGetAdventurersStatus.actions)

export const getAvailableQuests = (firstTime? : boolean): GeneralReducerThunk => async (dispatch) =>{
    dispatch(setFetchGetAvailableQuestStatusPending())
    try { 
        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        const availableQuests = response.data
            .map(compose(addVisualQuestData, tagAvailableQuest))
        dispatch(setFetchGetAvailableQuestStatusFulfilled())
        dispatch(addAvailableQuests(availableQuests))
    } catch (err: unknown) {
        if(err instanceof AxiosError ){
            dispatch(setFetchGetAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getAvailableQuests(firstTime)), err))
        }
    }
}

export const  fetchGetAvailableQuestStatus  = createSliceStatus("fetchGetAvailableQuestStatus")
export const [ setFetchGetAvailableQuestStatusIdle, setFetchGetAvailableQuestStatusPending, setFetchGetAvailableQuestStatusFulfilled, setFetchGetAvailableQuestStatusErrors ] = actionsGenerator(fetchGetAvailableQuestStatus.actions)

export const takeAvailableQuest = (quest: AvailableQuest, adventurers: Adventurer[]): GeneralReducerThunk  => async (dispatch) =>{
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
        if(err instanceof AxiosError ){
            dispatch(setFetchTakeAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken(() => dispatch(takeAvailableQuest(quest, adventurers)), err))
        }
    }

}

export const  fetchTakeAvailableQuestStatus  = createSliceStatus("fetchTakeAvailableQuestStatus")
export const [ setFetchTakeAvailableQuestStatusIdle, setFetchTakeAvailableQuestStatusPending, setFetchTakeAvailableQuestStatusFulfilled, setFetchTakeAvailableQuestStatusErrors ] = actionsGenerator(fetchTakeAvailableQuestStatus.actions)

export const getInProgressQuests = (): GeneralReducerThunk => async (dispatch) =>{
    dispatch(setFetchGetInProgressQuestStatusPending())
    try {   
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        const takenQuests = response.data.map(compose(addVisualDataToTakenQuests, tagTakenQuest))
        dispatch(setTakenQuests(takenQuests))
        dispatch(setFetchGetInProgressQuestStatusFulfilled())
    } catch (err: unknown) {
        if(err instanceof AxiosError ){
            dispatch(setFetchGetInProgressQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getInProgressQuests()), err))
        }
    }

}

export const  fetchGetInProgressQuestStatus  = createSliceStatus("fetchGetInProgressQuestStatus")
export const [ setFetchGetInProgressQuestStatusIdle, setFetchGetInProgressQuestStatusPending, setFetchGetInProgressQuestStatusFulfilled, setFetchGetInProgressQuestStatusErrors ] = actionsGenerator(fetchGetInProgressQuestStatus.actions)

export const claimTakenQuest = (quest: TakenQuest, adventurers: Adventurer[]): GeneralReducerThunk => async (dispatch) =>{
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
        if(err instanceof AxiosError ){
            dispatch(setFetchPostClaimRewardInProgressQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(claimTakenQuest(quest, adventurers)), err))
        }
    }
}

export const  fetchPostClaimRewardInProgressQuestStatus  = createSliceStatus("fetchPostClaimRewardInProgressQuestStatus")
export const [ setFetchPostClaimRewardInProgressQuestStatusIdle, setFetchPostClaimRewardInProgressQuestStatusPending, setFetchPostClaimRewardInProgressQuestStatusFulfilled, setFetchPostClaimRewardInProgressQuestStatusErrors ] = actionsGenerator(fetchPostClaimRewardInProgressQuestStatus.actions)
