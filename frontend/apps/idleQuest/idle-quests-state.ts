import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from "redux"
import { v4 as uuidv4 } from 'uuid'
import { Adventurer, AppNotification, AvailableQuest, SelectedQuest, TakenQuest } from './dsl'

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
    initLoading: boolean

    inventoryOpen: boolean
    adventurers: Adventurer[]
    takenQuests: TakenQuest[]

    availableQuests: AvailableQuest[]
    selectedQuest?: SelectedQuest
    adventurerSlots: (Adventurer | null)[]
}

const questBoardInitialState: QuestBoardState = { 
    initLoading: true,

    inventoryOpen: false,
    adventurers: [],
    takenQuests: [],

    availableQuests: [],
    adventurerSlots: [],
}

const questBoardState = createSlice({
    name: "quest-board-state",
    initialState: questBoardInitialState,
    reducers: {

        setInitLoading: (state, action: PayloadAction<boolean>) => {
            state.initLoading = action.payload
        },

        toggleInventory: (state) => {
            state.inventoryOpen = !state.inventoryOpen
        },

        setInventory: (state, action: PayloadAction<Adventurer[]>) => {
            state.adventurers = sortAdventurers(action.payload)
        },

        setTakenQuests: (state, action: PayloadAction<TakenQuest[]>) => {
            state.takenQuests = action.payload
        },

        addTakenQuest: (state, action: PayloadAction<TakenQuest>) => {
            state.takenQuests = [...state.takenQuests, action.payload]
            console.log(state.takenQuests)
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
                    state.adventurers.find(adventurer => adventurer.adventurerId === quest.adventurerIds[index]) ?? null)
        },

        unselectQuest: (state) => {
            state.selectedQuest = undefined
            state.adventurerSlots = []
        },

        selectAdventurer: (state, action: PayloadAction<Adventurer>) => {
            if (!state.selectedQuest) return
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
            state.adventurers.forEach(adventurer => {
                action.payload.adventurers.forEach((actionAdventurer) => {
                    if(actionAdventurer.adventurerId == adventurer.adventurerId){
                        adventurer.inChallenge = action.payload.inChallenge
                        return 
                    }
                })
            })
            state.adventurers = sortAdventurers(state.adventurers)
        },
    },
});

export const {
    setInitLoading,
    toggleInventory,
    setInventory,
    setTakenQuests,
    addTakenQuest,
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

type NotificationsState = {
    notifications: AppNotification[]
}

const notificationsInitialState: NotificationsState = { 
    notifications: [
        { ctype: "info", message: "Welcome back adventurer!", notificationId: uuidv4(), createdAt: new Date() }
    ]
}

const notificationsState = createSlice({
    name: "notifications-state",
    initialState: notificationsInitialState,
    reducers: {

        notify: (state, action: PayloadAction<{ message: string, ctype: AppNotification["ctype"] }>) => {
            state.notifications.push({
                ctype: action.payload.ctype,
                message: action.payload.message,
                notificationId: uuidv4(),
                createdAt: new Date()
            })
        },

        removeTimedOutNotifications: (state, action: PayloadAction<Date>) => {
            state.notifications = state.notifications.filter(notification =>
                notification.createdAt.getTime() + 5000 > action.payload.getTime())
        }
    }
})

export const {
    notify,
    removeTimedOutNotifications
} = notificationsState.actions

export const idleQuestsReducer = combineReducers({
    questBoard: questBoardState.reducer,
    notifications: notificationsState.reducer,
})

export const idleQuestsStore = configureStore({
    reducer: idleQuestsReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

export type IdleQuestsState = 
    ReturnType<typeof idleQuestsStore.getState>
export type IdleQuestsDispatch = 
    typeof idleQuestsStore.dispatch
export type IdleQuestsThunk<ReturnType = void> = 
    ThunkAction<ReturnType, IdleQuestsState, unknown, Action<string>>
