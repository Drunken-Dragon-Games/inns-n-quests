import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers, compose } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { GeneralReducerThunk } from '../../../../../../features/generalReducer';
import { AxiosError } from "axios"
import { fetchRefreshToken } from '../../../../../../features/refresh';
import { Adventurer, AvailableQuest, sealTypes, SelectedQuest, tagAvailableQuest, TakenQuest } from '../../../../dsl';
import { simpleHash } from '../../../../../utils';

export const getAdventurers = () : GeneralReducerThunk => async (dispatch) =>{
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

const  fetchGetAdventurersStatus  = createSliceStatus("fetchGetAdventurersStatus")
const [ setFetchGetAdventurersStatusIdle, setFetchGetAdventurersStatusPending, setFetchGetAdventurersStatusFulfilled, setFetchGetAdventurersStatusErrors ] = actionsGenerator(fetchGetAdventurersStatus.actions)

export const addVisualQuestData = (quest: any) => {
    return ({
        ...quest,
        seal: sealTypes[Math.abs(simpleHash(quest.name ?? "") % 4)],
        paper: Math.abs(simpleHash(quest.description ?? "") % 4) + 1
    })
}

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

//reducer para monitorear el estado del request para los available quest 

const  fetchGetAvailableQuestStatus  = createSliceStatus("fetchGetAvailableQuestStatus")
const [ setFetchGetAvailableQuestStatusIdle, setFetchGetAvailableQuestStatusPending, setFetchGetAvailableQuestStatusFulfilled, setFetchGetAvailableQuestStatusErrors ] = actionsGenerator(fetchGetAvailableQuestStatus.actions)


//fetch para tomar a los available quests

export const takeAvailableQuest = (quest: AvailableQuest, adventurers: Adventurer[]): GeneralReducerThunk  => async (dispatch) =>{

    dispatch(setFetchTakeAvailableQuestStatusPending())  

    try {  

        const adventurer_ids = adventurers.map(adventurer => adventurer.adventurerId)
        //fetch para aceptar el quest
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: quest.questId, adventurer_ids})

        // se agrega a los ques in progress
        dispatch(addTakenQuests([response.data]))
            
        //se agrega a los aventureros en el quest la propiedad de in_quest
        dispatch(changeAdventurersInChallenge({ adventurers, inChallenge: true }))

        //deseleciona al available quest
        dispatch(unselectQuest())

        // dispatch(setQuestTakenId(questUiidFront))
            
        dispatch(setFetchTakeAvailableQuestStatusFulfilled())

        //dispatch(setTakenId(questId))
                    
    } catch (err: unknown) {

        if(err instanceof AxiosError ){
            dispatch(setFetchTakeAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken(() => dispatch(takeAvailableQuest(quest, adventurers)), err))
        }
    }

}

//reducer para monitorear el estado del request para los available quest 

const  fetchTakeAvailableQuestStatus  = createSliceStatus("fetchTakeAvailableQuestStatus")

const [ setFetchTakeAvailableQuestStatusIdle, setFetchTakeAvailableQuestStatusPending, setFetchTakeAvailableQuestStatusFulfilled, setFetchTakeAvailableQuestStatusErrors ] = actionsGenerator(fetchTakeAvailableQuestStatus.actions)


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
    })   
})

