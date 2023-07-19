import { DisplayThunk, displayState } from "./display-state"
import { AccountApi } from "../../account"

const actions = displayState.actions

export const DisplayThunks = {
    getCollection: (): DisplayThunk => async (dispatch) => {
        const result = await AccountApi.getUserCollectionWithMetadata()
        if (result.status !== "ok")
            dispatch(actions.setCollectionFetchingState({ctype: "error", details: result.reason}))
        else
            dispatch(actions.setCollectionItems(result.collection))
    }
}