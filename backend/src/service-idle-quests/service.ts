import dotenv from "dotenv"
import path from "path"
import { QueryInterface, Sequelize } from "sequelize"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { HealthStatus } from "../tools-utils"
import { IdleQuestsServiceLogging } from "./logging"
import { AcceptQuestResult, ClaimQuestResult, GetAvailableQuestsResult, GetInventoryResult, GetTakenQuestsResult, IdleQuestsService } from "./service-spec"

import * as charactersStateModule from "./state/character-state"
import * as furnitureStateModule from "./state/furniture-state"
import * as sectorStateModule from "./state/sector-state"
import * as takenQuestsStateModule from "./state/taken-quest-state"

import CharacterState from "./state/character-state"
import FurnitureState from "./state/furniture-state"
import SectorState from "./state/sector-state"
import TakenQuestState from "./state/taken-quest-state"

import { MetadataRegistry } from "../registry-metadata"
import { onlyPolicies, WellKnownPolicies } from "../registry-policies"
import { pickRandomQuestsByLocation, QuestRegistry } from "../registry-quests"
import { AssetManagementService, AssetUnit } from "../service-asset-management"
import { EvenstatsService } from "../service-evenstats"
import { Calendar } from "../tools-utils/calendar"
import Random from "../tools-utils/random"
import * as vm from "./game-vm"

export interface IdleQuestServiceDependencies 
    { random: Random
    , calendar: Calendar
    , database: Sequelize
    , evenstatsService: EvenstatsService
    , assetManagementService: AssetManagementService
    , questsRegistry: QuestRegistry
    , metadataRegistry: MetadataRegistry
    , wellKnownPolicies: WellKnownPolicies
    }

export class IdleQuestsServiceDsl implements IdleQuestsService {

    private readonly migrator: Umzug<QueryInterface>
    private readonly rules: vm.IQRuleset
    private readonly characterState: CharacterState
    private readonly furnitureState: FurnitureState
    private readonly takenQuestState: TakenQuestState

    constructor (
        private readonly random: Random,
        private readonly calendar: Calendar,
        private readonly database: Sequelize,
        private readonly evenstatsService: EvenstatsService,
        private readonly assetManagementService: AssetManagementService,
        private readonly questsRegistry: QuestRegistry,
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
        this.rules = new vm.DefaultRuleset(wellKnownPolicies)
        this.characterState = new CharacterState(metadataRegistry, wellKnownPolicies, this.rules)
        this.furnitureState = new FurnitureState(metadataRegistry, wellKnownPolicies)
        this.takenQuestState = new TakenQuestState(questsRegistry, this.rules)
    }

    static async loadFromEnv(dependencies: IdleQuestServiceDependencies): Promise<IdleQuestsService> {
        dotenv.config()
        return await IdleQuestsServiceDsl.loadFromConfig(dependencies)
    }

