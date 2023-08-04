import { CollectionFilter } from "../collection/collection-state-models"
import { AccountBackend } from "./account-backend"
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
    }
}