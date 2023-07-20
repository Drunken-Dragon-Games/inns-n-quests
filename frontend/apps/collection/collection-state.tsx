import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { CollectionFetchingState, CollectionWithUIMetada } from "./collection-state-models"


export type CollectionStoreState = 
    ReturnType<typeof CollectionStore.getState> // Includes Thunks Middleware

export type CollectionThunk<ReturnType = void> = 
    ThunkAction<ReturnType, CollectionStoreState, unknown, Action<string>>

export interface CollectionState {
    isUserLogged: boolean
    collectionItems: CollectionWithUIMetada,
    collectionFetchingState: CollectionFetchingState
}

const collectionInitialState: CollectionState = {
    isUserLogged: false,
    collectionItems: {
        pixelTiles: [],
        grandMasterAdventurers: [],
        adventurersOfThiolden: []
    },
    collectionFetchingState: {ctype: "idle"}
}

export const collectinState = createSlice({
    name: "collection-state",
    initialState: collectionInitialState,
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

export const CollectionStore = configureStore({
    reducer: collectinState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})