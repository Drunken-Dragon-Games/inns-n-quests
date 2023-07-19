import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { CollectionWithUIMetada } from "./display-state-models"


export type DisplayStoreState = 
    ReturnType<typeof displayStore.getState> // Includes Thunks Middleware

export type DisplayThunk<ReturnType = void> = 
    ThunkAction<ReturnType, DisplayStoreState, unknown, Action<string>>

export interface DisplasyState {
    collectionItems: CollectionWithUIMetada
}

const displayInitialState: DisplasyState = { 
    collectionItems: {
        pixelTiles: [],
        grandMasterAdventurers: [],
        adventurersOfThiolden: []
    }
}

export const displayState = createSlice({
    name: "collection-display-state",
    initialState: displayInitialState,
    reducers: {
        setCollectionItems: (state, action: PayloadAction<CollectionWithUIMetada>) => {
            state.collectionItems = action.payload
        },
    }
})

export const displayStore = configureStore({
    reducer: displayState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})