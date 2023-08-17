import { CollectionFilter } from "../collection/collection-state-models"
import { AccountBackend } from "./account-backend"
import { SupportedWallet } from "./account-dsl"
import { AccountTransitions } from "./account-transitions"

export const AccountApi = {

    signed(): boolean {
        return AccountTransitions.signed()
    },

    /**
     * Refreshes the current session if and only if the session token is saved in the browser's local storage.
     */
    useRefreshSession(callback?: (signed: boolean) => void): void {
        AccountTransitions.useRefreshSession(callback)
    },

    getUserCollectionWithMetadata(filter?: CollectionFilter){
        return AccountBackend.getUserCollectionWIthMetadata(filter)
    },

    getUserMortalCollection(){
        return AccountBackend.getUserMortalCollection()
    },

    modifyUserMortalCollection(assetRef: string, action: "add" | "remove"){
        return AccountBackend.modifyMortalCollection(assetRef, action)
    },

    syncCollection(){
        return AccountBackend.syncUserCollection()
    },

    grantCollection(address: string){
        return AccountBackend.grantCollection(address)
    },

    submmitGrantColleciton(serializedSignedTx: string, traceId: string){
        return AccountBackend.collectionGrantSubmmit(serializedSignedTx, traceId)
    },

    getWallet(supportedWallet: SupportedWallet){
        return AccountTransitions.getWallet(supportedWallet)
    }
}