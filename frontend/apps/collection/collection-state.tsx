import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { CollectionFetchingState, CollectionFilter, CollectionWithUIMetada } from "./collection-state-models"


export type CollectionStoreState = 
    ReturnType<typeof CollectionStore.getState> // Includes Thunks Middleware

export type CollectionThunk<ReturnType = void> = 
    ThunkAction<ReturnType, CollectionStoreState, unknown, Action<string>>

export interface CollectionState {
    collectionItems: CollectionWithUIMetada,
    collectionFetchingState: CollectionFetchingState,
    collectionFilter: CollectionFilter
}

const collectionInitialState: CollectionState = {
    collectionItems: {
        pixelTiles: [],
        grandMasterAdventurers: [],
        adventurersOfThiolden: []
    },
    collectionFetchingState: {ctype: "idle"},
    collectionFilter: {page: 1, policyFilter: [], classFilter: [], APSFilter:{ath: {}, int: {}, cha: {}}}
}

export const collectinState = createSlice({
    name: "collection-state",
    initialState: collectionInitialState,
    reducers: {
        setCollectionItems: (state, action: PayloadAction<CollectionWithUIMetada>) => {
            state.collectionItems = action.payload
        },

        setCollectionFetchingState: (state, action: PayloadAction<CollectionFetchingState>) => {
            state.collectionFetchingState = action.payload
        },

        setCollectionFilter: (state, action: PayloadAction<CollectionFilter>) => {
            state.collectionFilter = action.payload
        }
    }
})

export const CollectionStore = configureStore({
    reducer: collectinState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})