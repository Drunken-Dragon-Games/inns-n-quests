import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"

export type StoreStoreState = 
    ReturnType<typeof StoreStore.getState> // Includes Thunks Middleware

export type StoreThunk<ReturnType = void> = 
    ThunkAction<ReturnType, StoreStoreState, unknown, Action<string>>

export interface StoreState {

}

const storeInitialState : StoreState = {}

export const storeState = createSlice({
    name: "store-state",
    initialState: storeInitialState,
    reducers: {}
})

export const StoreStore = configureStore({
    reducer: storeState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})