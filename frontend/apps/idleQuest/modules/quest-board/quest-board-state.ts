import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { AvailableEncounter, AvailableQuest } from "../../common"

export interface QuestBoardState {
    open: boolean
    availableQuests: AvailableQuest[]
    availableEncounters: AvailableEncounter[]
}

export type QuestBoardStoreState = 
    ReturnType<typeof questBoardStore.getState> // Includes Thunks Middleware

export type QuestBoardThunk<ReturnType = void> = 
    ThunkAction<ReturnType, QuestBoardStoreState, unknown, Action<string>>

const questBoardInitialState: QuestBoardState = { 
    open: false,
    availableQuests: [],
    availableEncounters: [],
}

export const questBoardState = createSlice({
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

        addAvailableEncounters: (state, action: PayloadAction<AvailableEncounter[]>) => {
            state.availableEncounters = [...state.availableEncounters, ...action.payload]
        },

        removeAvailableEncounter: (state, action: PayloadAction<AvailableEncounter>) => {
            state.availableEncounters = state.availableEncounters.filter(encounter => encounter.encounterId !== action.payload.encounterId)
        },

        clearAvailableEncounters: (state) => {
            state.availableEncounters = []
        },

        toggleQuestBoard: (state, action: PayloadAction<{ open?: boolean }>) => {
            state.open = action.payload.open ?? !state.open
        }
    }
})

export const {
    addAvailableQuests,
    removeAvailableQuest,
    clearAvailableQuests,
    toggleQuestBoard,
    addAvailableEncounters,
    removeAvailableEncounter,
    clearAvailableEncounters,
} = questBoardState.actions

export const questBoardStore = configureStore({
    reducer: questBoardState.reducer,
})

export const useQuestBoardSelector = <Selection = unknown>(selector: (state: QuestBoardState) => Selection) => 
    useSelector<QuestBoardStoreState, Selection>(selector)
