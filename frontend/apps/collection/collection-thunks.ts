import { v4 } from "uuid"
import { AccountApi, SupportedWallet, ExtractWalletResult } from "../account"
import { CollectionThunk, collectinState } from "./collection-state"
import { CollectionFilter, CollectionWithUIMetada } from "./collection-state-models"
import { Blockfrost, Lucid } from "lucid-cardano"
import { blockfrostApiKey, blockfrostUri, cardanoNetwork} from "../../setting"
import { isEmpty } from "../common"

const actions = collectinState.actions

export const CollectionThunks = {
    extractWalletApiAndStakeAddress: async (wallet: SupportedWallet ): Promise<ExtractWalletResult> => {
        const networkId = 
            wallet == "Nami" && window?.cardano?.nami ? await (await window?.cardano?.nami.enable()).getNetworkId() :
            wallet == "Eternl" && window?.cardano?.eternl ? await (await window?.cardano?.eternl.enable()).getNetworkId() :
            undefined

        const lucid = await Lucid.new(
            new Blockfrost(blockfrostUri, blockfrostApiKey), cardanoNetwork,
          );
        const walletApi = 
            wallet == "Nami" && window?.cardano?.nami ? lucid.selectWallet(await window.cardano.nami.enable()) :
            wallet == "Eternl" && window?.cardano?.eternl ?  lucid.selectWallet(await window.cardano.eternl.enable()) :
            undefined
        
  
        if (isEmpty(walletApi)) {
          return {status: "error", details: `${wallet}'s browser extension not found.`}
        }
        
        const walletNetwork = networkId == 1 ? "Mainnet" : "Preprod"

        if ( walletNetwork != cardanoNetwork) {
          return {status: "error", details: `${wallet} has to be on ${cardanoNetwork} but is configured on ${walletNetwork}.`}
        }
        const stakeAddress = await walletApi.wallet.rewardAddress();
        const address = await walletApi.wallet.address()
        if (isEmpty(stakeAddress))
            return {status: "error", details: `${wallet} does not have a reward address.`}
        const utxos = await walletApi.wallet.getUtxos()

        if (utxos.length <= 0) 
            return {status: "error", details: `${wallet} must have at least one transaction.`}

        return { status: "ok", walletApi, stakeAddress, address };
      },
      
    getCollection: (cache: Record<number, CollectionWithUIMetada>, filter: CollectionFilter): CollectionThunk => async (dispatch) => {
        if (cache[filter.page]) {
                dispatch(actions.setDisplayedCollection(cache[filter.page]))
          } 
        else {
            const result = await AccountApi.getUserCollectionWithMetadata(filter)
            if (result.status !== "ok") {
                dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
            } else {
                dispatch(actions.addToCollectionCache({page: filter.page, collection:result.collection, hasMore: result.hasMore}))
                dispatch(actions.setDisplayedCollection(result.collection))
            }
        }
    },

    syncCollection: (): CollectionThunk => async (dispatch, getState) => {
        const result = await AccountApi.syncCollection()
        if (result.status !== "ok") {
            dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
        } else {
            const state = getState()
            dispatch(CollectionThunks.clearCache())
            dispatch(CollectionThunks.getCollection({}, state.collectionFilter))
        }
    },

    getMortalCollection: (): CollectionThunk => async (dispatch) => {
        const result = await AccountApi.getUserMortalCollection()
        if (result.status !== "ok") {
            dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
        } else {
            dispatch(actions.setMortalCollection(result.collection))
        }
    },

    modifyMortalCollection: (assetRef: string, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"): CollectionThunk => async (dispatch, getState) => {
        const modifyResult = await AccountApi.modifyUserMortalCollection(assetRef, action)
        if (modifyResult.status !== "ok") return (actions.setCollectionFetchingState({ ctype: "error", details: modifyResult.reason }))
        const result = await AccountApi.getUserMortalCollection()
        if (result.status !== "ok") return dispatch(actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
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
            //const walletResult = await AccountApi.getWallet(supportedWallet)
            const walletResult = await CollectionThunks.extractWalletApiAndStakeAddress(supportedWallet)
            if(walletResult.status !== "ok") {return}
            const result = await AccountApi.grantCollection(walletResult.address)
            if (result.status !== "ok") return (actions.setCollectionFetchingState({ ctype: "error", details: result.reason }))
            const tx = walletResult.walletApi.fromTx(result.tx)
            const signedTx  = await tx.sign().complete()
            const serializedSignedTx = signedTx.toString()
            const signature = await AccountApi.submmitGrantColleciton(serializedSignedTx, traceId)
            const state = getState()
            dispatch(CollectionThunks.clearCache())
            dispatch(CollectionThunks.getCollection({}, state.collectionFilter))
        }catch(e: any){
            console.error(e)
        }
        }
    }
}