import { v4 } from "uuid"
import { AccountApi, SupportedWallet, ExtractWalletResult } from "../account"
import { CollectionThunk, collectinState } from "./collection-state"
import { CollectionFetchingState, CollectionFilter, CollectionWithUIMetada, MortalCollectible } from "./collection-state-models"
import { Blockfrost, Lucid } from "lucid-cardano"
import { blockfrostApiKey, blockfrostUri, cardanoNetwork} from "../../setting"
import { isEmpty } from "../common"
import Collection from "../home/homePage/compoenents/basic_components/collection"

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
            const result = await AccountApi.getUserCollectionWithMetadata(9,filter)
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

    modifyMortalCollection: (asset: MortalCollectible, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"): CollectionThunk => async (dispatch, getState) => {
        const state = getState()
        const [foundPage, foundCollection] = Object.entries(state.collectionCache).find(([pageNumber, collection]) => 
            collection[policy].some((policyItem) => policyItem.assetRef === asset.assetRef)
        ) || []

        if (foundCollection) {
            const collection = { ...foundCollection } // Create a shallow copy
            const ethernalIndex = collection[policy].findIndex((policy) => policy.assetRef === asset.assetRef)
            const newActive = collection[policy][ethernalIndex].mortalRealmsActive + (action === "add" ? 1 : -1)
            
            collection[policy] = [...collection[policy]]
            collection[policy][ethernalIndex] = { ...collection[policy][ethernalIndex], mortalRealmsActive: newActive }
            
            dispatch(actions.addToCollectionCache({ page: Number(foundPage), collection, hasMore: collection.hasMore }))

            if(state.collectionFilter.page === Number(foundPage))
                dispatch(CollectionThunks.getCollection({ ...state.collectionCache, [state.collectionFilter.page]: collection }, state.collectionFilter))
        }
        const oldMortalCollection = {...state.mortalCollectionItems}
        const mortalPolicyIndex = oldMortalCollection[policy].findIndex((item) => item.assetRef === asset.assetRef)
        oldMortalCollection[policy] = [...oldMortalCollection[policy]]
        

        if (mortalPolicyIndex !== -1){
            const newQuantity = (Number(oldMortalCollection[policy][mortalPolicyIndex].quantity)  + (action === "add" ? 1 : -1)).toString()
            oldMortalCollection[policy][mortalPolicyIndex] = { ...oldMortalCollection[policy][mortalPolicyIndex], quantity: newQuantity }
        }else{
            const policyItemns = [...oldMortalCollection[policy]]
            policyItemns.push({...asset, quantity: "1"})
            oldMortalCollection[policy] = [...policyItemns]
        } 
        dispatch(actions.setMortalCollection(oldMortalCollection))   
    },

    getMortalCollectionLockedState: (): CollectionThunk => async (dispatch) => {
        const stateResult = await AccountApi.getMortalCollectionLockedState()
        if (stateResult.status === "ok") dispatch(actions.setMortalCollectionLocked(stateResult.locked))
        else dispatch(CollectionThunks.displayStatus({ ctype: "error", details: stateResult.reason }))
    },

    lockMortalCollection: (): CollectionThunk => async (dispatch) => {
        const result = await AccountApi.lockMortalCollection()
        if (result.status === "ok") dispatch(actions.setMortalCollectionLocked(true))
        else dispatch(CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
    },

    setFilter: (filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        dispatch(actions.setCollectionFilter(filter))
    },

    clearCache: (): CollectionThunk => async (dispatch) => {
        dispatch(actions.clearCache())
    },

    flipDisplayArtStyle: (): CollectionThunk =>async (dispatch, getState) => {
        const state = getState()
        const artStyle = state.displayArtStyle
        const newArtType = artStyle === "splashArt" ? "miniature" : "splashArt"
        dispatch(actions.setDisplayArtStyle(newArtType))
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