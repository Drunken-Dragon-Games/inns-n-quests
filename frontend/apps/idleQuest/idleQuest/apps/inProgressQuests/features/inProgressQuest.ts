import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { generalReducerThunk } from '../../../../../../features/generalReducer';
import { setFreeAdventurers, setExperienceReward, setDeath } from '../../console/features/adventurers';
import { AxiosError } from 'axios';
import { setAddDragonSilverToClaim } from '../../console/features/player';
import { fetchRefreshToken } from '../../../../../../features/refresh';
import { inProgressQuestType, EnrollsType } from '../../../../../../types/idleQuest';

//fetch para obeter a los in progress quests

export const getInProgressQuest = (): generalReducerThunk => async (dispatch) =>{

    dispatch(setFetchGetInProgressQuestStatusPending())
    try {   
            //fetch para obtener los inprogress quest
        const response = await axiosCustomInstance('/quests/api/taken-quests').get('/quests/api/taken-quests')  
        
        //funcion para setear los ques in progress
        dispatch(setInProgressQuest(response.data))

        
        dispatch(setFetchGetInProgressQuestStatusFulfilled())

    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchGetInProgressQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getInProgressQuest()), err))
        }
    }

}


//reducer para monitorear el estado del request para los in progress quest

const  fetchGetInProgressQuestStatus  = createSliceStatus("fetchGetInProgressQuestStatus")

const [ setFetchGetInProgressQuestStatusIdle, setFetchGetInProgressQuestStatusPending, setFetchGetInProgressQuestStatusFulfilled, setFetchGetInProgressQuestStatusErrors ] = actionsGenerator(fetchGetInProgressQuestStatus.actions)



//fetch para claimear el reward

interface IdsType{
    id: string
}

const getAdventurers = (enrolls : EnrollsType []): IdsType [] =>{

    const adventurers = enrolls.map(el => {
        return el.adventurer
    })

    return adventurers

}

export const PostClaimInProgressQuest = (quest: inProgressQuestType): generalReducerThunk => async (dispatch) =>{
    
    dispatch(setFetchPostClaimRewardInProgressQuestStatusPending())
    try {
            
        //fetch para claimear los inprogress quest 
        const response = await axiosCustomInstance('/quests/api/claim').post('/quests/api/claim', {taken_quest_id: quest.id, stake_address: quest.player_stake_address })
            
        dispatch(setFetchPostClaimRewardInProgressQuestStatusFulfilled())
        //condicional depenende de si el quest es exitoso o fallido 
        if(quest.state == "succeeded"){
            //se activa esta funcion para realizar las animaciones correspondientes

            dispatch(setRewardClaimSucceed(response.data.adventurers))

            //estas funciones actualizan los datos del estado

            dispatch(setFreeAdventurers(response.data.adventurers))

            dispatch(setAddDragonSilverToClaim(quest.quest.reward_ds))
            dispatch(setExperienceReward(response.data.adventurers))



        } else if(quest.state == "failed"){
            
            //se activa esta funcion para realizar las animaciones correspondientes
            dispatch(setRewardClaimFail(response.data.dead_adventurers))
            
            //estas funciones actualizan los datos del estado
            dispatch( setDeath(response.data.dead_adventurers) )

            const adventurers  = getAdventurers(quest.enrolls)
           
            dispatch(setFreeAdventurers(adventurers))   
        }
       
    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchPostClaimRewardInProgressQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(PostClaimInProgressQuest(quest)), err))
        }
    }

}

//reducer para monitorear el estado del fetchGetInProgressQuest


const  fetchPostClaimRewardInProgressQuestStatus  = createSliceStatus("fetchPostClaimRewardInProgressQuestStatus")

export const [ setFetchPostClaimRewardInProgressQuestStatusIdle, setFetchPostClaimRewardInProgressQuestStatusPending, setFetchPostClaimRewardInProgressQuestStatusFulfilled, setFetchPostClaimRewardInProgressQuestStatusErrors ] = actionsGenerator(fetchPostClaimRewardInProgressQuestStatus.actions)


interface InitialStateNavigationConsoleType{
    quests: inProgressQuestType []
}

const initialInProgressQuest: InitialStateNavigationConsoleType = {quests : []}

const inProgressQuests = createSlice({
    name: "inProgressQuests",
    initialState: initialInProgressQuest,
    reducers: {
        setInProgressQuest:  (state, action: PayloadAction<inProgressQuestType []>)=> {
            
            state.quests = action.payload
            
        },

        setDeleteInProgressQuest:  (state, action: PayloadAction<string>)=> {
            
            const filterState = state.quests.filter((quest) => quest.id !== action.payload)

            state.quests = filterState
        },

        setAddInProgressQuest:  (state, action: PayloadAction<inProgressQuestType>)=> {
            
            state.quests = state.quests.concat(action.payload)
        }

    },
});

export const { setInProgressQuest, setDeleteInProgressQuest,  setAddInProgressQuest } = inProgressQuests.actions


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
        inProgressQuest: inProgressQuests.reducer,
        claimReward: inProgressReward.reducer
    }),
    Status: combineReducers({
        inProgress: fetchGetInProgressQuestStatus.reducer,
        claimReward: fetchPostClaimRewardInProgressQuestStatus.reducer
    })

})