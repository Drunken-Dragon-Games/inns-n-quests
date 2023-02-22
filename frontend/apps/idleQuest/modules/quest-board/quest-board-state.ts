import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AvailableQuest } from "../../dsl"

export interface QuestBoardState {
    open: boolean
    availableQuests: AvailableQuest[]
}

const questBoardInitialState: QuestBoardState = { 
    open: false,
    availableQuests: [],
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
} = questBoardState.actions
