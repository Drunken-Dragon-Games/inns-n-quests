import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import { Adventurer, AvailableQuest, SelectedQuest, TakenQuest } from '../../../dsl';
import { fetchGetAdventurersStatus, fetchGetAvailableQuestStatus, fetchGetInProgressQuestStatus, fetchPostClaimRewardInProgressQuestStatus, fetchTakeAvailableQuestStatus } from "./quest-board-thunks"

const sortAdventurers = (adventurers: Adventurer[]) => {
    return adventurers.sort((a, b) => {
        if(a.inChallenge && !b.inChallenge){
            return 1
        }
        if(!a.inChallenge && b.inChallenge){
            return -1
        }
        return 0
    })
}

interface QuestBoardState {
    inventory: Adventurer[]
    takenQuests: TakenQuest[]
    availableQuests: AvailableQuest[]
    selectedQuest?: SelectedQuest
    adventurerSlots: (Adventurer | null)[]
}

const questBoardInitialState: QuestBoardState = { 
    inventory: [],
    takenQuests: [],
    availableQuests: [],
    adventurerSlots: [],
}

const questBoardState = createSlice({
    name: "quest-board-state",
    initialState: questBoardInitialState,
    reducers: {

        setInventory: (state, action: PayloadAction<Adventurer[]>) => {
            state.inventory = sortAdventurers(action.payload)
        },

        setTakenQuests: (state, action: PayloadAction<TakenQuest[]>) => {
            state.takenQuests = action.payload
        },

        addTakenQuests: (state, action: PayloadAction<TakenQuest[]>) => {
            state.takenQuests = [...state.takenQuests, ...action.payload]
        },

        removeTakenQuest: (state, action: PayloadAction<TakenQuest>) => {
            state.takenQuests = state.takenQuests.filter(quest => quest.takenQuestId !== action.payload.takenQuestId)
        },

        addAvailableQuests: (state, action: PayloadAction<AvailableQuest[]>) => {
            state.availableQuests = [...state.availableQuests, ...action.payload]
        },

        removeAvailableQuest: (state, action: PayloadAction<AvailableQuest>) => {
            state.availableQuests = state.availableQuests.filter(quest => quest.questId !== action.payload.questId)
        },

        clearAvailableQuests: (state) => {
            state.availableQuests = []
        },

        selectQuest: (state, action: PayloadAction<SelectedQuest>) => {
            const quest = action.payload
            state.selectedQuest = quest
            if (quest.ctype === "available-quest")
                state.adventurerSlots = Array(quest.slots).fill(null)
            else
                state.adventurerSlots = Array(quest.quest.slots).fill(null).map((_, index) => 
                    state.inventory.find(adventurer => adventurer.adventurerId === quest.adventurerIds[index]) ?? null)
        },

        unselectQuest: (state) => {
            state.selectedQuest = undefined
            state.adventurerSlots = []
        },

        selectAdventurer: (state, action: PayloadAction<Adventurer>) => {
            const indexNull = state.adventurerSlots.indexOf(null)
            const indexAdventurer = state.adventurerSlots
                .map(a => a ? a.adventurerId : a)
                .indexOf(action.payload.adventurerId)
            const alreadySelected = indexAdventurer !== -1
            const partyFull = indexNull === -1
            if (alreadySelected)
                state.adventurerSlots[indexAdventurer] = null
            else if (partyFull) 
                state.adventurerSlots[0] = action.payload
            else 
                state.adventurerSlots[indexNull] = action.payload
        },

        unselectAdventurer: (state, action: PayloadAction<Adventurer>) => {
            state.adventurerSlots = state.adventurerSlots.map(adventurer => 
                adventurer?.adventurerId === action.payload.adventurerId ? null : adventurer)
        },

        clearSelectedAdventurers: (state) => {
            if (state.selectedQuest && state.selectedQuest.ctype === "available-quest")
                state.adventurerSlots = Array(state.selectedQuest.slots).fill(null)
            else 
                state.adventurerSlots = []
        },
        
        changeAdventurersInChallenge: (state, action: PayloadAction<{ adventurers: Adventurer[], inChallenge: boolean }>) => {
            state.inventory.forEach(adventurer => {
                action.payload.adventurers.forEach((actionAdventurer) => {
                    if(actionAdventurer.adventurerId == adventurer.adventurerId){
                        adventurer.inChallenge = action.payload.inChallenge
                        return 
                    }
                })
            })
            state.inventory = sortAdventurers(state.inventory)
        },
    },
});

export const {
    setInventory,
    setTakenQuests,
    addTakenQuests,
    removeTakenQuest,
    addAvailableQuests,
    removeAvailableQuest,
    clearAvailableQuests,
    selectQuest,
    unselectQuest,
    selectAdventurer,
    unselectAdventurer,
    clearSelectedAdventurers,
    changeAdventurersInChallenge,
} = questBoardState.actions

export const questBoardGeneralReducer = combineReducers({
    questBoard: questBoardState.reducer,
    status: combineReducers({
        getAvailableQuestStatus: fetchGetAvailableQuestStatus.reducer,
        takeAvailableQuestStatus: fetchTakeAvailableQuestStatus.reducer,
        getAdventurersStatus: fetchGetAdventurersStatus.reducer,
        inProgress: fetchGetInProgressQuestStatus.reducer,
        claimReward: fetchPostClaimRewardInProgressQuestStatus.reducer
    })   
})

