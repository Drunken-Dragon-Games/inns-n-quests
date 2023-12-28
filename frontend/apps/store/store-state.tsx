import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"

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