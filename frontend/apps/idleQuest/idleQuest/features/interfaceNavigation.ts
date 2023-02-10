import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { AvailableQuest } from '../../dsl';

//reducer para controlar la navegacion de los quest available

/*
interface initialStateAvailableQuestSelected{
    availableQuest?: AvailableQuest 
}

const initialStateNavigationConsole: initialStateAvailableQuestSelected = { availableQuest: undefined }

const availableQuestSelected = createSlice({
    name: "availableQuestSelected",
    initialState: initialStateNavigationConsole,
    reducers: {
        setAvailableQuestSelected:  (state, action: PayloadAction<AvailableQuest>)=> {
            
            state.availableQuest = action.payload
            
        },
        setAvailableQuestUnselect:  (state)=> {
            
            state.availableQuest = undefined
            
        },
    },
});

export const { setAvailableQuestSelected, setAvailableQuestUnselect } = availableQuestSelected.actions
*/

interface initialStateInProgressQuestSelected{
    inProgressQuest: null | number
}

const initialStateNavigationInprogress: initialStateInProgressQuestSelected = { inProgressQuest: null }

const inProgressQuestSelected = createSlice({
    name: "inProgressQuestSelected",
    initialState: initialStateNavigationInprogress,
    reducers: {
        setInProgressQuestSelected:  (state, action: PayloadAction<number>)=> {
            
            state.inProgressQuest = action.payload           
        },
        setInProgressQuestUnselect:  (state)=> {
            
            state.inProgressQuest =null
            
        },
    },
});

export const { setInProgressQuestSelected, setInProgressQuestUnselect } = inProgressQuestSelected.actions


export const navigatorAppReducer = combineReducers({
    //availableQuest: availableQuestSelected.reducer,
    inProgress: inProgressQuestSelected.reducer
})