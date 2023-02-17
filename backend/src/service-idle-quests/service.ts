import dotenv from "dotenv"
import { IdleQuestsService } from "./service-spec"
import { QueryInterface, Sequelize } from "sequelize"
import { LoggingContext } from "../tools-tracing"
import { buildMigrator } from "../tools-database"
import path from "path"
import { Umzug } from "umzug"
import { IdleQuestsServiceLogging } from "./logging"
import { config } from "../tools-utils"

import { AcceptQuestResult, AvailableQuest, BattleReport, ClaimQuestResult, GetAllAdventurersResult, 
         GetAvailableQuestsResult, GetTakenQuestsResult, HealthStatus, Outcome, Quest, TakenQuest } from "./models"

import * as adventurersDB from "./items/adventurer-db"
import * as runningQuestsDB from "./challenges/taken-quest-db"

import { AssetManagementService } from "../service-asset-management"
import { MetadataRegistry } from "../registry-metadata"
import { pickRandomQuestsByLocation, QuestRegistry } from "../registry-quests"
import Random from "../tools-utils/random"
import { RewardCalculator, DurationCalculator, baseSuccessRate } from "./challenges/quest-requirement"
import { onlyPolicies, WellKnownPolicies } from "../registry-policies"
import AdventurerFun from "./items/adventurer-fun"
import { Calendar } from "../tools-utils/calendar"
import { EvenstatsService } from "../service-evenstats"

export interface IdleQuestsServiceConfig 
    { rewardFactor: number
    , durationFactor: number
    }

export interface IdleQuestServiceDependencies 
    { random: Random
    , calendar: Calendar
    , database: Sequelize
    , evenstatsService: EvenstatsService
    , assetManagementService: AssetManagementService
    , metadataRegistry: MetadataRegistry
    , questsRegistry: QuestRegistry
    , wellKnownPolicies: WellKnownPolicies
    }

export class IdleQuestsServiceDsl implements IdleQuestsService {

    private readonly migrator: Umzug<QueryInterface>
    private readonly adventurerFun: AdventurerFun 

    constructor (
        private readonly random: Random,
        private readonly calendar: Calendar,
        private readonly database: Sequelize,
        private readonly evenstatsService: EvenstatsService,
        private readonly assetManagementService: AssetManagementService,
        private readonly questsRegistry: QuestRegistry,
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly rewardCalculator: RewardCalculator,
        private readonly durationCalculator: DurationCalculator,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
        this.adventurerFun = new AdventurerFun(metadataRegistry, wellKnownPolicies)
    }

    static async loadFromEnv(dependencies: IdleQuestServiceDependencies): Promise<IdleQuestsService> {
        dotenv.config()
        return await IdleQuestsServiceDsl.loadFromConfig(
            { rewardFactor: config.intOrElse("QUEST_REWARD_FACTOR", 1)
            , durationFactor: config.intOrElse("QUEST_DURATION_FACTOR", 1)
            }, dependencies)
    }

    static async loadFromConfig(servConfig: IdleQuestsServiceConfig, dependencies: IdleQuestServiceDependencies): Promise<IdleQuestsService> {
        const service = new IdleQuestsServiceLogging(new IdleQuestsServiceDsl(
            dependencies.random,
            dependencies.calendar,
            dependencies.database,
            dependencies.evenstatsService,
            dependencies.assetManagementService,
            dependencies.questsRegistry,
            dependencies.metadataRegistry,
            dependencies.wellKnownPolicies,
            new RewardCalculator({ dragonSilver: dependencies.wellKnownPolicies.dragonSilver.policyId }, servConfig.rewardFactor),
            new DurationCalculator(servConfig.durationFactor),
        ))
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        adventurersDB.configureSequelizeModel(this.database)
        runningQuestsDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
    }

