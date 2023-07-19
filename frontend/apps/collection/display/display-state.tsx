import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { CollectionFetchingState, CollectionWithUIMetada } from "./display-state-models"


export type DisplayStoreState = 
    ReturnType<typeof displayStore.getState> // Includes Thunks Middleware

export type DisplayThunk<ReturnType = void> = 
    ThunkAction<ReturnType, DisplayStoreState, unknown, Action<string>>

export interface DisplayState {
    isUserLogged: boolean
    collectionItems: CollectionWithUIMetada,
    collectionFetchingState: CollectionFetchingState
}

const displayInitialState: DisplayState = {
    isUserLogged: false,
    collectionItems: {
        pixelTiles: [],
        grandMasterAdventurers: [],
        adventurersOfThiolden: []
    },
    collectionFetchingState: {ctype: "idle"}
}

export const displayState = createSlice({
    name: "collection-display-state",
    initialState: displayInitialState,
    reducers: {
        setIsUserLogged: (state, action: PayloadAction<boolean>) => {
            state.isUserLogged = action.payload
        },

        setCollectionItems: (state, action: PayloadAction<CollectionWithUIMetada>) => {
            state.collectionItems = action.payload
        },

        setCollectionFetchingState: (state, action: PayloadAction<CollectionFetchingState>) => {
            state.collectionFetchingState = action.payload
        },
    }
})

export const displayStore = configureStore({
    reducer: displayState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})