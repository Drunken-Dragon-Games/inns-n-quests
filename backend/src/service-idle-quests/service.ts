import dotenv from "dotenv"
import path from "path"
import { QueryInterface, Sequelize } from "sequelize"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { LoggingContext } from "../tools-tracing"
import { HealthStatus, SResult, Unit } from "../tools-utils"
import { AcceptEncounterResult, AcceptStakingQuestResult, ClaimEncounterResult, ClaimStakingQuestResult, GetActiveEncountersResult, GetAvailableEncountersResult, GetAvailableStakingQuestsResult, GetInnStateForGuestsResult, GetInventoryResult, GetTakenStakingQuestsResult, IdleQuestsService } from "./service-spec"

import { CharacterDBInfo, CharacterState } from "./state/character-state"
import { ActiveEncounterDBInfo, ActiveEncounterState } from './state/encounter-state'
import { FurnitureDBInfo, FurnitureState } from "./state/furniture-state"
import { SectorDBInfo, SectorState } from "./state/sector-state"
import { TakenStakingQuestDBInfo, TakenStakingQuestState } from "./state/taken-staking-quest-state"

import { MetadataRegistry } from "../tools-assets/registry-metadata"
import { onlyPolicies, WellKnownPolicies } from "../tools-assets/registry-policies"
import { AssetManagementService, AssetUnit, Inventory } from "../service-asset-management"
import { EvenstatsService } from "../service-evenstats"
import { Calendar } from "../tools-utils/calendar"
import { StakingQuestRegistry } from "./state/staking-quests-registry"

import * as vm from "./game-vm"
import { testEncounter } from "./game-vm"
import { AvailableStakingQuestState } from "./state/available-staking-quests-state"
import { Leaderboard } from "./models"
import { IdentityService } from "../service-identity"
import { CollectibleMetadata, Collection, CollectionService } from "../service-collection"

export interface IdleQuestServiceDependencies 
    { randomSeed: string
    , calendar: Calendar
    , database: Sequelize
    , evenstatsService: EvenstatsService
    , identityService: IdentityService
    , assetManagementService: AssetManagementService
    , collectionService: CollectionService
    , questsRegistry: StakingQuestRegistry
    , metadataRegistry: MetadataRegistry
    , wellKnownPolicies: WellKnownPolicies
    }

export class IdleQuestsServiceDsl implements IdleQuestsService {

    private readonly migrator: Umzug<QueryInterface>
    private readonly rules: vm.IQRuleset
    private readonly characterState: CharacterState
    private readonly furnitureState: FurnitureState
    private readonly takenQuestState: TakenStakingQuestState
    private readonly activeEncounterState: ActiveEncounterState
    private readonly availbleStakingQuestState: AvailableStakingQuestState

    constructor (
        randomSeed: string,
        private readonly calendar: Calendar,
        private readonly database: Sequelize,
        private readonly evenstatsService: EvenstatsService,
        private readonly identityService: IdentityService,
        private readonly assetManagementService: AssetManagementService,
        private readonly collectionService: CollectionService,
        private readonly questsRegistry: StakingQuestRegistry,
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
        this.rules = vm.DefaultRuleset.seed(randomSeed)
        const objectBuilder = new vm.IQMeatadataObjectBuilder(this.rules, metadataRegistry, wellKnownPolicies)
        this.characterState = new CharacterState(objectBuilder)
        this.furnitureState = new FurnitureState(objectBuilder)
        this.takenQuestState = new TakenStakingQuestState(questsRegistry)
        this.availbleStakingQuestState = new AvailableStakingQuestState(questsRegistry, objectBuilder)

        this.activeEncounterState = new ActiveEncounterState()
    }

    static async loadFromEnv(dependencies: IdleQuestServiceDependencies): Promise<IdleQuestsService> {
        dotenv.config()
        return await IdleQuestsServiceDsl.loadFromConfig(dependencies)
    }

