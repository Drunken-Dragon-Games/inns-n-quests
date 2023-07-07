import { QueryInterface, Sequelize } from "sequelize"
import { CollectionService, GetCollectionResult, GetPassiveStakingInfoResult } from "./service-spec"

import path from "path"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { CollectionFilter, CollectibleStakingInfo, CollectibleMetadata } from "./models"

export type CollectionServiceDependencies = {
    database: Sequelize,
}

export type CollectionServiceConfig = {
}

export class CollectionServiceDsl implements CollectionService {

    private readonly migrator: Umzug<QueryInterface>

    constructor(
        private readonly database: Sequelize,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: CollectionServiceDependencies): Promise<CollectionServiceDsl> {
        return CollectionServiceDsl.loadFromConfig({}, dependencies)
    }

    static async loadFromConfig(config: CollectionServiceConfig, dependencies: CollectionServiceDependencies): Promise<CollectionServiceDsl> {
        const service = new CollectionServiceDsl(
            dependencies.database, 
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        //leaderboardDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
    }

    /**
     * Returns the collection with each asset's quantity and no extra information.
     * Intended to be used on other services like the idle-quests-service.
     */
    getCollection(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<Unit>> {
        throw new Error("Method not implemented.")
    }

    /**
     * Returns the collection with each asset's weekly contributions to the player's passive staking.
     * Intended to be used on the collection UI.
     */
    getCollectionWithUIMetadata(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleStakingInfo & CollectibleMetadata>> {
        throw new Error("Method not implemented.")
    }

    /**
     * Intended to be displayed on the user's collection UI.
     */
    getPassiveStakingInfo(userId: string, logger?: LoggingContext): Promise<GetPassiveStakingInfoResult> {
        throw new Error("Method not implemented.")
    }

    /**
     * Resyncs everyone's collection and adds the daily contributions to their passive staking.
     * Intended to be called once a day.
     * Important: idempotent operation.
     */
    updateGlobalDailyStakingContributions(logger?: LoggingContext): Promise<void> {
        throw new Error("Method not implemented.")
    }

    /**
     * Grants the weekly contributions to everyone's dragon silver to claim.
     * Intended to be called once a week after the daily contribution of that day.
     * Important: idempotent operation.
     */
    grantGlobalWeeklyStakingGrant(logger?: LoggingContext): Promise<void> {
        throw new Error("Method not implemented.")
    }

    /**
     * Returns the collection which currently can be used in the Mortal Realms.
     */
    getMortalCollection(userId: string, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleMetadata>> {
        throw new Error("Method not implemented.")
    }

    /**
     * Picks a collectible to be used in the Mortal Realms.
     */
    addMortalCollectible(userId: string, assetRef: string, logger?: LoggingContext): Promise<SResult<{}>> {
        throw new Error("Method not implemented.")
    }

    /**
     * Removes a collectible from the Mortal Realms.
     */
    removeMortalCollectible(userId: string, assetRef: string, logger?: LoggingContext): Promise<SResult<{}>> {
        throw new Error("Method not implemented.")
    }
}