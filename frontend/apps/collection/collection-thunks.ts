import { CollectionThunk, collectinState } from "./collection-state"
import { AccountApi } from "../account"
import { CollectionFilter, CollectionWithUIMetada } from "./collection-state-models"

const actions = collectinState.actions

export const CollectionThunks = {
    getCollection: (cache: Record<number, CollectionWithUIMetada>, filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        if (cache[filter.page]) {
                dispatch(actions.setDisplayedCollection(cache[filter.page]))
          } 
        else {
            const result = await AccountApi.getUserCollectionWithMetadata(filter)
            if (result.status !== "ok") {
                dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
            } else {
                dispatch(actions.addToCollectionCache({page: filter.page, collection:result.collection, hasMore: result.hasMore}))
                dispatch(actions.setDisplayedCollection(result.collection))
            }
        }
    },

    syncCollection: (): CollectionThunk => async (dispatch, getState) => {
        const result = await AccountApi.syncCollection()
        if (result.status !== "ok") {
            dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
        } else {
            const state = getState()
            dispatch(CollectionThunks.clearCache())
            dispatch(CollectionThunks.getCollection({}, state.collectionFilter))
        }
    },

    getMortalCollection: (): CollectionThunk => async (dispatch) => {
        const result = await AccountApi.getUserMortalCollection()
        if (result.status !== "ok") {
            dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
        } else {
            dispatch(actions.setMortalCollection(result.collection))
        }
    },

    modifyMortalCollection: (assetRef: string, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"): CollectionThunk => async (dispatch, getState) => {
        const modifyResult = await AccountApi.modifyUserMortalCollection(assetRef, action)
        if (modifyResult.status !== "ok") return (actions.setCollectionFetchingState({ ctype: "error", details: modifyResult.reason }))
        const result = await AccountApi.getUserMortalCollection()
        if (result.status !== "ok") return dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
        const state = getState()
        const [foundPage, foundCollection] = Object.entries(state.collectionCache).find(([_, collection]) => 
        collection[policy].some((policyItem) => policyItem.assetRef === assetRef)
        ) || []

        if (!foundCollection) {
            console.error('AssetRef not found in any collection.');
            return
        }
        const collection = { ...foundCollection } // Create a shallow copy
        const ethernalIndex = collection[policy].findIndex((policy) => policy.assetRef === assetRef)
        const newActive = collection[policy][ethernalIndex].mortalRealmsActive + (action === "add" ? 1 : -1)
        
        collection[policy] = [...collection[policy]]
        collection[policy][ethernalIndex] = { ...collection[policy][ethernalIndex], mortalRealmsActive: newActive }
        
        dispatch(actions.addToCollectionCache({ page: Number(foundPage), collection, hasMore: collection.hasMore }))
        dispatch(actions.setMortalCollection(result.collection))
        if(state.collectionFilter.page === Number(foundPage))
            dispatch(CollectionThunks.getCollection({ ...state.collectionCache, [state.collectionFilter.page]: collection }, state.collectionFilter))
    },

    setFilter: (filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        dispatch(actions.setCollectionFilter(filter))
    },

    clearCache: (): CollectionThunk => async (dispatch) => {
        dispatch(actions.clearCache())
    },
}