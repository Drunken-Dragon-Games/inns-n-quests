import { CollectionStore } from "./collection-state"
import { CollectionThunks } from "./collection-thunks"

const dispatch = CollectionStore.dispatch

export const collectionTransitions = {
    getCollection(){
        dispatch(CollectionThunks.getCollection())
    }
}