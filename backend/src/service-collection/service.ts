import { QueryInterface, Sequelize } from "sequelize"
import { CollectionService, GetCollectionResult, GetPassiveStakingInfoResult } from "./service-spec"

import path from "path"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { CollectionFilter, CollectibleStakingInfo, CollectibleMetadata, CollectionPolicyNames } from "./models"
import { AssetManagementService } from "../service-asset-management"
import { MetadataRegistry, WellKnownPolicies } from "../tools-assets"
import {Collection} from "./models"

export type CollectionServiceDependencies = {
    database: Sequelize
    assetManagementService: AssetManagementService
    wellKnownPolicies: WellKnownPolicies
    metadataRegistry: MetadataRegistry
}

export type CollectionServiceConfig = {
}

export class CollectionServiceDsl implements CollectionService {

    private readonly migrator: Umzug<QueryInterface>

    constructor(
        private readonly database: Sequelize,
        private readonly assetManagementService: AssetManagementService,
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly metadataRegistry: MetadataRegistry,
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
            dependencies.assetManagementService,
            dependencies.wellKnownPolicies,
            dependencies.metadataRegistry
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
    async getCollection(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<Unit>> {
        const relevantPolicies = ["pixelTiles", "adventurersOfThiolden", "grandMasterAdventurers"] as const
        const policyIndexMapper: Record<CollectionPolicyNames, typeof relevantPolicies[number]> = {
                "pixel-tiles": "pixelTiles",
                "adventurers-of-thiolden": "adventurersOfThiolden",
                "grandmaster-adventurers": "grandMasterAdventurers"
            }
            
        const { policy, page } = filter || {}
        const options = {
            page,
            policies: policy ? [this.wellKnownPolicies[policyIndexMapper[policy]].policyId] : relevantPolicies.map(policy => this.wellKnownPolicies[policy].policyId)
        }

        const assetList = await this.assetManagementService.list(userId, {chain: true, ...options}, logger)

        if (assetList.status !== "ok") return {ctype: "failure", error:assetList.status }
        
        const getCollectionType = (policyId: string, assetUnit: string) => {
            if(policyId === this.wellKnownPolicies.pixelTiles.policyId){
                const metadataType = this.metadataRegistry.pixelTilesMetadata[assetUnit].type
                return metadataType == "Adventurer" || metadataType == "Monster" || metadataType == "Townsfolk" ? "Character" : "Furniture"
            }
            return "Character"
        }

        const processAssets = (policyId: string, assets: any) => 
        assets.map((asset: any) => ({
            assetRef: asset.unit,
            quantity: asset.quantity,
            type: getCollectionType(policyId, asset.unit)
        }))

        const collection: Collection<{}> = relevantPolicies.reduce((acc, policy) => {
            const policyId = this.wellKnownPolicies[policy].policyId
            const assets = assetList.inventory[policyId]
            if(assets)return {...acc,[policy]: processAssets(policyId, assets)}
            return acc
        }, {} as Collection<{}>)

          return {ctype: "success", collection}
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