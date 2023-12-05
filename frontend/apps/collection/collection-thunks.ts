import { v4 } from "uuid"
import { AccountApi, SupportedWallet, ExtractWalletResult } from "../account"
import { CollectionThunk, collectinState } from "./collection-state"
import { CollectionFetchingState, CollectionFilter, CollectionWithGameData, CollectionWithUIMetada, MortalCollectible } from "./collection-state-models"
import { Blockfrost, Lucid } from "lucid-cardano"
import { blockfrostApiKey, blockfrostUri, cardanoNetwork} from "../../setting"
import { isEmpty } from "../common"
import Collection from "../home/homePage/compoenents/basic_components/collection"
import { CollectionAssets } from "../account/account-backend"

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
        const state = getState()
        if (state.isSyncing) return
        dispatch(actions.setIsSyncing(true))
        const result = await AccountApi.syncCollection()
        if (result.status !== "ok") {
            dispatch(CollectionThunks.displayStatus({ ctype: "error", details: result.reason }))
            setTimeout(() => {dispatch(actions.setIsSyncing(false))}, 3000)
        } else {
            dispatch(CollectionThunks.clearCache())
            dispatch(CollectionThunks.getCollection({}, state.collectionFilter))
            setTimeout(() => {dispatch(actions.setIsSyncing(false))}, 10000)
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
        //TODO: This will eventually come from an endpoint
        const maxAmount = 15
        if(countCollectionItems(state.mortalCollectionItems) >= maxAmount && action == "add") return
        const foundEntry = Object.entries(state.collectionCache).find(([, collection]) =>
            collection[policy].some(item => item.assetRef === asset.assetRef)
        )

        if (foundEntry) {
            const [foundPage, foundCollection] = foundEntry
            const updatedCollection = updateCollection({ ...foundCollection }, policy, asset, action)
            dispatch(actions.addToCollectionCache({ page: Number(foundPage), collection: updatedCollection, hasMore: updatedCollection.hasMore }))

            if (state.collectionFilter.page === Number(foundPage)) {
                dispatch(CollectionThunks.getCollection({ ...state.collectionCache, [state.collectionFilter.page]: updatedCollection }, state.collectionFilter))
            }
        }

        const updatedMortalCollection = updateMortalCollection({ ...state.mortalCollectionItems }, policy, asset, action);
        dispatch(actions.setMortalCollection(updatedMortalCollection));  
    },

    getMortalCollectionLockedState: (): CollectionThunk => async (dispatch) => {
        const stateResult = await AccountApi.getMortalCollectionLockedState()
        if (stateResult.status === "ok") dispatch(actions.setMortalCollectionLocked(stateResult.locked))
        else dispatch(CollectionThunks.displayStatus({ ctype: "error", details: stateResult.reason }))
    },

    getWeeklyEarnings: (): CollectionThunk => async (dispatch) => {
        const stateResult = await AccountApi.getUserWeeklyPasiveEarnings()
        if (stateResult.status === "ok") dispatch(actions.setWeeklyEarnings(stateResult.weeklyEarnings))
        else dispatch(CollectionThunks.displayStatus({ ctype: "error", details: stateResult.reason }))
    },

    lockMortalCollection: (): CollectionThunk => async (dispatch, getState) => {
        const state = getState()
        const mortalColleciton = state.mortalCollectionItems
        const mortalCreatableAssets = Object.entries(mortalColleciton).reduce((acc, [_policyName, policyItems]) => {
            const policyAssets = policyItems.map((item) => {return {assetRef: item.assetRef, quantity: item.quantity}})
            acc.push(...policyAssets)
            return acc
        }, [] as CollectionAssets)
        const setResult = await AccountApi.setMortalCollection(mortalCreatableAssets)
        if(setResult.status !== "ok") return dispatch(CollectionThunks.displayStatus({ ctype: "error", details: setResult.reason }))
        const result = await AccountApi.lockMortalCollection()
        if (result.status === "ok"){
            dispatch(actions.setMortalCollectionLocked(true))
            dispatch(actions.setJustLocked(true))
            setTimeout(() => {dispatch(actions.setJustLocked(false))}, 500)
        }
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
const countCollectionItems = (collection: CollectionWithGameData): number => {
    return Object.entries(collection).reduce((total, [_policyName, policyItems]) =>
        total + policyItems.reduce((policyTotal, item) =>  policyTotal + Number(item.quantity), 0)
    , 0)
}
const updateCollection = (collection: CollectionWithUIMetada & {hasMore: boolean} , policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers", asset: MortalCollectible, action: "add" | "remove") => {
    const index = collection[policy].findIndex(item => item.assetRef === asset.assetRef)
    const newActive = collection[policy][index].mortalRealmsActive + (action === "add" ? 1 : -1)
    collection[policy] = [...collection[policy]]
    collection[policy][index] = { ...collection[policy][index], mortalRealmsActive: newActive }
    return collection
}

const updateMortalCollection = (mortalCollection: CollectionWithGameData, policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers", asset: MortalCollectible, action: "add" | "remove") => {
    const index = mortalCollection[policy].findIndex(item => item.assetRef === asset.assetRef)
    const updatedItems = [...mortalCollection[policy]]

    if (index !== -1) {
        const newQuantity = (Number(updatedItems[index].quantity) + (action === "add" ? 1 : -1)).toString()
        if (newQuantity === "0") updatedItems.splice(index, 1)
        else updatedItems[index] = { ...updatedItems[index], quantity: newQuantity }
    } 
    else if (action === "add") updatedItems.push({ ...asset, quantity: "1" })

    return { ...mortalCollection, [policy]: updatedItems };
}
