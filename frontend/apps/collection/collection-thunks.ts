import { CollectionThunk, collectinState } from "./collection-state"
import { AccountApi } from "../account"

const actions = collectinState.actions

export const CollectionThunks = {
    getCollection: (): CollectionThunk => async (dispatch) => {
        const result = await AccountApi.getUserCollectionWithMetadata()
        if (result.status !== "ok")
            dispatch(actions.setCollectionFetchingState({ctype: "error", details: result.reason}))
        else{
            dispatch(actions.setCollectionItems(result.collection))
            dispatch(actions.setIsUserLogged(true))
        }
            
    }
}