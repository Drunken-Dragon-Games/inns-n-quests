import { QueryInterface, Sequelize } from "sequelize"
import { CollectionService, CollectionWithUIMetadataResult, GetCollectionResult, GetPassiveStakingInfoResult, SyncUserCollectionResult } from "./service-spec"

import path from "path"
import { Umzug } from "umzug"
import { AssetManagementService } from "../service-asset-management"
import { MetadataRegistry, WellKnownPolicies } from "../tools-assets"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { Collectible, CollectibleMetadata, CollectibleStakingInfo, Collection, CollectionFilter, CollectionPolicyNames, PartialMetadata, PolicyCollectibles, CollectionData, StoredMetadata, CollectibleContributionParameters } from "./models"
import { RandomDSL } from "./random-dsl/dsl"

import { IdentityService } from "../service-identity"
import * as rewardsDB from "./staking-rewards/rewards-db"
import * as recordsDB from "./staking-rewards/records-db"
import * as syncedAssets from "./state/assets-sync-db"
import { Records, Rewards } from "./staking-rewards/dsl"
import {SyncedAssets, relevantPolicies, SyncedMortalAssets} from "./state/dsl"
import { Calendar } from "../tools-utils/calendar"

export type CollectionServiceDependencies = {
    database: Sequelize
    assetManagementService: AssetManagementService,
    identityService: IdentityService,
    wellKnownPolicies: WellKnownPolicies
    metadataRegistry: MetadataRegistry,
    calendar: Calendar
}

export type CollectionServiceConfig = {
}

const toAssetCollection = (dbAssets: syncedAssets.SyncedAsset[]): Collection<{}> =>{
    const emptyCollection: Collection<{}> = {pixelTiles: [], grandMasterAdventurers: [], adventurersOfThiolden: []}
    return dbAssets.reduce((acc, asset) => {
        acc[asset.policyName].push({assetRef: asset.assetRef, quantity: asset.quantity, type: asset.type})
        return acc
    }, emptyCollection)
}

const toMetadataAssetCollection  = (dbAssets: syncedAssets.SyncedAsset[]): Collection<StoredMetadata> =>{
    const emptyCollection: Collection<StoredMetadata> = {pixelTiles: [], grandMasterAdventurers: [], adventurersOfThiolden: []}
    return dbAssets.reduce((acc, asset) => {
        acc[asset.policyName].push({assetRef: asset.assetRef, quantity: asset.quantity, type: asset.type,
             class: asset.class, ath: asset.ath, int: asset.int, cha: asset.cha})
        return acc
    }, emptyCollection)
}

export class CollectionServiceDsl implements CollectionService {

    private readonly migrator: Umzug<QueryInterface>
    private readonly rewards: Rewards
    private readonly records: Records
    private readonly syncedAssets: SyncedAssets
    constructor(
        private readonly database: Sequelize,
        private readonly assetManagementService: AssetManagementService,
        private readonly identityService: IdentityService,
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly metadataRegistry: MetadataRegistry,
        calendar: Calendar,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
        this.rewards = new Rewards(calendar)
        this.records = new Records(calendar)
        this.syncedAssets = new SyncedAssets(wellKnownPolicies, metadataRegistry)
    }

    static async loadFromEnv(dependencies: CollectionServiceDependencies): Promise<CollectionServiceDsl> {
        return CollectionServiceDsl.loadFromConfig({}, dependencies)
    }

