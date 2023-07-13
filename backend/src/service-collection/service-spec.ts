import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { CollectibleMetadata, CollectibleStakingInfo, Collection, CollectionFilter } from "./models"

export interface CollectionService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    closeDatabaseConnection(): Promise<void>

    /**
     * Returns the collection with each asset's quantity and no extra information.
     * Intended to be used on other services like the idle-quests-service.
     */
    getCollection(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<Unit>>

    /**
     * Returns the collection with each asset's weekly contributions to the player's passive staking.
     * Intended to be used on the collection UI.
     */
    getCollectionWithUIMetadata(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleStakingInfo & CollectibleMetadata>>

    /**
     * Intended to be displayed on the user's collection UI.
     */
    getPassiveStakingInfo(userId: string, logger?: LoggingContext): Promise<GetPassiveStakingInfoResult>

    /**
     * Resyncs everyone's collection and adds the daily contributions to their passive staking.
     * Intended to be called once a day.
     * Important: idempotent operation.
     */
    updateGlobalDailyStakingContributions(logger?: LoggingContext): Promise<void>

    /**
     * Grants the weekly contributions to everyone's dragon silver to claim.
     * Intended to be called once a week after the daily contribution of that day.
     * Important: idempotent operation.
     */
    grantGlobalWeeklyStakingGrant(logger?: LoggingContext): Promise<void>

    /**
     * Returns the collection which currently can be used in the Mortal Realms.
     */
    getMortalCollection(userId: string, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleMetadata>>

    /**
     * Picks a collectible to be used in the Mortal Realms.
     */
    addMortalCollectible(userId: string, assetRef: string, logger?: LoggingContext): Promise<SResult<{}>>

    /**
     * Removes a collectible from the Mortal Realms.
     */
    removeMortalCollectible(userId: string, assetRef: string, logger?: LoggingContext): Promise<SResult<{}>>
}

export type GetCollectionResult<A extends object> = SResult<{ 
    collection: Collection<A> 
}>

export type GetPassiveStakingInfoResult = SResult<{ 
    weeklyAccumulated: string, 
    dragonSilverToClaim: string, 
    dragonSilver: string 
}>