    async health(logger?: LoggingContext): Promise<HealthStatus> {
        let dbHealth: "ok" | "faulty"
        try { await this.database.authenticate(); dbHealth = "ok" }
        catch (e) { console.error(e); dbHealth = "faulty" }
        return {
            status: "ok",
            dependencies: [{ name: "database", status: dbHealth }]
        }
    }

    private makeAvailableQuestById(questId: string, rewardCalculator: RewardCalculator, durationCalculator: DurationCalculator): AvailableQuest {
        const originalQuest = this.questsRegistry[questId]
        return this.makeAvailableQuest(originalQuest, rewardCalculator, durationCalculator)
    }

    private makeAvailableQuest(originalQuest: Quest, rewardCalculator: RewardCalculator, durationCalculator: DurationCalculator): AvailableQuest {
        return {
            questId: originalQuest.questId,
            name: originalQuest.name,
            location: originalQuest.location,
            description: originalQuest.description,
            requirements: originalQuest.requirements,
            reward: rewardCalculator.baseReward(originalQuest.requirements),
            duration: durationCalculator.baseDuration(originalQuest.requirements),
            slots: 5
        }
    }

    private makeTakenQuestFromDB(takenQuest: runningQuestsDB.TakenQuestDB): TakenQuest {
        return { ...takenQuest.dataValues, quest: this.questsRegistry[takenQuest.questId] }
    }

    /**
     * Returns a list of all adventurers that are currently in the inventory of the given user.
     * This triggers a sync of the adventurers in the asset inventory (managed by the Asset Management Service) 
     * with the adventurers in the database.
     * 
     * @param userId 
     * @returns 
     */
    async getAllAdventurers(userId: string): Promise<GetAllAdventurersResult> {
        const inventoryResult = await this.assetManagementService.list(userId, { policies: onlyPolicies(this.wellKnownPolicies) })
        if (inventoryResult.status == "unknown-user") 
            return { status: "unknown-user" }
        const adventurers = await this.adventurerFun.syncAdventurers(userId, inventoryResult.inventory)
        return { status: "ok", adventurers }
    }

    /**
     * Returns a list of quests that are available for the given location.
     * 
     * @param location 
     * @param quantity
     * @returns 
     */
    async getAvailableQuests(location: string, quantity: number = 20): Promise<GetAvailableQuestsResult> {
        return { status: "ok", quests: pickRandomQuestsByLocation(location, quantity, this.questsRegistry, this.random)
            .map(q => this.makeAvailableQuest(q, this.rewardCalculator, this.durationCalculator)) }
    }

    /**
     * Creates a TakenQuest and updates the Adventurers to be inChallenge. 
     * If any of the Adventurers are already inChallenge or dead, the transaction is rolled back and the TakenQuest is not created.
     * 
     * @param userId 
     * @param questId 
     * @param adventurerIds 
     * @returns 
     */
    async acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<AcceptQuestResult> {
        if (this.questsRegistry[questId] === undefined) 
            return { status: "unknown-quest" }
        const transaction = await this.database.transaction()
        const adventurers = await this.adventurerFun.setInChallenge(userId, adventurerIds, transaction)
        if (adventurers.length != adventurerIds.length) {
            await transaction.rollback()
            return { status: "invalid-adventurers" }
        }
        const quest = (await runningQuestsDB.TakenQuestDB.create({ userId, questId, adventurerIds: adventurers.map(a => a.adventurerId), createdAt: this.calendar.now() }, { transaction })).dataValues
        const takenQuest = { ...quest, quest: this.makeAvailableQuestById(quest.questId, this.rewardCalculator, this.durationCalculator) }
        await transaction.commit()
        return { status: "ok", takenQuest }
    }

    /**
     * Returns all TakenQuests for the given userId.
     * 
     * @param userId 
     * @returns 
     */
    async getTakenQuests(userId: string): Promise<GetTakenQuestsResult> {
        const quests = await runningQuestsDB.TakenQuestDB.findAll({ where: { userId, claimedAt: null } })
        const takenQuests = quests.map(quest => ({ ...(quest.dataValues), quest: this.makeAvailableQuestById(quest.questId, this.rewardCalculator, this.durationCalculator) }))
        return { status: "ok", quests: takenQuests }
    }

