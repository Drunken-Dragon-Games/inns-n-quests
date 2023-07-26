import { QueryInterface, Sequelize } from "sequelize"
import { CollectionService, GetCollectionResult, GetPassiveStakingInfoResult, SyncUserCollectionResult } from "./service-spec"

import path from "path"
import { Umzug } from "umzug"
import { AssetManagementService } from "../service-asset-management"
import { MetadataRegistry, WellKnownPolicies } from "../tools-assets"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { Collectible, CollectibleMetadata, CollectibleStakingInfo, Collection, CollectionFilter, CollectionPolicyNames, PartialMetadata, PolicyCollectibles, collectionData } from "./models"
import { RandomDSL } from "./random-dsl/dsl"

import { IdentityService } from "../service-identity"
import * as rewardsDB from "./staking-rewards/rewards-db"
import * as recordsDB from "./staking-rewards/records-db"
import * as syncedAssets from "./state/assets-sync-db"
import { Records, Rewards } from "./staking-rewards/dsl"
import {SyncedAssets, relevantPolicies} from "./state/dsl"
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
    async getCollection(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<Unit>> {
        const emptyCollection: Collection<{}> = {pixelTiles: [], grandMasterAdventurers: [], adventurersOfThiolden: []}
        const dbAssets = await this.syncedAssets.getSyncedAssets(userId)
        console.log(`get collection got from synced assets`)
        console.log(JSON.stringify(dbAssets, null, 4))

        const collection: Collection<{}> = dbAssets.reduce((acc, asset) => {
            acc[asset.policyName].push({assetRef: asset.assetRef, quantity: asset.quantity, type: asset.type})
            return acc
        }, emptyCollection)

          return {ctype: "success", collection}
    }

    /**
     * Returns the collection with each asset's weekly contributions to the player's passive staking.
     * Intended to be used on the collection UI.
     */
    async getCollectionWithUIMetadata(userData: collectionData, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleStakingInfo & CollectibleMetadata>> {
        const collectionResult:GetCollectionResult<Unit>  = userData.ctype === "collection"
        ? {ctype: "success", collection: userData.collection}
        : await this.getCollection(userData.userId, userData.filter, logger)
        
        if (collectionResult.ctype !== "success") return collectionResult
        const metadataCollection = this.hydrateCollectionWithMetadata(collectionResult.collection)
        const stakingCollection = this.calculateCollectionDailyReward(metadataCollection)
        return {ctype: "success", collection: stakingCollection}
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
        const weeklyAccumulated = (await this.rewards.getWeeklyAccumulated(userId)).toString()
        return {ctype: "success", weeklyAccumulated, dragonSilverToClaim, dragonSilver}

    }

    /**
     * Resyncs everyone's collection and adds the daily contributions to their passive staking.
     * Intended to be called once a day.
     * Important: idempotent operation.
     */
    async updateGlobalDailyStakingContributions(logger?: LoggingContext): Promise<void> {
        const dailyRecord = await this.records.createDaily()
        if (dailyRecord.ctype !== "success") {
            logger?.log.error(`Failed to create daily record because: ${dailyRecord.error}`)
            return
        }
        const userIds = await this.identityService.listAllUserIds(logger)
        const dailyRewards = await Promise.all(userIds.map(async (userId) => {
            const userCollection = await this.syncUserCollection(userId, logger)
            //TODO: i need to think how am i going to hanlde this properly
            if(userCollection.ctype !== "success"){
                logger?.log.error(`Sync User Collectionreturned: ${userCollection.error}`)
                await this.rewards.createDaily(userId, `pending because Sync User Collection returned: ${userCollection.error}`)
                return 0
            }
            // Depending on how we decide to calculate the weekly earning this might be greatly optimized by not needing the metadata
            const collection = await this.getCollectionWithUIMetadata({ctype: "collection", collection: userCollection.collection})
            if (collection.ctype !== "success"){
                logger?.log.error(`Getting collection returned: ${collection.error}`)
                await this.rewards.createDaily(userId, `pending because collection returned: ${collection.error}`)
                return 0
            }
            else{
                const rewardRecord = await this.rewards.createDaily(userId)
                if (rewardRecord.ctype !== "success") {
                    logger?.log.error(`Failed to create daily reward record becaouse: ${rewardRecord.error}.`)
                    return 0
                }
                const dailyReward = Object.entries(collection.collection).reduce((acc, [_policyName, collectibles]) => {
                    return acc + collectibles.reduce((acc, collectible) => {return acc + collectible.stakingContribution}, 0)
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

    private hydrateCollectionWithMetadata(assets: Collection<{}>): Collection<CollectibleMetadata> {
        return Object.entries(assets).reduce((acc, [collectionName, collectibleArray]) => {
            const metadataArray: PolicyCollectibles<CollectibleMetadata> = collectibleArray.map((colletible) => {
                const partialMetadata = this.formatMetadata(colletible.assetRef, collectionName as typeof relevantPolicies[number], colletible.type)
                const metadata: CollectibleMetadata = {
                    aps: this.getCollectibleAPS(colletible.assetRef, collectionName as typeof relevantPolicies[number]),
                    ...partialMetadata
                }
                return {...colletible, ...metadata}
            })
            return {...acc, ...{[collectionName]: metadataArray}}
        }, {} as Collection<CollectibleMetadata>)
    }

    private calculateCollectionDailyReward(assets: Collection<CollectibleMetadata>): Collection<CollectibleStakingInfo & CollectibleMetadata> {
        return Object.entries(assets).reduce((acc, [collectionName, collectibleArray]) => {
            const stakingArray: PolicyCollectibles<CollectibleStakingInfo & CollectibleMetadata> = collectibleArray.map((collectible) => {
                const stakingInfo = this.calculateCollectibleDailyReward(collectionName as typeof relevantPolicies[number], collectible.type, collectible.aps)
                return {...collectible, ...stakingInfo}
            })
            return {...acc, ...{[collectionName]: stakingArray}}
        }, {} as Collection<CollectibleStakingInfo & CollectibleMetadata>)

    }

    private formatMetadata(assetRef: string, collection: typeof relevantPolicies[number], assetType: "Character" | "Furniture"): PartialMetadata{

        switch (collection) {
            case "pixelTiles":{
                 const name = this.metadataRegistry.pixelTilesMetadata[assetRef].name
                 const { miniature, assetClass } = assetType === "Furniture" 
                    ? { miniature: `https://cdn.ddu.gg/pixeltiles/x4/${assetRef}.png`, assetClass: "furniture" }
                    : parseNonFurniturePixelTile(name)
     
                 return {
                    name, miniature,
                    splashArt: `https://cdn.ddu.gg/pixeltiles/xl/${assetRef}.png`,
                    class: assetClass,
                    mortalRealmsActive: 0
                 }
            }
            case "grandMasterAdventurers":{
                return {
                    name: this.metadataRegistry.gmasMetadata[assetRef].name,
                    splashArt: `https://cdn.ddu.gg/gmas/xl/${assetRef}.gif`,
                    miniature: `https://cdn.ddu.gg/gmas/x3/${assetRef}.png`,
                    class: this.metadataRegistry.gmasMetadata[assetRef].class,
                    mortalRealmsActive: 0
                }
            }
            case "adventurersOfThiolden": {
                const {miniature, splashArt, adventurerName} = this.advOfThioldenSprites(assetRef)
                return {
                    name: `${adventurerName} ${this.metadataRegistry.advOfThioldenGameMetadata[adventurerName].Title}`,
                    splashArt,
                    miniature,
                    class: this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"],
                    mortalRealmsActive: 0
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

    private getCollectibleAPS(assetRef: string, collection: typeof relevantPolicies[number]):[number, number, number] {
        switch (collection) {
            case "pixelTiles": switch (this.metadataRegistry.pixelTilesMetadata[assetRef].rarity) {
                case "Common": return [2,2,2]
                case "Uncommon": return [4,4,4]
                case "Rare": return [6,6,6]
                case "Epic": return [8,8,8]
                default: return [10,10,10]
            }
            case "grandMasterAdventurers":
                const armor = parseInt(this.metadataRegistry.gmasMetadata[assetRef].armor)
                const weapon = parseInt(this.metadataRegistry.gmasMetadata[assetRef].weapon)
                const targetAPSSum = Math.round((armor + weapon) * 30 / 10)
                //const deterministicRand = this.randFactory(assetRef)
                const deterministicRand = RandomDSL.seed(assetRef)
                return this.newRandAPS(targetAPSSum, deterministicRand)
            case "adventurersOfThiolden":
                const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
                return [
                    this.metadataRegistry.advOfThioldenAppMetadata[idx].ath,
                    this.metadataRegistry.advOfThioldenAppMetadata[idx].int,
                    this.metadataRegistry.advOfThioldenAppMetadata[idx].cha
                ]
        }
    }

    private newRandAPS(targetAPSSum: number, deterministicRand: RandomDSL):[number, number, number] {
        // Assign stats as best as possible
        let currentSum = 0, overflow = 0
        const baseStatsOrder = deterministicRand.shuffle(
            ["athleticism", "intellect", "charisma"] as ["athleticism", "intellect", "charisma"])
        const singleStatMax = 10
        const stats = { athleticism: 0, intellect: 0, charisma: 0 }
        baseStatsOrder.forEach((stat, i) => {
            if (i == 2) {
                const semiFinalStat = targetAPSSum - currentSum
                const finalStat = Math.min(singleStatMax, semiFinalStat)
                overflow = semiFinalStat - finalStat
                stats[stat] = finalStat
            } else {
                const maxPossibleStat = Math.min(Math.min(targetAPSSum - 2, singleStatMax), targetAPSSum - 1 - currentSum)
                const finalStat = deterministicRand.randomNumberBetween(1, maxPossibleStat)
                currentSum += finalStat
                stats[stat] = finalStat
            }
        })
        // Randomly distribute the rest
        while (overflow > 0) {
            baseStatsOrder.forEach((stat) => {
                const currentStat = stats[stat]
                if (currentStat == singleStatMax || overflow <= 0) return
                const maxPossibleIncrement = Math.min(singleStatMax - currentStat, overflow)
                const randomIncrement = deterministicRand.randomNumberBetween(1, maxPossibleIncrement)
                const finalStat = randomIncrement + currentStat
                overflow -= randomIncrement
                stats[stat] = finalStat
            })
        }
        const totalStatSum = stats.athleticism + stats.intellect + stats.charisma
        if (totalStatSum != targetAPSSum) throw new Error("Expected " + targetAPSSum + " stats but got " + totalStatSum)
        else return  [stats.athleticism, stats.intellect, stats.charisma]
    }

    private calculateCollectibleDailyReward(collectionName: typeof relevantPolicies[number], type: "Furniture"| "Character", APS: [number, number, number]): CollectibleStakingInfo{
        //TODO: decide contributions
        return {stakingContribution: 1}
    }
}

const parseNonFurniturePixelTile = (name: string) => {
    const regex = /PixelTile\s+#(\d+)\s+(.+)/
    const match = name.match(regex)

    if (!match) throw new Error(`Invalid PixelTile string: ${name}`)
    const [, num, keyWords] = match
    
    return {
      miniature: `https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_${num}.png`,
      assetClass: keyWords
    }
  }