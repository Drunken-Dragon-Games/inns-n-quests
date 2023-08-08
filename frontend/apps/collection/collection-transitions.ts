import { CollectionStore } from "./collection-state"
import { CollectionFilter, CollectionWithUIMetada } from "./collection-state-models"
import { CollectionThunks } from "./collection-thunks"

const dispatch = CollectionStore.dispatch

export const collectionTransitions = {
    setDisplayCollection(cache: Record<number, CollectionWithUIMetada>, filter: CollectionFilter){
        dispatch(CollectionThunks.getCollection(cache, filter))
    },

    setFilter(filter: CollectionFilter){
        dispatch(CollectionThunks.setFilter(filter))
    },

    clearCache(){
        dispatch(CollectionThunks.clearCache())
    }
}