    /**
     * Finish a TakenQuest, update the Adventurers to be idle and return the outcome.
     * The outcome is the reward if successful or a list with dead adventurers if failed.
     * 
     * @param userId 
     * @param takenQuestId 
     * @returns 
     */
    async claimQuestResult(userId: string, takenQuestId: string): Promise<ClaimQuestResult> {
        const quest = await runningQuestsDB.TakenQuestDB.findOne({ where: { userId, takenQuestId } })
        // Check quest exists
        if (!quest) 
            return { status: "unknown-quest" }
        // Check quest is not already claimed
        if (quest.claimedAt !== null)
            return { status: "quest-already-claimed" }
        const requirements = this.questsRegistry[quest.questId].requirements
        const duration = this.durationCalculator.baseDuration(requirements)
        const now = this.calendar.now()
        // Check quest is finished
        if (quest.createdAt.getTime() + duration > now.getTime()) 
            return { status: "quest-not-finished" }
        const transaction = await this.database.transaction()
        const adventurers = await this.adventurerFun.unsetInChallenge(userId, quest.adventurerIds, transaction)
        const missing = adventurers.map(a => a.adventurerId!).filter(item => quest.adventurerIds.indexOf(item) < 0)
        // Check all adventurers are still in the inventory
        if (missing.length !== 0) {
            await transaction.rollback()
            return { status: "missing-adventurers", missing }
        }
        const successRate = baseSuccessRate(requirements, adventurers)
        const success = this.random.randomNumberBetween(1, 100) <= Math.floor(successRate * 100)
        // Outcome data
        const outcome: Outcome = success 
            ? { ctype: "success-outcome", reward: this.rewardCalculator.baseReward(requirements) } 
            : { ctype: "failure-outcome", hpLoss: [] }
        // If success, level up adventurers
        if (outcome.ctype == "success-outcome") 
            await this.adventurerFun.levelUpAdventurers(adventurers, outcome.reward, transaction)
        // Check if any adventurer died
        // TODO
        // Claim quest
        await quest.update({ claimedAt: now, outcome }, { transaction })
        await transaction.commit()
        // Publish event to eventstats
        this.evenstatsService.publish({
            ctype: "claimed-quest-event",
            quest: { ...this.makeTakenQuestFromDB(quest), claimedAt: now, outcome },
            adventurers, 
        })
        return { status: "ok", outcome }
    }

    async module_getAllAdventurers(userId: string): Promise<object[]> {
        const adventurers = await this.getAllAdventurers(userId)
        if (adventurers.status == "unknown-user") return []
        return adventurers.adventurers.map(a => ({ 
            ...a,
            id: a.adventurerId,
            on_chain_ref: a.assetRef,   
            experience: 200,
            in_quest: false,
            type: "pxt",
            metadata: {},
            race: a.race,
            class: a.class,
            sprites: a.sprite,
            name:a.name
        }))
    }

    async module_claimQuestResult(userId: string, questId: string): Promise<object> {
        const result = await this.claimQuestResult(userId, questId)
        return { ...result }
    }

    async module_acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<object> {
        const result = await this.acceptQuest(userId, questId, adventurerIds)
        if (result.status !== "ok") return { "status": "error", "error": result.status }
        return { ...result.takenQuest }
    }

    async module_getTakenQuests(userId: string): Promise<object[]> {

        const result = await this.getTakenQuests(userId)
        if (result.status !== "ok") return []
        return result.quests.map(takenQuest => {
            return { ...takenQuest }
        })
    }

    async module_getAvailableQuests(userId: string): Promise<object[]> {
        return (await this.getAvailableQuests("Auristar")).quests.map(quest => {
            return { ...quest }
        })
    }
}