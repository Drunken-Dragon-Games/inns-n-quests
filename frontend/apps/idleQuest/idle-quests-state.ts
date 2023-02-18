import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from "redux"
import { inventoryState } from './modules/inventory/inventory-state'
import { notificationsState } from './modules/notifications/notifications-state'
import { questBoardState } from './modules/quest-board'
import { worldState } from './modules/world'

export const idleQuestsReducer = combineReducers({
    world: worldState.reducer,
    inventory: inventoryState.reducer,
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
export type IdleQuestsSnD = 
    { state: IdleQuestsState, dispatch: IdleQuestsDispatch }
