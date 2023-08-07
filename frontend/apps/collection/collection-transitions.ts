import { CollectionStore } from "./collection-state"
import { CollectionFilter } from "./collection-state-models"
import { CollectionThunks } from "./collection-thunks"

const dispatch = CollectionStore.dispatch

export const collectionTransitions = {
    getCollection(filter?: CollectionFilter){
        dispatch(CollectionThunks.getCollection(filter))
    },

    setFilter(filter: CollectionFilter){
        dispatch(CollectionThunks.setFilter(filter))
    }
}