    static async loadFromConfig(dependencies: IdleQuestServiceDependencies): Promise<IdleQuestsService> {
        const service = new IdleQuestsServiceLogging(new IdleQuestsServiceDsl(
            dependencies.random,
            dependencies.calendar,
            dependencies.database,
            dependencies.evenstatsService,
            dependencies.assetManagementService,
            dependencies.questsRegistry,
            dependencies.metadataRegistry,
            dependencies.wellKnownPolicies,
        ))
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        charactersStateModule.configureSequelizeModel(this.database)
        takenQuestsStateModule.configureSequelizeModel(this.database)
        furnitureStateModule.configureSequelizeModel(this.database)
        sectorStateModule.configureSequelizeModel(this.database)
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

    /**
     * Returns a list of all adventurers that are currently in the inventory of the given user.
     * This triggers a sync of the adventurers in the asset inventory (managed by the Asset Management Service) 
     * with the adventurers in the database.
     * 
     * @param userId 
     * @returns 
     */
    async getInventory(userId: string): Promise<GetInventoryResult> {
        const inventoryResult = await this.assetManagementService.list(userId, { policies: onlyPolicies(this.wellKnownPolicies) })
        if (inventoryResult.status == "unknown-user") 
            return { status: "unknown-user" }
        const [ characters, furniture ] = (await Promise.all([
            this.characterState.syncCharacters(userId, inventoryResult.inventory),
            this.furnitureState.syncFurniture(userId, inventoryResult.inventory),
        ]))
        return { status: "ok", inventory: await SectorState.syncPlayerInn(userId, { 
            characters: vm.makeRecord(characters, c => c.entityId), 
            furniture: vm.makeRecord(furniture, f => f.entityId)
        }) }
    }

    /**
     * Returns a list of quests that are available for the given location.
     * 
     * @param location 
     * @param quantity
     * @returns 
     */
    async getAvailableQuests(location: string, quantity: number = 20): Promise<GetAvailableQuestsResult> {
        return { status: "ok", availableQuests: pickRandomQuestsByLocation(location, quantity, this.questsRegistry, this.random)
            .map(vm.newAvailableQuest(this.rules)) }
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
        const adventurers = await this.characterState.setInActivity(userId, adventurerIds, transaction)
        if (adventurers.length != adventurerIds.length) {
            await transaction.rollback()
            return { status: "invalid-adventurers" }
        }
        const takenQuest = await this.takenQuestState.create(userId, questId, adventurers.map(a => a.entityId), this.calendar.now(), transaction)
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
        const takenQuests = await this.takenQuestState.unclaimedTakenQuests(userId)
        return { status: "ok", takenQuests }
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
        const takenQuest = await this.takenQuestState.userTakenQuest(userId, takenQuestId)
        // Check quest exists
        if (!takenQuest) 
            return { status: "unknown-quest" }
        // Check quest is not already claimed
        if (takenQuest.claimedAt)
            return { status: "quest-already-claimed" }
        const duration = this.rules.quest.duration(takenQuest.availableQuest.requirements)
        const now = this.calendar.now()
        // Check quest is finished
        if (takenQuest.createdAt.getTime() + duration > now.getTime()) 
            return { status: "quest-not-finished" }
        const transaction = await this.database.transaction()
        const adventurers = await this.characterState.unsetInChallenge(userId, takenQuest.adventurerIds, transaction)
        const missing = adventurers.map(a => a.entityId).filter(item => takenQuest.adventurerIds.indexOf(item) < 0)
        // Check all adventurers are still in the inventory
        if (missing.length > 0) {
            await transaction.rollback()
            return { status: "missing-adventurers", missing }
        }
        const successRate = this.rules.quest.successRate(takenQuest.availableQuest.requirements, adventurers)
        const success = this.random.randomNumberBetween(1, 100) <= Math.floor(successRate * 100)
        // Outcome data
        const outcome: vm.Outcome = success 
            ? { ctype: "success-outcome", reward: this.rules.quest.reward(takenQuest.availableQuest.requirements) } 
            : { ctype: "failure-outcome", hpLoss: [] }
        // If success, level up adventurers
        if (outcome.ctype == "success-outcome") 
            await this.characterState.setXP(this.rules.character.levelUp(adventurers, outcome.reward, vm.newAPS([1,1,1])), transaction)
        // Check if any adventurer died
        // TODO
        // Claim quest
        await this.takenQuestState.claimQuest(takenQuest.takenQuestId, now, outcome, transaction)
        await transaction.commit()
        // Publish event to eventstats
        this.evenstatsService.publish({
            ctype: "claimed-quest-event",
            quest: { ...takenQuest, claimedAt: now, outcome },
            adventurers, 
        })
        return { status: "ok", outcome }
    }

    async grantTestInventory(userId: string): Promise<GetInventoryResult> {
        if (process.env.NODE_ENV === "production") return { status: "ok", inventory: { characters: {}, furniture: {} } }

        const pickAdventurer = (collection: vm.CharacterCollection, amount: number): AssetUnit[] => {
            if (collection == "pixel-tiles") {
                const meta = this.metadataRegistry.pixelTilesMetadata
                const adventurers = Object.keys(meta).filter(a => 
                    meta[a].rarity != "Unique" && (
                    meta[a].type == "Adventurer" || 
                    meta[a].type == "Monster" || 
                    meta[a].type == "Townsfolk" || // Remove this one when implementing Hosts and Crafters
                    meta[a].name == "PixelTile #24 Guard" || 
                    meta[a].name == "PixelTile #45 Recruit"))
                return [...Array(amount)].map(() => ({
                    unit: this.random.pickRandom(adventurers),
                    policyId: this.wellKnownPolicies.pixelTiles.policyId,
                    quantity: "1",
                }))

            } else if (collection == "grandmaster-adventurers") {
                const meta = this.metadataRegistry.gmasMetadata
                const adventurers = Object.keys(meta)
                return [...Array(amount)].map(() => ({
                    unit: this.random.pickRandom(adventurers),
                    policyId: this.wellKnownPolicies.grandMasterAdventurers.policyId,
                    quantity: "1",
                }))

            } else { //if (collection == "adventurers-of-thiolden") {
                const meta = this.metadataRegistry.advOfThioldenAppMetadata
                const adventurers = Object.keys(meta)
                return [...Array(amount)].map(() => ({
                    unit: "AdventurerOfThiolden"+this.random.pickRandom(adventurers),
                    policyId: this.wellKnownPolicies.adventurersOfThiolden.policyId,
                    quantity: "1",
                }))
            }
        }

        const pickFurniture = (collection: vm.FurnitureCollection, amount: number): AssetUnit[] => {
            const meta = this.metadataRegistry.pixelTilesMetadata
            const furniture = Object.keys(meta).filter(a =>
                meta[a].type != "Adventurer" && 
                meta[a].type != "Monster" && 
                meta[a].type != "Townsfolk" && 
                meta[a].rarity != "Unique"
            )
            return [...Array(amount)].map(() => ({
                unit: this.random.pickRandom(furniture),
                policyId: this.wellKnownPolicies.pixelTiles.policyId,
                quantity: "10",
            }))
            
        }

        const options: AssetUnit[] = [
            ...pickAdventurer("pixel-tiles", 10), 
            ...pickAdventurer("grandmaster-adventurers", 10), 
            ...pickAdventurer("adventurers-of-thiolden", 10), 
            ...pickFurniture("pixel-tiles", 10)
        ]

        await this.assetManagementService.grantMany(userId, options)
        return await this.getInventory(userId)
    }

    async setInnState(userId: string, name?: string, objectLocations?: vm.ObjectsLocations): Promise<void> {
        if (!name && !objectLocations) return
        await SectorState.setPlayerInnState(userId, name, objectLocations)
    }
}