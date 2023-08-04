import { CollectionThunk, collectinState } from "./collection-state"
import { AccountApi } from "../account"
import { CollectionFilter } from "./collection-state-models"

const actions = collectinState.actions

export const CollectionThunks = {
    getCollection: (filter?: CollectionFilter): CollectionThunk => async (dispatch) => {
        const result = await AccountApi.getUserCollectionWithMetadata(filter)
        if (result.status !== "ok")
            dispatch(actions.setCollectionFetchingState({ctype: "error", details: result.reason}))
        else{
            dispatch(actions.setCollectionItems(result.collection))
        }
            
    }
}