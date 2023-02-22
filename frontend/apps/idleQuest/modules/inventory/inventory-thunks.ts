import { compose } from "@reduxjs/toolkit"
import { axiosCustomInstance } from "../../../../axios/axiosApi"
import {
    addVisualDataToTakenQuests, Adventurer, AvailableQuest, Outcome, tagAdventurer, tagRealAPS,
    tagTakenQuest, TakenQuest, withTokenRefresh
} from "../../dsl"
import { IdleQuestsThunk } from "../../idle-quests-state"
import {
    addTakenQuest, changeAdventurersInChallenge,
    claimQuestOutcome,
    removeTakenQuest, finishLoadingModule, setInventory, setTakenQuests,
    unselectQuest
} from "../../state"

export const getAdventurers = (firstLoad: boolean): IdleQuestsThunk => async (dispatch) =>
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
        dispatch(setInventory(response.data.map(compose(tagRealAPS, tagAdventurer))))
        if (firstLoad) 
            setTimeout(() => dispatch(finishLoadingModule({ module: 0 })), 1000)
    })

export const takeAvailableQuest = (quest: AvailableQuest, adventurers: Adventurer[]): IdleQuestsThunk  => async (dispatch) =>
    await withTokenRefresh(async () => {
        const adventurer_ids = adventurers.map(adventurer => adventurer.adventurerId)
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: quest.questId, adventurer_ids})
        const takenQuest = tagTakenQuest(addVisualDataToTakenQuests(response.data)) as TakenQuest
        dispatch(addTakenQuest(takenQuest))
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: true }))
        dispatch(unselectQuest())
    })

export const getInProgressQuests = (): IdleQuestsThunk => async (dispatch) =>
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        const takenQuests = response.data.map(compose(addVisualDataToTakenQuests, tagTakenQuest))
        dispatch(setTakenQuests(takenQuests))
    })

export const claimTakenQuest = (takenQuest: TakenQuest, adventurers: Adventurer[]): IdleQuestsThunk => async (dispatch) =>
   await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/claim').post('/quests/api/claim', {taken_quest_id: takenQuest.takenQuestId })
        const outcome = response.data.outcome as Outcome
        dispatch(removeTakenQuest(takenQuest))
        dispatch(claimQuestOutcome({ adventurers, outcome, takenQuest }))
    })

export const fetchMintTest = (): IdleQuestsThunk => async (dispatch) => 
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/mint-test-nft').post('/quests/api/mint-test-nft')
        dispatch(getAdventurers(false))
    })
