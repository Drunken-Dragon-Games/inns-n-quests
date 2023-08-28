import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { CollectionFetchingState, CollectionFilter, CollectionWithGameData, CollectionWithUIMetada } from "./collection-state-models"


export type CollectionStoreState = 
    ReturnType<typeof CollectionStore.getState> // Includes Thunks Middleware

export type CollectionThunk<ReturnType = void> = 
    ThunkAction<ReturnType, CollectionStoreState, unknown, Action<string>>

export interface CollectionState {
    displayedCollectionItems: CollectionWithUIMetada,
    mortalCollectionItems: CollectionWithGameData,
    collectionCache: Record<number, CollectionWithUIMetada & {hasMore: boolean}>,
    collectionFetchingState: CollectionFetchingState,
    collectionFilter: CollectionFilter,
    displayArtStyle: "miniature" | "splashArt",
    mortalLocked: boolean
}

const collectionInitialState: CollectionState = {
    displayedCollectionItems: {
        pixelTiles: [],
        grandMasterAdventurers: [],
        adventurersOfThiolden: []
    },
    mortalCollectionItems: {
        pixelTiles: [],
        grandMasterAdventurers: [],
        adventurersOfThiolden: []
    },
    collectionCache: {},
    collectionFetchingState: {ctype: "idle"},
    collectionFilter: {page: 1, policyFilter: [], classFilter: [], APSFilter:{ath: {}, int: {}, cha: {}}},
    displayArtStyle: "splashArt",
    mortalLocked: true
}

export const collectinState = createSlice({
    name: "collection-state",
    initialState: collectionInitialState,
    reducers: {
        setDisplayedCollection: (state, action: PayloadAction<CollectionWithUIMetada>) => {
            state.displayedCollectionItems = action.payload
        },

        setMortalCollection: (state, action: PayloadAction<CollectionWithGameData> )=> {
            state.mortalCollectionItems = action.payload
        },

        setMortalCollectionLocked: (state, action: PayloadAction<boolean>) => {
            state.mortalLocked = action.payload
        },

        addToCollectionCache: (state, action: PayloadAction<{page: number, collection: CollectionWithUIMetada, hasMore: boolean}>) => {
            state.collectionCache[action.payload.page] = {...action.payload.collection, hasMore: action.payload.hasMore}
        },

        clearCache: (state) => {
            state.collectionCache = {}
        },

        setCollectionFetchingState: (state, action: PayloadAction<CollectionFetchingState>) => {
            state.collectionFetchingState = action.payload
        },

        setCollectionFilter: (state, action: PayloadAction<CollectionFilter>) => {
            state.collectionFilter = action.payload
        },

        setDisplayArtStyle: (state, action: PayloadAction<"miniature" | "splashArt">) => {
            state.displayArtStyle = action.payload
        },
    }
})

export const CollectionStore = configureStore({
    reducer: collectinState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})