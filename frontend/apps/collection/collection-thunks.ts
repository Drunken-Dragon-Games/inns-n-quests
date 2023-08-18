import { v4 } from "uuid"
import { AccountApi, SupportedWallet, ExtractWalletResult } from "../account"
import { CollectionThunk, collectinState } from "./collection-state"
import { CollectionFetchingState, CollectionFilter, CollectionWithUIMetada } from "./collection-state-models"
import { Blockfrost, Lucid } from "lucid-cardano"
import { blockfrostApiKey, blockfrostUri, cardanoNetwork} from "../../setting"
import { isEmpty } from "../common"

const actions = collectinState.actions

export const CollectionThunks = {

    displayStatus: (error: CollectionFetchingState): CollectionThunk => async (dispatch) => {
        dispatch(actions.setCollectionFetchingState(error))
        setTimeout(() => {dispatch(actions.setCollectionFetchingState({ctype: "idle"}))}, 3000)
    },
      
    getCollection: (cache: Record<number, CollectionWithUIMetada>, filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        if (cache[filter.page]) {
                dispatch(actions.setDisplayedCollection(cache[filter.page]))
          } 
        else {
            const result = await AccountApi.getUserCollectionWithMetadata(filter)
            if (result.status !== "ok") {
                dispatch(CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
            } else {
                dispatch(actions.addToCollectionCache({page: filter.page, collection:result.collection, hasMore: result.hasMore}))
                dispatch(actions.setDisplayedCollection(result.collection))
            }
        }
    },

    syncCollection: (): CollectionThunk => async (dispatch, getState) => {
        const result = await AccountApi.syncCollection()
        if (result.status !== "ok") {
            dispatch(CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
        } else {
            const state = getState()
            dispatch(CollectionThunks.clearCache())
            dispatch(CollectionThunks.getCollection({}, state.collectionFilter))
        }
    },

    getMortalCollection: (): CollectionThunk => async (dispatch) => {
        const result = await AccountApi.getUserMortalCollection()
        if (result.status !== "ok") {
            dispatch(CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
        } else {
            dispatch(actions.setMortalCollection(result.collection))
        }
    },

    modifyMortalCollection: (assetRef: string, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"): CollectionThunk => async (dispatch, getState) => {
        const modifyResult = await AccountApi.modifyUserMortalCollection(assetRef, action)
        if (modifyResult.status !== "ok") return (CollectionThunks.displayStatus({ ctype: "error", details: modifyResult.reason }))
        const result = await AccountApi.getUserMortalCollection()
        if (result.status !== "ok") return dispatch(CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
        const state = getState()
        const [foundPage, foundCollection] = Object.entries(state.collectionCache).find(([pageNumber, collection]) => 
            collection[policy].some((policyItem) => policyItem.assetRef === assetRef)
        ) || []

        if (foundCollection) {
            const collection = { ...foundCollection } // Create a shallow copy
            const ethernalIndex = collection[policy].findIndex((policy) => policy.assetRef === assetRef)
            const newActive = collection[policy][ethernalIndex].mortalRealmsActive + (action === "add" ? 1 : -1)
            
            collection[policy] = [...collection[policy]]
            collection[policy][ethernalIndex] = { ...collection[policy][ethernalIndex], mortalRealmsActive: newActive }
            
            dispatch(actions.addToCollectionCache({ page: Number(foundPage), collection, hasMore: collection.hasMore }))

            if(state.collectionFilter.page === Number(foundPage))
                dispatch(CollectionThunks.getCollection({ ...state.collectionCache, [state.collectionFilter.page]: collection }, state.collectionFilter))
        }
        dispatch(actions.setMortalCollection(result.collection))
        
    },

    setFilter: (filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        dispatch(actions.setCollectionFilter(filter))
    },

    clearCache: (): CollectionThunk => async (dispatch) => {
        dispatch(actions.clearCache())
    },

    grantTestCollection: (supportedWallet: SupportedWallet): CollectionThunk => async (dispatch, getState) => {
        if (process.env["NEXT_PUBLIC_ENVIROMENT"] === "development"){
            try{
            const traceId = v4()
            const walletResult = await AccountApi.getWallet(supportedWallet)
            //const walletResult = await CollectionThunks.extractWalletApiAndStakeAddress(supportedWallet)
            if(walletResult.status !== "ok") return dispatch(CollectionThunks.displayStatus({ ctype: "error", details: walletResult.details }))
            const result = await AccountApi.grantCollection(walletResult.address)
            if (result.status !== "ok") return (CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
            const tx = walletResult.walletApi.fromTx(result.tx)
            const signedTx  = await tx.sign().complete()
            const serializedSignedTx = signedTx.toString()
            const signature = await AccountApi.submmitGrantColleciton(serializedSignedTx, traceId)
            if(signature.status !== "ok") return dispatch(CollectionThunks.displayStatus({ ctype: "error", details: signature.reason }))
            return dispatch(CollectionThunks.displayStatus({ctype: "loading", details: `tx submited with id ${signature.txId}`}))
        }catch(e: any){
            console.error(e)
        }
        }
    }
}