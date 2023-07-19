import { displayStore } from "./display-state"
import { DisplayThunks } from "./display-thunks"

const dispatch = displayStore.dispatch

export const DisplayTransitions = {
    getCollection(){
        dispatch(DisplayThunks.getCollection())
    }
}