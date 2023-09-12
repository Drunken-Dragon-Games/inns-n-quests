import { SupportedWallet } from "../account"
import { CollectionStore } from "./collection-state"
import { CollectionFilter, CollectionWithUIMetada, MortalCollectible } from "./collection-state-models"
import { CollectionThunks } from "./collection-thunks"

const dispatch = CollectionStore.dispatch

export const collectionTransitions = {
    setDisplayCollection(cache: Record<number, CollectionWithUIMetada>, filter: CollectionFilter){
        dispatch(CollectionThunks.getCollection(cache, filter))
    },

    setMortalCollection(){
        dispatch(CollectionThunks.getMortalCollection())
    },

    syncCollection(){
        dispatch(CollectionThunks.syncCollection())
    },

    modifyMortalCollection(asset: MortalCollectible, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"){
        dispatch(CollectionThunks.modifyMortalCollection(asset, action, policy))
    },

    getMortalCollectionLockedState(){
        dispatch(CollectionThunks.getMortalCollectionLockedState())
    },

    getWeeklyEarnings(){
        dispatch(CollectionThunks.getWeeklyEarnings())
    },

    lockMortalCollection() {
        dispatch(CollectionThunks.lockMortalCollection())
    },

    setFilter(filter: CollectionFilter){
        dispatch(CollectionThunks.setFilter(filter))
    },

    clearCache(){
        dispatch(CollectionThunks.clearCache())
    },

    flipDisplayArtType(){
        dispatch(CollectionThunks.flipDisplayArtStyle())
    },

    grantTestCollection(supportedWallet: SupportedWallet){
        if (process.env["NEXT_PUBLIC_ENVIROMENT"] === "development") dispatch(CollectionThunks.grantTestCollection(supportedWallet))
    }
}