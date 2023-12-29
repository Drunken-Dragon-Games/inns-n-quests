import { CollectionFilter } from "../collection/collection-state-models"
import { AccountBackend, CollectionAssets } from "./account-backend"
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

    getUserCollectionWithMetadata(pageSize: number, filter?: CollectionFilter){
        return AccountBackend.getUserCollectionWIthMetadata(pageSize, filter)
    },

    getUserMortalCollection(){
        return AccountBackend.getUserMortalCollection()
    },

    getMortalCollectionLockedState(){
        return AccountBackend.getMortalLockState()
    },

    getUserWeeklyPasiveEarnings(){
        return AccountBackend.getUserWeeklyPasiveEarnings()
    },

    setMortalCollection(assets: CollectionAssets){
        return AccountBackend.setMortalCollection(assets)
    },

    lockMortalCollection(){
        return AccountBackend.lockMortalCollection()
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
    },

    orderAOT(address: string, quantity: string, traceId: string){
        return AccountBackend.orderAOT(address, quantity, traceId)
    },

    submitAotOrder(orderId: string, serializedSignedTx: string, traceId: string){
        return AccountBackend.submitAotOrder(orderId, serializedSignedTx, traceId)
    },

    checkAotOrderStatus(orderId: string, traceId: string){
        return AccountBackend.checkAotOrderStatus(orderId, traceId)
    }
}