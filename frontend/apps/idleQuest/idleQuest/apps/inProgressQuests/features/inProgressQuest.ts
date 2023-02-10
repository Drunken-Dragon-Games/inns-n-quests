import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers, compose } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { GeneralReducerThunk } from '../../../../../../features/generalReducer';
import { AxiosError } from 'axios';
import { fetchRefreshToken } from '../../../../../../features/refresh';
import { Adventurer, ClaimQuestOutcome, TakenQuest } from '../../../../dsl/models';
import { addTakenQuests, addVisualQuestData, changeAdventurersInChallenge } from '../../availableQuest/features/quest-board';
import { tagTakenQuest } from '../../../../dsl';

const addVisualDataToTakenQuests = (quest: any) =>
    ({ ...quest, quest: addVisualQuestData(quest.quest) })

export const getInProgressQuests = (): GeneralReducerThunk => async (dispatch) =>{
    dispatch(setFetchGetInProgressQuestStatusPending())
    try {   
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        const takenQuests = response.data.map(compose(addVisualDataToTakenQuests, tagTakenQuest))
        dispatch(addTakenQuests(takenQuests))

        
        dispatch(setFetchGetInProgressQuestStatusFulfilled())

    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchGetInProgressQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getInProgressQuests()), err))
        }
    }

}


//reducer para monitorear el estado del request para los in progress quest

const  fetchGetInProgressQuestStatus  = createSliceStatus("fetchGetInProgressQuestStatus")

const [ setFetchGetInProgressQuestStatusIdle, setFetchGetInProgressQuestStatusPending, setFetchGetInProgressQuestStatusFulfilled, setFetchGetInProgressQuestStatusErrors ] = actionsGenerator(fetchGetInProgressQuestStatus.actions)



//fetch para claimear el reward
export const claimTakenQuest = (quest: TakenQuest, adventurers: Adventurer[]): GeneralReducerThunk => async (dispatch) =>{
    
    dispatch(setFetchPostClaimRewardInProgressQuestStatusPending())
    try {
            
        //fetch para claimear los inprogress quest 
        const response = await axiosCustomInstance('/quests/api/claim').post('/quests/api/claim', {taken_quest_id: quest.takenQuestId })
        const outcome = response.data.outcome as ClaimQuestOutcome
            
        dispatch(setFetchPostClaimRewardInProgressQuestStatusFulfilled())

        console.log(outcome)
        //condicional depenende de si el quest es exitoso o fallido 
        if (outcome.status == "success") {
        //if(quest.state == "succeeded"){
            //se activa esta funcion para realizar las animaciones correspondientes

            dispatch(setRewardClaimSucceed([]))//response.data.adventurers))

            //estas funciones actualizan los datos del estado

            dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: false }))

            //dispatch(setAddDragonSilverToClaim(quest.quest.reward_ds))
            //dispatch(setExperienceReward(response.data.adventurers))



        } else if(outcome.status == "failure"){
            
            //se activa esta funcion para realizar las animaciones correspondientes
            dispatch(setRewardClaimFail(outcome.deadAdventurers.map(el => el.adventurerId)))
            
            //estas funciones actualizan los datos del estado
            //dispatch( setDeath(outcome.deadAdventurers) )

            //dispatch(setFreeAdventurers(quest.adventurerIds))   
        }
       
    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchPostClaimRewardInProgressQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(claimTakenQuest(quest, adventurers)), err))
        }
    }

}

//reducer para monitorear el estado del fetchGetInProgressQuest


const  fetchPostClaimRewardInProgressQuestStatus  = createSliceStatus("fetchPostClaimRewardInProgressQuestStatus")

export const [ setFetchPostClaimRewardInProgressQuestStatusIdle, setFetchPostClaimRewardInProgressQuestStatusPending, setFetchPostClaimRewardInProgressQuestStatusFulfilled, setFetchPostClaimRewardInProgressQuestStatusErrors ] = actionsGenerator(fetchPostClaimRewardInProgressQuestStatus.actions)


interface IsClaimRewardDataType {
    isClaimed: boolean
    dead_adventurers: string [] | null 
    exp_given: ExpGivenType [] | null
    state: "failed" | "succeeded" | null
}

interface ExpGivenType {
    experience: number
    id: string
}

const initialClaimReward: IsClaimRewardDataType = { isClaimed :false, dead_adventurers: null, exp_given: null, state: null }


const inProgressReward = createSlice({
    name: "inProgressReward",
    initialState: initialClaimReward,
    reducers: {
      
        setRewardClaimDefault:  (state)=> {
            
            state.isClaimed = false
            state.dead_adventurers = null
            state.exp_given= null
            state.state = null

        },

        setRewardClaimFail:  (state, action: PayloadAction<string []>)=> {

            state.isClaimed = true
            state.dead_adventurers =  action.payload
            state.exp_given= null
            state.state = "failed"

        },

        setRewardClaimSucceed:  (state, action: PayloadAction<ExpGivenType []>)=> {

            console.log("SUCCEEEEEEEED")
            state.isClaimed = true
            state.dead_adventurers =  null
            state.exp_given= action.payload
            state.state = "succeeded"
        
        }
    },
});

export const { setRewardClaimDefault, setRewardClaimFail, setRewardClaimSucceed } = inProgressReward.actions



export const inProgressGeneralReducer = combineReducers({
    data: combineReducers({
        claimReward: inProgressReward.reducer
    }),
    Status: combineReducers({
        inProgress: fetchGetInProgressQuestStatus.reducer,
        claimReward: fetchPostClaimRewardInProgressQuestStatus.reducer
    })

})