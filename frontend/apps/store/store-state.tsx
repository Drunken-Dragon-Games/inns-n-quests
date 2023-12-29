import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { AotOrderState } from "./store-state-models"

export type StoreStoreState = 
    ReturnType<typeof StoreStore.getState> // Includes Thunks Middleware

export type StoreThunk<ReturnType = void> = 
    ThunkAction<ReturnType, StoreStoreState, unknown, Action<string>>

export interface StoreState {
    aotOrderState: AotOrderState
}

const storeInitialState : StoreState = {
    aotOrderState: {ctype: "Idle"}
}

export const storeState = createSlice({
    name: "store-state",
    initialState: storeInitialState,
    reducers: {
        setAotOrderState: (state, action: PayloadAction<AotOrderState>) => {
            state.aotOrderState = action.payload
        }
    }
})

export const StoreStore = configureStore({
    reducer: storeState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})