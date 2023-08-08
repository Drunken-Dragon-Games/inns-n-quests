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
                dispatch(actions.addToCollectionCache({page: filter.page, collection:result.collection}))
                dispatch(actions.setDisplayedCollection(result.collection))
            }
        }
    },

    setFilter: (filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        dispatch(actions.setCollectionFilter(filter))
    },

    clearCache: (): CollectionThunk => async (dispatch) => {
        dispatch(actions.clearCache())
    },
}