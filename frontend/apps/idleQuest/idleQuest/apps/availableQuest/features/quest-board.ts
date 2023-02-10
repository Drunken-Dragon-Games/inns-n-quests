import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { GeneralReducerThunk } from '../../../../../../features/generalReducer';
import { AxiosError } from "axios"
import { setAdventuresInQuest } from '../../console/features/adventurers';
import { setAddInProgressQuest } from '../../inProgressQuests/features/inProgressQuest';
import { fetchRefreshToken } from '../../../../../../features/refresh';
import { Adventurer, AvailableQuest, sealTypes } from '../../../../dsl';
import { simpleHash } from '../../../../../utils';

export const getAvailableQuests = (firstTime? : boolean): GeneralReducerThunk => async (dispatch) =>{
    const addVisualQuestData = (quest: any) => {
        return ({...quest, 
            stamp: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
            paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
        })
    }
    dispatch(setFetchGetAvailableQuestStatusPending())
    try { 
        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        const availableQuests = response.data.map(addVisualQuestData)
        console.log(availableQuests)
        dispatch(setFetchGetAvailableQuestStatusFulfilled())
        dispatch(addAvailableQuests(availableQuests))
    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchGetAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getAvailableQuests(firstTime)), err))
        }
    }
}

//reducer para monitorear el estado del request para los available quest 

const  fetchGetAvailableQuestStatus  = createSliceStatus("fetchGetAvailableQuestStatus")
const [ setFetchGetAvailableQuestStatusIdle, setFetchGetAvailableQuestStatusPending, setFetchGetAvailableQuestStatusFulfilled, setFetchGetAvailableQuestStatusErrors ] = actionsGenerator(fetchGetAvailableQuestStatus.actions)


//fetch para tomar a los available quests

export const takeAvailableQuest = (questId: string, adventurers: Adventurer[]): GeneralReducerThunk  => async (dispatch) =>{

    dispatch(setFetchTakeAvailableQuestStatusPending())  

    try {  

        const adventurer_ids = adventurers.map(adventurer => adventurer.adventurerId)
        //fetch para aceptar el quest
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: questId, adventurer_ids})

        // se agrega a los ques in progress
        dispatch(setAddInProgressQuest(response.data))
            
        //se agrega a los aventureros en el quest la propiedad de in_quest
        dispatch(setAdventuresInQuest(adventurer_ids))

        //deseleciona al available quest
        dispatch(unselectAvailableQuest())

        // dispatch(setQuestTakenId(questUiidFront))
            
        dispatch(setFetchTakeAvailableQuestStatusFulfilled())

        dispatch(setTakenId(questId))
                    
    } catch (err: unknown) {

        if(err instanceof AxiosError ){
            dispatch(setFetchTakeAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken(() => dispatch(takeAvailableQuest(questId, adventurers)), err))
        }
    }

}

//reducer para monitorear el estado del request para los available quest 

const  fetchTakeAvailableQuestStatus  = createSliceStatus("fetchTakeAvailableQuestStatus")

const [ setFetchTakeAvailableQuestStatusIdle, setFetchTakeAvailableQuestStatusPending, setFetchTakeAvailableQuestStatusFulfilled, setFetchTakeAvailableQuestStatusErrors ] = actionsGenerator(fetchTakeAvailableQuestStatus.actions)




interface QuestBoardState {
    availableQuests: AvailableQuest[]
    selectedAvailableQuest?: AvailableQuest
    adventurerSlots: (Adventurer | null)[]
}

const questBoardInitialState: QuestBoardState = { 
    availableQuests: [],
    adventurerSlots: []
}

const questBoardState = createSlice({
    name: "quest-board-state",
    initialState: questBoardInitialState,
    reducers: {

        addAvailableQuests: (state, action: PayloadAction<AvailableQuest[]>) => {
            state.availableQuests = [...state.availableQuests, ...action.payload]
        },

        removeAvailableQuest: (state, action: PayloadAction<AvailableQuest>) => {
            state.availableQuests = state.availableQuests.filter(quest => quest.questId !== action.payload.questId)
        },

        clearAvailableQuests: (state) => {
            state.availableQuests = []
        },

        selectAvailableQuest: (state, action: PayloadAction<AvailableQuest>) => {
            state.selectedAvailableQuest = action.payload
            state.adventurerSlots = Array(action.payload.slots).fill(null)
        },

        unselectAvailableQuest: (state) => {
            state.selectedAvailableQuest = undefined
            state.adventurerSlots = []
        },

        selectAdventurer: (state, action: PayloadAction<Adventurer>) => {
            const indexNull = state.adventurerSlots.indexOf(null)
            if (indexNull === -1) 
                state.adventurerSlots[0] = action.payload
            else 
                state.adventurerSlots[indexNull] = action.payload
        },

        unselectAdventurer: (state, action: PayloadAction<Adventurer>) => {
            state.adventurerSlots = state.adventurerSlots.map(adventurer => 
                adventurer?.adventurerId === action.payload.adventurerId ? null : adventurer)
        },

        clearSelectedAdventurers: (state) => {
            if (state.selectedAvailableQuest)
                state.adventurerSlots = Array(state.selectedAvailableQuest.slots).fill(null)
            else 
                state.adventurerSlots = []
        }
    },
});

export const { 
    addAvailableQuests,
    removeAvailableQuest,
    clearAvailableQuests,
    selectAvailableQuest,
    unselectAvailableQuest,
    selectAdventurer,
    unselectAdventurer,
    clearSelectedAdventurers
} = questBoardState.actions

//taken id

interface TakenIdType {
    id: string | null
}

const initialTakenId: TakenIdType = {id: null}

const takenId = createSlice({
    name: "takenId",
    initialState: initialTakenId,
    reducers: {
        setTakenId:  (state, action: PayloadAction<string>)=> {
            state.id = action.payload    
        },

        setTakenIdReset:  ( state )=> {
            state.id = null   
        }
    },
});

export const { setTakenId, setTakenIdReset } = takenId.actions

//combinacion de Reducers

export const availableQuestGeneralReducer = combineReducers({
    data: combineReducers({
        questBoard: questBoardState.reducer,
        takenId: takenId.reducer
    }),
    status: combineReducers({
        getAvailableQuestStatus: fetchGetAvailableQuestStatus.reducer,
        takeAvailableQuestStatus: fetchTakeAvailableQuestStatus.reducer
    })   
})

