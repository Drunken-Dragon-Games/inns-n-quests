import { QueryInterface, Sequelize } from "sequelize"
import { CollectionService, GetCollectionResult, GetPassiveStakingInfoResult } from "./service-spec"

import path from "path"
import { Umzug } from "umzug"
import { AssetManagementService } from "../service-asset-management"
import { MetadataRegistry, WellKnownPolicies } from "../tools-assets"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { Collectible, CollectibleMetadata, CollectibleStakingInfo, Collection, CollectionFilter, CollectionPolicyNames, PartialMetadata, PolicyCollectibles } from "./models"
import { RandomDSL } from "./random-dsl/dsl"

import { IdentityService } from "../service-identity"
import * as contributionsDB from "./staking-rewards/rewards-db"
import { Records, Rewards } from "./staking-rewards/dsl"

export type CollectionServiceDependencies = {
    database: Sequelize
    assetManagementService: AssetManagementService,
    identityService: IdentityService,
    wellKnownPolicies: WellKnownPolicies
    metadataRegistry: MetadataRegistry
}

export type CollectionServiceConfig = {
}

const relevantPolicies = ["pixelTiles", "adventurersOfThiolden", "grandMasterAdventurers"] as const
const policyIndexMapper: Record<CollectionPolicyNames, typeof relevantPolicies[number]> = {
        "pixel-tiles": "pixelTiles",
        "adventurers-of-thiolden": "adventurersOfThiolden",
        "grandmaster-adventurers": "grandMasterAdventurers"
    }

export class CollectionServiceDsl implements CollectionService {

    private readonly migrator: Umzug<QueryInterface>

    constructor(
        private readonly database: Sequelize,
        private readonly assetManagementService: AssetManagementService,
        private readonly identityService: IdentityService,
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly metadataRegistry: MetadataRegistry
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
            dependencies.identityService,
            dependencies.wellKnownPolicies,
            dependencies.metadataRegistry,
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        contributionsDB.configureSequelizeModel(this.database)
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
        const { policy, page } = filter || {}
        const options = {
            page,
            policies: policy ? [this.wellKnownPolicies[policyIndexMapper[policy]].policyId] : relevantPolicies.map(policy => this.wellKnownPolicies[policy].policyId)
        }

        const assetList = await this.assetManagementService.list(userId, {chain: true, ...options}, logger)

        if (assetList.status !== "ok") return {ctype: "failure", error:assetList.status }

        const processAssets = (policyId: string, assets: {unit: string,quantity: string,chain: boolean}[]): PolicyCollectibles<{}> => {
            return assets.reduce((acc, asset) => {
                acc.push({assetRef: asset.unit, quantity: asset.quantity, type: this.getCollectionType(policyId, asset.unit)})
                return acc
            }, [] as PolicyCollectibles<{}>)
            
        }

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
    async getCollectionWithUIMetadata(userId: string, filter?: CollectionFilter, logger?: LoggingContext): Promise<GetCollectionResult<CollectibleStakingInfo & CollectibleMetadata>> {
        const collectionResult = await this.getCollection(userId, filter, logger)
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
        const weeklyAccumulated = (await Rewards.getWeeklyAccumulated(userId)).toString()
        return {ctype: "success", weeklyAccumulated, dragonSilverToClaim, dragonSilver}

    }

    /**
     * Resyncs everyone's collection and adds the daily contributions to their passive staking.
     * Intended to be called once a day.
     * Important: idempotent operation.
     */
    async updateGlobalDailyStakingContributions(logger?: LoggingContext): Promise<void> {
        const dailyRecord = await Records.createDaily()
        if (dailyRecord.ctype !== "success") {
            logger?.log.error(`Failed to create daily record beaocuse: ${dailyRecord.error}`)
            return
        }
        const userIds = await this.identityService.listAllUserIds(logger)
        
        const dailyRewards = await Promise.all(userIds.map(async (userId) => {
            // Depending on how we decide to calculate the weekly earning this might be greatly optimized by not needing the metadata
            const collection = await this.getCollectionWithUIMetadata(userId)
            if (collection.ctype !== "success"){
                logger?.log.error(`Getting collection returned: ${collection.error}`)
                await Rewards.createDaily(userId, `pending because collection returned: ${collection.error}`)
                return 0
            }
            else{
                const rewardRecord = await Rewards.createDaily(userId)
                if (rewardRecord.ctype !== "success") {
                    logger?.log.error(`Failed to create daily reward record becaouse: ${rewardRecord.error}.`)
                    return 0
                }
                const dailyReward = Object.entries(collection.collection).reduce((acc, [_policyName, collectibles]) => {
                    return acc + collectibles.reduce((acc, collectible) => {return acc + collectible.stakingContribution}, 0)
                }, 0)
                await Rewards.completeDaily(userId, dailyReward.toString())
                return dailyReward
            }
        }))
    
        const dailyRewardTotal = dailyRewards.reduce((acc, reward) => acc + reward, 0)
        await Records.completeDaily(dailyRewardTotal.toString())
    }
    

    /**
     * Grants the weekly contributions to everyone's dragon silver to claim.
     * Intended to be called once a week after the daily contribution of that day.
     * Important: idempotent operation.
     */
    async grantGlobalWeeklyStakingGrant(logger?: LoggingContext): Promise<void> {
        const weeklyRecord = await Records.createWeekly()
        if (weeklyRecord.ctype !== "success") {
            logger?.log.error(`Failed to create daily record beaocuse: ${weeklyRecord.error}`)
            return
        }
        const pendingRewards = await Rewards.getCurrentWeekTotals()
        const totalGranted = Object.entries(pendingRewards).reduce((acc, [userId, reward]) => {
            this.assetManagementService.grant(userId, {
                policyId: this.wellKnownPolicies.dragonSilver.policyId,
                unit: "DragonSilver", 
                quantity: reward.toString()
            })
            return acc + reward
        }, 0)
        await Records.completeWeekly(totalGranted.toString())
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

    private getCollectionType = (policyId: string, assetUnit: string) => {
        if(policyId === this.wellKnownPolicies.pixelTiles.policyId){
            const metadataType = this.metadataRegistry.pixelTilesMetadata[assetUnit].type
            return metadataType == "Adventurer" || metadataType == "Monster" || metadataType == "Townsfolk" ? "Character" : "Furniture"
        }
        return "Character"
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
                    ? { miniature: `https://cdn.ddu.gg/pixeltiles/x4/${name}.png`, assetClass: "furniture" }
                    : parseNonFurniturePixelTile(name)
     
                 return {
                    name, miniature,
                    splashArt: `https://cdn.ddu.gg/pixeltiles/xl/${name}.png`,
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
                const {miniature, splashArt} = this.advOfThioldenSprites(assetRef)
                return {
                    name: `${assetRef} ${this.metadataRegistry.advOfThioldenGameMetadata[assetRef].Title}`,
                    splashArt,
                    miniature,
                    class: this.metadataRegistry.advOfThioldenGameMetadata[assetRef]["Game Class"],
                    mortalRealmsActive: 0
                }
            }
        }
    }

    private advOfThioldenSprites = (assetRef: string): {miniature: string, splashArt: string} => {
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
            splashArt: `https://cdn.ddu.gg/adv-of-thiolden/web/${finalName}_${aps}_${chromaOrPlain == "chroma" ? 1 : 0}.webp`
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