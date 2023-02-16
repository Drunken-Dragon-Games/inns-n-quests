import { compose } from "@reduxjs/toolkit"
import { AxiosError } from "axios"
import { axiosCustomInstance } from "../../axios/axiosApi"
import { simpleHash } from "../utils"
import {
    Adventurer, AvailableQuest, ClaimQuestOutcome, sealTypes, tagAdventurer, tagAvailableQuest,
    tagTakenQuest, TakenQuest
} from "./dsl"
import {
    addAvailableQuests, addTakenQuest, changeAdventurersInChallenge,
    idleQuestsStore,
    IdleQuestsThunk, notify, removeTakenQuest, setInitLoading, setInventory, setTakenQuests,
    unselectQuest
} from "./idle-quests-state"

const addVisualQuestData = (quest: any) => {
    return ({
        ...quest,
        seal: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
        paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
    })
}

const addVisualDataToTakenQuests = (quest: any) =>
    ({ ...quest, quest: addVisualQuestData(quest.quest) })

export const getAdventurers = (firstLoad: boolean): IdleQuestsThunk => async (dispatch) =>
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
        dispatch(setInventory(response.data.map(tagAdventurer)))
        if (firstLoad) 
            setTimeout(() => dispatch(setInitLoading(false)), 1000)
    }, 
    () => dispatch(getAdventurers(firstLoad)))

export const getAvailableQuests = (firstTime? : boolean): IdleQuestsThunk => async (dispatch) => 
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        const availableQuests = response.data
            .map(compose(addVisualQuestData, tagAvailableQuest))
        dispatch(addAvailableQuests(availableQuests))
    }, 
    () => dispatch(getAvailableQuests(firstTime)))

export const takeAvailableQuest = (quest: AvailableQuest, adventurers: Adventurer[]): IdleQuestsThunk  => async (dispatch) =>
    await withTokenRefresh(async () => {
        const adventurer_ids = adventurers.map(adventurer => adventurer.adventurerId)
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: quest.questId, adventurer_ids})
        const takenQuest = tagTakenQuest(addVisualDataToTakenQuests(response.data)) as TakenQuest
        dispatch(addTakenQuest(takenQuest))
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: true }))
        dispatch(unselectQuest())
        dispatch(notify({ message: "Quest accepted", ctype: "info" }))
    }, 
    () => dispatch(takeAvailableQuest(quest, adventurers)))

export const getInProgressQuests = (): IdleQuestsThunk => async (dispatch) =>
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        const takenQuests = response.data.map(compose(addVisualDataToTakenQuests, tagTakenQuest))
        dispatch(setTakenQuests(takenQuests))
    }, 
    () => dispatch(getInProgressQuests()))


export const claimTakenQuest = (quest: TakenQuest, adventurers: Adventurer[]): IdleQuestsThunk => async (dispatch) =>
   await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/claim').post('/quests/api/claim', {taken_quest_id: quest.takenQuestId })
        const outcome = response.data.outcome as ClaimQuestOutcome
        console.log(outcome)
        dispatch(removeTakenQuest(quest))
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: false }))
        dispatch(unselectQuest())
        dispatch(notify({ message: "Quest finished", ctype: "info" }))
    }, 
    () => dispatch(claimTakenQuest(quest, adventurers)))

export const fetchMintTest = (): IdleQuestsThunk => async (dispatch) => 
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/mint-test-nft').post('/quests/api/mint-test-nft')
        dispatch(getAdventurers(false))
        dispatch(notify({ message: "Adventurer recruited", ctype: "info" }))
    }, 
    () => dispatch(fetchMintTest()))

const withTokenRefresh = async (fn: () => Promise<void>, continuation: () => void): Promise<void> => {
    try { await fn() }
    catch (err) { 
        if (await refreshToken(err)) continuation()
        if (err instanceof Error)
            idleQuestsStore.dispatch(notify({ message: err.message, ctype: "alert" }))
        throw err 
    }
}

async function refreshToken(error: any): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh");
    if(error instanceof AxiosError && error.response?.status == 401 && refreshToken){
        try {
            const response = await axiosCustomInstance('/api/refreshSession/').post('/api/refreshSession/', { "fullRefreshToken": refreshToken })
            localStorage.setItem("refresh", response.data.refreshToken)
            return true
        }
        catch (err) { 
            if (err instanceof AxiosError)
                idleQuestsStore.dispatch(notify({ message: err.message, ctype: "alert" }))
            return false 
        }
    } else 
        return false
}