    static async loadFromConfig(config: CollectionServiceConfig, dependencies: CollectionServiceDependencies): Promise<CollectionServiceDsl> {
        const service = new CollectionServiceDsl(
            dependencies.database,
            dependencies.assetManagementService,
            dependencies.identityService,
            dependencies.wellKnownPolicies,
            dependencies.metadataRegistry,
            dependencies.calendar,
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        rewardsDB.configureSequelizeModel(this.database)
        recordsDB.configureSequelizeModel(this.database)
        syncedAssets.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
        await this.database.close()
    }

    /**
     * Returns the collection with each asset's quantity and no extra information.
     * Intended to be used on other services like the idle-quests-service.
     */
    async getCollection(userId: string, filter?: CollectionFilter, pageSize?: number, logger?: LoggingContext): Promise<GetCollectionResult<{}>> {
        const dbAssets = await this.syncedAssets.getSyncedAssets(userId,filter,pageSize)
        const collection = toAssetCollection (dbAssets.assets)
        return {ctype: "success",  collection: collection}
    }

    private async getMetadataCollection(userId: string, filter?: CollectionFilter, pageSize?: number, logger?: LoggingContext): Promise<GetCollectionResult<StoredMetadata> & {hasMore: boolean}> {
        const dbAssets = await this.syncedAssets.getSyncedAssets(userId, filter, pageSize)
        const collection = toMetadataAssetCollection (dbAssets.assets)
        return {ctype: "success",  collection, hasMore: dbAssets.hasMore}
    }


    /**
     * Returns the collection with each asset's weekly contributions to the player's passive staking.
     * Intended to be used on the collection UI.
     */
    async getCollectionWithUIMetadata(userData: CollectionData, pageSize?: number, logger?: LoggingContext): Promise<CollectionWithUIMetadataResult> {
        const collectionResult:GetCollectionResult<StoredMetadata> & {hasMore: boolean} = userData.ctype === "collection"
        ? {ctype: "success", collection: userData.collection, hasMore: false}
        : await this.getMetadataCollection(userData.userId,userData.filter, pageSize ,logger)
        
        if (collectionResult.ctype !== "success") return collectionResult
        const metadataCollection = await this.hydrateCollectionWithMetadata(collectionResult.collection, userData.userId)
        const stakingCollection = this.calculateCollectionWeeklyReward(metadataCollection)
        return {ctype: "success", collection: stakingCollection, hasMore: collectionResult.hasMore}
    }

    /**
     * Intended to be displayed on the user's collection UI.
     */
    async getPassiveStakingInfo(userId: string, logger?: LoggingContext): Promise<GetPassiveStakingInfoResult> {
        const assetList = await this.assetManagementService.list(userId, { policies: [this.wellKnownPolicies.dragonSilver.policyId] }, logger)
        if (assetList.status != "ok") return {ctype: "failure", error: "unknown user"}
        const invDragonSilver = assetList.inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const dragonSilver = invDragonSilver?.find(a => a.chain)?.quantity ?? "0"
        const dragonSilverToClaim = invDragonSilver?.find(a => !a.chain)?.quantity ?? "0"
        const weeklyAccumulated = (await this.rewards.getWeeklyAccumulated(userId)).toFixed(1)
        return {ctype: "success", weeklyAccumulated, dragonSilverToClaim, dragonSilver}

    }

    /**
     * Resyncs everyone's collection and adds the daily contributions to their passive staking.
     * Intended to be called once a day.
     * Important: idempotent operation.
     */
    async updateGlobalDailyStakingContributions(logger?: LoggingContext): Promise<void> {
        logger?.log.info(`Syncing all users collections`)
        const dailyRecord = await this.records.createDaily()
        if (dailyRecord.ctype !== "success") {
            logger?.log.error(`Failed to create daily record because: ${dailyRecord.error}`)
            return
        }
        const userIds = await this.identityService.listAllUserIds(logger)
        const dailyRewards = await Promise.all(userIds.map(async (userId) => {
            const userCollection = await this.syncUserCollection(userId, logger)

            if(userCollection.ctype !== "success"){
                logger?.log.error(`Sync User Collection returned: ${userCollection.error}`)
                await this.rewards.createDaily(userId, `pending because Sync User Collection returned: ${userCollection.error}`)
                return 0
            }
            else{
                const rewardRecord = await this.rewards.createDaily(userId)
                if (rewardRecord.ctype !== "success") {
                    logger?.log.error(`Failed to create daily reward record becaouse: ${rewardRecord.error}.`)
                    return 0
                }
                const stakingCollection = this.calculateCollectionWeeklyReward(userCollection.collection)
                const dailyReward = Object.entries(stakingCollection).reduce((acc, [policyName, collectibles]) => {
                    return acc + collectibles.reduce((acc, collectible) => {
                        return acc + (Math.round(collectible.stakingContribution * 10 / 7) / 10)
                    }, 0)
                }, 0)
                await this.rewards.completeDaily(userId, dailyReward.toString())
                return dailyReward
            }
        }))
    
        const dailyRewardTotal = dailyRewards.reduce((acc, reward) => acc + reward, 0)
        await this.records.completeDaily(dailyRewardTotal.toString())
    }
    

    /**
     * Grants the weekly contributions to everyone's dragon silver to claim.
     * Intended to be called once a week to give the grants for the previus week.
     * Important: idempotent operation.
     */
    async grantGlobalWeeklyStakingGrant(logger?: LoggingContext): Promise<void> {
        logger?.log.info(`Granting weekly rewards`)
        const weeklyRecord = await this.records.createWeekly()
        if (weeklyRecord.ctype !== "success") {
            logger?.log.error(`Failed to create daily record beaocuse: ${weeklyRecord.error}`)
            return
        }

        //this can be refectored to use a single reduce statment
        //but aparently thats not such a great idea
        //https://stackoverflow.com/questions/41243468/javascript-array-reduce-with-async-await
        const pendingRewards = await this.rewards.getPreviusWeekTotals()
        
        let totalGranted = 0
        for (const [userId, reward] of Object.entries(pendingRewards)) {
            const grantRecord = await this.rewards.createWeekly(userId)
            if (grantRecord.ctype !== "success") continue
            await this.assetManagementService.grant(userId, {
                policyId: this.wellKnownPolicies.dragonSilver.policyId,
                unit: "DragonSilver",
                quantity: reward.toString()
            })
            totalGranted += reward
            this.rewards.completeWeekly(userId, reward.toString())
        }
        console.log({totalGranted})
        await this.records.completeWeekly(totalGranted.toString())
    }

    async syncUserCollection(userId: string, logger?: LoggingContext): Promise<SyncUserCollectionResult>{
        const options = {chain: true, policies: relevantPolicies.map(policy => this.wellKnownPolicies[policy].policyId)}
        const assetList = await this.assetManagementService.list(userId, options, logger)
        if (assetList.status !== "ok") return {ctype: "failure", error: assetList.status}
        const { syncedAssetChanges, fullCollection } = await this.syncedAssets.determineUpdates(userId, assetList.inventory)
        await this.syncedAssets.updateDatabase(syncedAssetChanges, this.database, logger)
        return {ctype: "success", collection: fullCollection }
    }

    /**
     * Returns the collection which currently can be used in the Mortal Realms.
     */
    async getMortalCollection(userId: string, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleMetadata>> {
        const dbAssets = await SyncedMortalAssets.getSyncedAssets(userId)
        const basicCollection = toMetadataAssetCollection (dbAssets)
        const collection = await this.hydrateCollectionWithMetadata(basicCollection, userId)
        return {ctype: "success", collection}
    }

    /**
     * Picks a collectible to be used in the Mortal Realms.
     */
    async addMortalCollectible(userId: string, assetRef: string, logger?: LoggingContext): Promise<SResult<{}>> {
        if(this.mortalCollectionLocked(userId)) return {ctype: "failure", error: `Could not Add asset as Mortal Collection is currently locked`}
        const assetResult = await this.syncedAssets.getAsset(userId, assetRef)
        if (assetResult.ctype !== "success") return {ctype: "failure", error: `Could not Add asset ${assetResult.error}`}
        const addResult = await SyncedMortalAssets.addAsset(userId, assetResult.asset)
        if (addResult.ctype !== "success") return {ctype: "failure", error: `Could not Add asset ${addResult.error}`}
        return addResult
    }

    /**
     * Removes a collectible from the Mortal Realms.
     */
    async removeMortalCollectible(userId: string, assetRef: string, logger?: LoggingContext): Promise<SResult<{}>> {
        if(this.mortalCollectionLocked(userId)) return {ctype: "failure", error: `Could not remove asset as Mortal Collection is currently locked`}
        return SyncedMortalAssets.removeAsset(userId, assetRef)
    }

    private async hydrateCollectionWithMetadata(assets: Collection<StoredMetadata>, userId: string): Promise<Collection<CollectibleMetadata>> {
        const newCollection: Collection<CollectibleMetadata> = {
            pixelTiles: [],
            adventurersOfThiolden: [],
            grandMasterAdventurers: [],
        }
        //again this used to be a reduce but since i am using the await the for loop is better
        for (const [collectionName, collectibleArray] of Object.entries(assets)) {
            const metadataArray: PolicyCollectibles<CollectibleMetadata> = []
            for (const collectible of collectibleArray) {
                const partialMetadata = this.formatMetadata(collectible.assetRef, collectionName as keyof Collection<{}>, collectible.type)
                const metadata: CollectibleMetadata = {
                    aps: [collectible.ath, collectible.int, collectible.cha],
                    class: collectible.class,
                    mortalRealmsActive: await SyncedMortalAssets.getActive(userId, collectible.assetRef),
                    ...partialMetadata
                }
                const uiCollectible: Collectible = {assetRef: collectible.assetRef, quantity: collectible.quantity, type: collectible.type}
                metadataArray.push({...uiCollectible, ...metadata})
            }
            newCollection[collectionName as keyof Collection<CollectibleMetadata>] = metadataArray
        }
    
        return newCollection;
    }

    private calculateCollectionWeeklyReward<A extends object>(assets: Collection<A>): Collection< A & CollectibleStakingInfo> {
        return Object.entries(assets).reduce((acc, [collectionName, collectibleArray]) => {
            const stakingArray: PolicyCollectibles< A & CollectibleStakingInfo> = collectibleArray.map((collectible) => {
                const stakingParameters = this.syncedAssets.getStakingParameters(collectionName as typeof relevantPolicies[number], collectible.assetRef)
                const stakingInfo = this.calculateCollectibleWeeklyReward(stakingParameters, collectible.quantity)
                return {...collectible, ...stakingInfo}
            })
            return {...acc, ...{[collectionName]: stakingArray}}
        }, {} as Collection< A & CollectibleStakingInfo>)

    }

    private formatMetadata(assetRef: string, collection: typeof relevantPolicies[number], assetType: "Character" | "Furniture"): PartialMetadata{

        switch (collection) {
            case "pixelTiles":{
                 const name = this.metadataRegistry.pixelTilesMetadata[assetRef].name
                 const miniature = assetType === "Furniture" 
                    ? `https://cdn.ddu.gg/pixeltiles/x4/${assetRef}.png`
                    : parseNonFurniturePixelTile(name)
     
                 return {
                    name, miniature,
                    splashArt: `https://cdn.ddu.gg/pixeltiles/xl/${assetRef}.png`
                 }
            }
            case "grandMasterAdventurers":{
                return {
                    name: this.metadataRegistry.gmasMetadata[assetRef].name,
                    splashArt: `https://cdn.ddu.gg/gmas/xl/${assetRef}.gif`,
                    miniature: `https://cdn.ddu.gg/gmas/x3/${assetRef}.png`,
                }
            }
            case "adventurersOfThiolden": {
                const {miniature, splashArt, adventurerName} = this.advOfThioldenSprites(assetRef)
                return {
                    name: `${adventurerName} ${this.metadataRegistry.advOfThioldenGameMetadata[adventurerName].Title}`,
                    splashArt,
                    miniature
                }
            }
        }
    }

    private advOfThioldenSprites = (assetRef: string): {miniature: string, splashArt: string, adventurerName: string,} => {
        const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
        const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
        const chromaOrPlain = this.metadataRegistry.advOfThioldenAppMetadata[idx].chr ? "chroma" : "plain"
        const finalName = (adventurerName == "avva" ? (Math.floor(Math.random() * 2) == 0 ? "avva_fire" : "avva_ice") : adventurerName)
            .replace("'", "")
        const aps = 
            this.metadataRegistry.advOfThioldenAppMetadata[idx].ath + 
            this.metadataRegistry.advOfThioldenAppMetadata[idx].int + 
            this.metadataRegistry.advOfThioldenAppMetadata[idx].cha
        return {
            miniature:`https://cdn.ddu.gg/adv-of-thiolden/x6/${finalName}-front-${chromaOrPlain}.png`,
            splashArt: `https://cdn.ddu.gg/adv-of-thiolden/web/${finalName}_${aps}_${chromaOrPlain == "chroma" ? 1 : 0}.${chromaOrPlain == "chroma" || finalName =="rei" || finalName == "thelas" || finalName == "arin" ? "mp4" : "webp"}`,
            adventurerName,
        }
    }

    private calculateCollectibleWeeklyReward( parameters: CollectibleContributionParameters, quantity: string): CollectibleStakingInfo{
        const getSingleReward = () => {if(parameters.collection === "pixelTiles"){
            const rarityContributionMap = {
                "Common": 1,
                "Uncommon": 1,
                "Rare": 2,
                "Epic": 4,
                "Legendary": 5,
                "Unique": 5
            }
            return rarityContributionMap[parameters.rarity] 
        }
        else if(parameters.collection === "grandMasterAdventurers"){
            const sumContributionMap: Record<number, number> = {
                2:2, 3:2, 4:2, 5:2, 6:3, 7:4, 8:5, 9:6, 10:7
            }
            const baseContribution = sumContributionMap[parameters.AWSum] ?? 0

            const bonusContributionMap: Record<string, number> = {
                "Human": 1,
                "Elf": 1,
                "Tiefling:Laigt'an": 2,
                "Tiefling:Outcast": 2,
                "Tiefling:Kulthul": 3,
                "Tiefling:Arc'an": 3,
                "Troll:Forest Troll": 3,
                "Troll:Maiztlanian": 3,
                "Troll:Uztec Empire": 4,
                "Worgenkin:Shadowlands Pack": 3,
                "Worgenkin:Woodlans Pack": 4,
                "Worgenkin:Northen Mountains Pack": 4,
                "Dragonkin:Firewing": 3,
                "Dragonkin:Thunderwing": 4,
                "Dragonkin:Frostwing": 4,
                "Vulkin:Slykin":4,
                "Vulkin:Frostkin":5,
                "Orc:Bloodfang Clan":4,
                "Orc:Plain Walker":6,
                "Undead:Rotten":7,
                "Undead:Forgotten":9,
                "Tauren:Eagle Spear Tribe": 9,
                "Viera:Empire": 10
            }

            const keyWithSubrace = `${parameters.race}:${parameters.subrace}`
            const bonusContribution = bonusContributionMap[keyWithSubrace] 
                || bonusContributionMap[parameters.race] 
                || 0
                return baseContribution + bonusContribution
        }
        else if(parameters.collection === "adventurersOfThiolden"){
            const baseContribution = 
                parameters.APSSum < 8 ? 1 :
                parameters.APSSum < 11 ? 2 :
                parameters.APSSum < 15 ? 3:
                parameters.APSSum < 20 ? 4:
                parameters.APSSum < 25 ? 5:
                parameters.APSSum < 30 ? 6:
                parameters.APSSum < 32 ? 7: 8
            const bonusContributionMap: Record<string, number> = {
                "Vilnay":1,
                "Auristar":2,
                "Kullmyr":3,
                "Jagermyr":5,
                "Nurmyr":6,
                "Adventurer of the East":7,
                "The Dead Queen": 10,
                "Adventurer of the Drunken Dragon": 12
            }

            const bonusContribution = bonusContributionMap[parameters.faction] || 0
            return baseContribution + bonusContribution
        }

        return 0
    }
        const singleReward = getSingleReward()
        return {stakingContribution: singleReward * Number(quantity)}
    }

    private mortalCollectionLocked(userId: string): boolean {
        //TODO: decide conditions for locking collection
        return false
    }
}

const parseNonFurniturePixelTile = (name: string) => {
    const regex = /PixelTile\s+#(\d+)\s+(.+)/
    const match = name.match(regex)

    if (!match) throw new Error(`Invalid PixelTile string: ${name}`)
    const [, num, keyWords] = match
    
    return `https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_${num}.png`
  }