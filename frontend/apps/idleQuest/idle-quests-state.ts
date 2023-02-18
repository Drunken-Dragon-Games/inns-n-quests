import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from "redux"
import { worldState } from './modules/world'
import { notificationsState } from './state/notifications-state'
import { questBoardState } from './state/quest-board-state'

export const idleQuestsReducer = combineReducers({
    world: worldState.reducer,
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