    static async loadFromConfig(dependencies: IdleQuestServiceDependencies): Promise<IdleQuestsService> {
        const service = new IdleQuestsServiceDsl(
            dependencies.randomSeed,
            dependencies.calendar,
            dependencies.database,
            dependencies.evenstatsService,
            dependencies.identityService,
            dependencies.assetManagementService,
            dependencies.collectionService,
            dependencies.questsRegistry,
            dependencies.metadataRegistry,
            dependencies.wellKnownPolicies,
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        CharacterDBInfo.configureSequelizeModel(this.database)
        TakenStakingQuestDBInfo.configureSequelizeModel(this.database)
        FurnitureDBInfo.configureSequelizeModel(this.database)
        SectorDBInfo.configureSequelizeModel(this.database)
        ActiveEncounterDBInfo.configureSequelizeModel(this.database)
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

    /** Encounters */

    async getAvailableEncounters(location: string, logger?: LoggingContext): Promise<GetAvailableEncountersResult> {
        return { status: "ok", availableEncounters: [testEncounter] }
    }

    async acceptEncounter(userId: string, encounterId: string, adventurerIds: string[], logger?: LoggingContext): Promise<AcceptEncounterResult> {
        /*
        if (this.questsRegistry[questId] === undefined) 
            return { status: "unknown-quest" }
        */
        const transaction = await this.database.transaction()
        const adventurers = await this.characterState.setInActivity(userId, adventurerIds, transaction)
        if (adventurers.length != adventurerIds.length) {
            await transaction.rollback()
            return { status: "invalid-adventurers" }
        }
        const activeEncounter = await this.activeEncounterState.create(userId, encounterId, adventurers.map(a => a.entityId), this.calendar.now(), transaction)
        await transaction.commit()
        return { status: "ok", activeEncounter }
    }

    async getActiveEncounters(userId: string, logger?: LoggingContext): Promise<GetActiveEncountersResult> {
        const activeEncounters = await this.activeEncounterState.unclaimedActiveEncounters(userId)
        return { status: "ok", activeEncounters }
    }

    async claimEncounter(userId: string, activeEncounterId: string, logger?: LoggingContext): Promise<ClaimEncounterResult> {
        const activeEncounter = await this.activeEncounterState.userActiveEncounter(userId, activeEncounterId)
        // Check encounter exists
        if (!activeEncounter) 
            return { status: "unknown-encounter" }
        // Check encounter is not already claimed
        if (activeEncounter.claimedAt)
            return { status: "already-claimed" }
        const duration = activeEncounter.encounter.duration
        const now = this.calendar.now()
        // Check encounter is finished
        if (activeEncounter.createdAt.getTime() + duration > now.getTime()) 
            return { status: "not-finished" }
        const transaction = await this.database.transaction()
        const adventurers = await this.characterState.unsetInChallenge(userId, activeEncounter.party, transaction)
        const missing = adventurers.map(a => a.entityId).filter(item => activeEncounter.party.indexOf(item) < 0)
        // Check all adventurers are still in the inventory
        if (missing.length > 0) {
            await transaction.rollback()
            return { status: "missing-adventurers", missing }
        }
       const strategy = activeEncounter.encounter.strategies[activeEncounter.chosenStrategyIndex]
       const outcome = this.rules.encounter.outcome(strategy, adventurers)
        // If success, level up adventurers
        if (outcome.ctype == "success-outcome") 
            await this.characterState.setXP(this.rules.character.levelUp(adventurers, outcome.reward, vm.newAPS([1,1,1])), transaction)
        // Check if any adventurer died
        // TODO
        // Claimencounter 
        await this.activeEncounterState.claim(activeEncounter.activeEncounterId, now, outcome, transaction)
        await transaction.commit()
        // Publish event to eventstats
        /*
        this.evenstatsService.publish({
            ctype: "claimed-encounter-event",
            quest: { ...takenQuest, claimedAt: now, outcome },
            adventurers, 
        })
        */
        return { status: "ok", outcome }
    }

    /** Staking Quests */

    /**
     * Returns a list of quests that are available for the given location.
     * 
     * @param location 
     * @param quantity
     * @returns 
     */
    async getAvailableStakingQuests(location: string, quantity: number, logger?: LoggingContext): Promise<GetAvailableStakingQuestsResult> {
        return { 
            status: "ok", 
            availableQuests: await this.availbleStakingQuestState.getAvailableStakingQuests(location, quantity)
        }
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
    async acceptStakingQuest(userId: string, questId: string, adventurerIds: string[], logger?: LoggingContext): Promise<AcceptStakingQuestResult> {
        const quest = this.questsRegistry[questId]
        if (!quest) 
            return { status: "unknown-quest" }
        const transaction = await this.database.transaction()
        const characters = await this.characterState.setInActivity(userId, adventurerIds, transaction)
        if (characters.length != adventurerIds.length) {
            await transaction.rollback()
            return { status: "invalid-adventurers" }
        }
        const takenQuest = await this.takenQuestState.create({ 
            userId, 
            questId, 
            partyIds: characters.map(a => a.entityId), 
            createdAt: this.calendar.now() 
        }, transaction)
        await transaction.commit()
        return { status: "ok", takenQuest }
    }

    /**
     * Returns all TakenQuests for the given userId.
     * 
     * @param userId 
     * @returns 
     */
    async getTakenStakingQuests(userId: string, logger?: LoggingContext): Promise<GetTakenStakingQuestsResult> {
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
    async claimStakingQuestResult(userId: string, takenQuestId: string, logger?: LoggingContext): Promise<ClaimStakingQuestResult> {
        const takenQuest = await this.takenQuestState.userTakenQuest(userId, takenQuestId)
        // Check quest exists
        if (!takenQuest) 
            return { status: "unknown-quest" }
        // Check quest is not already claimed
        if (takenQuest.claimedAt)
            return { status: "quest-already-claimed" }
        const transaction = await this.database.transaction()
        const adventurers = await this.characterState.unsetInChallenge(userId, takenQuest.partyIds, transaction)
        const missing = takenQuest.partyIds.filter(adventurerId => adventurers.map(a => a.entityId).indexOf(adventurerId) < 0)
        // Check all adventurers are still in the inventory
        if (missing.length > 0) {
            await this.takenQuestState.claimQuest(takenQuest.takenQuestId, this.calendar.now(), {ctype: "failure-outcome"}, transaction)
            await transaction.commit()
            return { status: "missing-adventurers", missing }
        }
        const configuration = this.rules.stakingQuest.questConfiguration(takenQuest.availableQuest, adventurers)
        const duration = configuration.configurations[configuration.bestIndex].satisfactionInfo.requirementInfo.duration
        const now = this.calendar.now()
        // Check quest is finished
        if (takenQuest.createdAt.getTime() + duration > now.getTime()) {
            await transaction.rollback()
            return { status: "quest-not-finished" }
        }
        /*
        const successRate = this.rules.quest.satisfied(takenQuest.availableQuest.requirements, adventurers)
        const success = this.random.randomNumberBetween(1, 100) <= Math.floor(successRate * 100)
        // Outcome data
        const outcome: vm.QuestOutcome = success 
            ? { ctype: "success-outcome", reward: this.rules.quest.reward(takenQuest.availableQuest.requirements) } 
            : { ctype: "failure-outcome", hpLoss: [] }
        */
       const outcome = this.rules.stakingQuest.outcome(takenQuest.availableQuest, adventurers)
        // If success, grant dragon silver
        if (outcome.ctype == "success-outcome") 
            await this.assetManagementService.grant(userId, { policyId: this.wellKnownPolicies.dragonSilver.policyId, unit: "DragonSilver", quantity: outcome.reward.currency.toString() }, logger)
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

    /**
     * Froces a claim for all quest that fit inside the range privided (inclusive)
     * asumes quest id in fomrat "quest-number"
     * @param from 
     * @param to 
     */
    async forceClaimStakingQuestsByQuestId(from: number, to: number): Promise<SResult<Unit>> {
        const oldQuests = await this.takenQuestState.getUnclaimedQuestsByIdRange(from, to);

        for (const quest of oldQuests) {
            const adventurers = await this.characterState.unsetInChallenge(quest.userId, quest.partyIds);
            const missing = quest.partyIds.filter(adventurerId => adventurers.map(a => a.entityId).indexOf(adventurerId) < 0);

            // Check all adventurers are still in the inventory
            const outcome: vm.StakingQuestOutcome = missing.length > 0 ?
                { ctype: "failure-outcome" } :
                this.rules.stakingQuest.outcome(quest.availableQuest, adventurers);

            const now = this.calendar.now();
            if (outcome.ctype == "success-outcome") 
                await this.assetManagementService.grant(quest.userId, { policyId: this.wellKnownPolicies.dragonSilver.policyId, unit: "DragonSilver", quantity: outcome.reward.currency.toString() });
            

            await this.takenQuestState.claimQuest(quest.takenQuestId, now, outcome);
        }

        return {ctype: "success"}
    }

    /** Plater State */

    /**
     * Returns a list of all adventurers that are currently in the inventory of the given user.
     * This triggers a sync of the adventurers in the asset inventory (managed by the Asset Management Service) 
     * with the adventurers in the database.
     * 
     * @param userId 
     * @returns 
     */
    async getInventory(userId: string, logger?: LoggingContext): Promise<GetInventoryResult> {
        const collectionResult = await this.collectionService.getMortalCollection(userId, logger)
        const collectionFurniture = await this.collectionService.getCollection(userId, {
            page: 1, 
            policyFilter: [], 
            classFilter: ["furniture"], 
            APSFilter: {ath: {}, cha: {}, int: {}}}, 
            100, 
            logger)
        if (collectionResult.ctype !== "success" || collectionFurniture.ctype !== "success") return { status: "Could not get mortal collection" }
        const gameCollection = Object.entries(collectionResult.collection).reduce((acc, [policy, policyCollectibles]) => {
            acc[policy as "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"].push(...policyCollectibles)
            return acc
        }, collectionFurniture.collection)
        
        const gameInvenotry = this.collectionToInventory(gameCollection)
        const inventoryResult = await this.assetManagementService.list(userId, { policies: [this.wellKnownPolicies.dragonSilver.policyId] })
        if (inventoryResult.status == "unknown-user") return { status: "unknown-user" }
        const [ characters, furniture ] = (await Promise.all([
            this.characterState.syncCharacters(userId, gameInvenotry),
            this.furnitureState.syncFurniture(userId, gameInvenotry),
        ]))
        /* if (process.env.NODE_ENV === "development" && characters.length == 0)
            return await this.grantTestInventory(userId) */

        const dragonSilver = parseInt(inventoryResult.inventory[this.wellKnownPolicies.dragonSilver.policyId]?.find(a => a.unit == "DragonSilver")?.quantity ?? "0")
        const inventory = await SectorState.syncPlayerInn(userId, {
            dragonSilver,
            characters: vm.makeRecord(characters, c => c.entityId),//testCharacters(userId), c => c.entityId),
            furniture: vm.makeRecord(furniture, f => f.entityId)
        }) 
        
        return { 
            status: "ok", 
            inventory
        }
    }

    async grantTestInventory(userId: string, logger?: LoggingContext): Promise<GetInventoryResult> {
        if (process.env.NODE_ENV !== "development") return { status: "ok", inventory: { dragonSilver: 0, characters: {}, furniture: {} } }

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
                    unit: this.rules.rand.pickRandom(adventurers),
                    policyId: this.wellKnownPolicies.pixelTiles.policyId,
                    quantity: "1",
                }))

            } else if (collection == "grandmaster-adventurers") {
                const meta = this.metadataRegistry.gmasMetadata
                const adventurers = Object.keys(meta)
                return [...Array(amount)].map(() => ({
                    unit: this.rules.rand.pickRandom(adventurers),
                    policyId: this.wellKnownPolicies.grandMasterAdventurers.policyId,
                    quantity: "1",
                }))

            } else { //if (collection == "adventurers-of-thiolden") {
                const meta = this.metadataRegistry.advOfThioldenAppMetadata
                const adventurers = Object.keys(meta)
                return [...Array(amount)].map(() => ({
                    unit: "AdventurerOfThiolden"+this.rules.rand.pickRandom(adventurers),
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
                unit: this.rules.rand.pickRandom(furniture),
                policyId: this.wellKnownPolicies.pixelTiles.policyId,
                quantity: "1",
            }))
        }

        const options: AssetUnit[] = [
            ...pickAdventurer("pixel-tiles", 10), 
            ...pickAdventurer("grandmaster-adventurers", 10), 
            ...pickAdventurer("adventurers-of-thiolden", 10), 
            ...pickFurniture("pixel-tiles", 30)
        ]

        await this.assetManagementService.grantMany(userId, options)
        return await this.getInventory(userId)
    }

    async setInnState(userId: string, name?: string, objectLocations?: vm.ObjectsLocations, logger?: LoggingContext): Promise<void> {
        if (!name && !objectLocations) return
        await SectorState.setPlayerInnState(userId, name, objectLocations)
    }

    async getInnStateForGuests(host: string, logger?: LoggingContext): Promise<GetInnStateForGuestsResult> {
        const user = await this.identityService.resolveUser({ ctype: "discord-username", username: host })
        if (user.status != "ok") return { status: "unknown-user" }
        return await this.getInventory(user.info.userId, logger)
    }

    async normalizeSingleAssetStatus(userId: string, asset:{ctype: "ref", assetRef: string} | {ctype: "id", assetId: string}, logger?: LoggingContext | undefined): Promise<{status: "ok"} | {status: "failed", reason: string}> {
        return this.characterState.normalizeAssetStatus(userId, asset, this.database)
    }

    async failStakingQuest(userId: string, takenQuestId: string): Promise<{ status: "ok", missionParty: string[]} | { status: "failed", reason: string; }> {
        const takenQuest = await this.takenQuestState.userTakenQuest(userId, takenQuestId)

        if (!takenQuest) return { status: "failed", reason:"unknown-quest" }
        if (takenQuest.claimedAt) return { status: "failed", reason: "quest-already-claimed" }

        const transaction = await this.database.transaction()
        try{
            const adventurers = await this.characterState.unsetInChallenge(userId, takenQuest.partyIds, transaction)

            await this.takenQuestState.claimQuest(takenQuest.takenQuestId, this.calendar.now(), {ctype: "failure-outcome"}, transaction)

            await transaction.commit()

            return {status: "ok", missionParty: adventurers.map((adventurer) => adventurer.entityId)}
        }catch (e:any){
            await transaction.rollback()
            return {status: "failed", reason: e.message ?? JSON.stringify(e, null, 4)}
        }
        
    }

    async getStakingQuestLeaderboard(size: number, start: Date, end: Date = new Date()): Promise<Leaderboard>{
        return this.takenQuestState.getLeaderboard(size, start, end)
    }

    private collectionToInventory = (collection: Collection<{}>): Inventory => {
        const emptyInventory: Inventory = {}
        return Object.entries(collection).reduce((acc, [policyName, policyCollectibles]) => {
            type policyNames = "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"
            const policyInvenotry = policyCollectibles.map((collectible) => {
                return { unit: collectible.assetRef, quantity: collectible.quantity, chain: true}
            })
            const policyId = this.wellKnownPolicies[policyName as policyNames].policyId
            return {...acc, [policyId]: policyInvenotry}
        }, emptyInventory)
}
}

