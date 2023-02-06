import dotenv from "dotenv"
import { IdleQuestsService } from "./service-spec"
import { Op, QueryInterface, Sequelize } from "sequelize"
import { LoggingContext } from "../tools-tracing"
import { buildMigrator } from "../tools-database"
import path from "path"
import { Umzug } from "umzug"
import { IdleQuestsServiceLogging } from "./logging"
import { config } from "../tools-utils"

import { AcceptQuestResult, ClaimQuestResult, GetAllAdventurersResult, GetAvailableQuestsResult, GetTakenQuestsResult, HealthStatus } from "./models"

import * as adventurersDB from "./items/adventurer-db"
import * as runningQuestsDB from "./challenges/taken-quest-db"

import { AssetManagementService } from "../service-asset-management"
import { MetadataRegistry } from "../registry-metadata"
import { pickRandomQuestsByLocation, QuestRegistry } from "../registry-quests"
import Random from "../tools-utils/random"
import { RewardCalculator, DurationCalculator, baseSuccessRate } from "./challenges/quest-requirement"
import { onlyPolicies, WellKnownPolicies } from "../registry-policies"
import AdventurerFun from "./items/adventurer-fun"

export interface IdleQuestsServiceConfig 
    { rewardFactor: number
    , durationFactor: number
    }

export interface IdleQuestServiceDependencies 
    { random: Random
    , database: Sequelize
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
        private readonly database: Sequelize,
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
            dependencies.database,
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
        return { status: "ok", quests: pickRandomQuestsByLocation(location, quantity, this.questsRegistry, this.random).map(quest => ({ 
            questId: quest.questId,
            name: quest.name,
            location: quest.location,
            description: quest.description,
            requirements: quest.requirements,
            reward: this.rewardCalculator.baseReward(quest.requirements), 
            duration: this.durationCalculator.baseDuration(quest.requirements),
            slots: quest.slots
        })) }
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
        const takenQuest = await runningQuestsDB.TakenQuestDB.create({ userId, questId, adventurerIds: adventurers.map(a => a.adventurerId) }, { transaction })
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
        const quests = await runningQuestsDB.TakenQuestDB.findAll({ where: { userId } })
        return { status: "ok", quests }
    }

    /**
     * Finish a TakenQuest, update the Adventurers to be idle and return the outcome.
     * The outcome is the reward if successful or a list with dead adventurers if failed.
     * 
     * @param userId 
     * @param questId 
     * @returns 
     */
    async claimQuestResult(userId: string, questId: string): Promise<ClaimQuestResult> {
        const quest = await runningQuestsDB.TakenQuestDB.findOne({ where: { userId, questId } })
        if (!quest) 
            return { status: "unknown-quest" }
        if (quest.claimedAt !== null)
            return { status: "quest-already-claimed" }
        const requirements = this.questsRegistry[quest.questId].requirements
        const duration = this.durationCalculator.baseDuration(requirements)
        if (quest.createdAt.getTime() + duration > Date.now()) 
            return { status: "quest-not-finished" }
        const transaction = await this.database.transaction()
        const adventurers = await this.adventurerFun.unsetInChallenge(userId, quest.adventurerIds, transaction)
        const missing = adventurers.map(a => a.adventurerId!).filter(item => quest.adventurerIds.indexOf(item) < 0)
        if (missing.length !== 0) {
            await transaction.rollback()
            return { status: "missing-adventurers", missing }
        }
        await quest.update({ claimedAt: new Date() }, { transaction })
        await transaction.commit()
        const successRate = baseSuccessRate(requirements, adventurers)
        const success = this.random.randomNumberBetween(1, 100) <= Math.floor(successRate * 100)
        if (success) {
            const reward = this.rewardCalculator.baseReward(requirements)
            return { status: "ok", outcome: { status: "success", reward } }
        } else {
            return { status: "ok", outcome: { status: "failure", deadAdventurers: [] } }
        }
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
        /*
        return [
            {
                id: "9ce8eb80-2ecc-4e1a-a9db-254439920b50",
                on_chain_ref: "AdventurerOfThiolden6176",
                experience: 3940,
                in_quest: false,
                type: "aot",
                metadata: {},
                race: "human",
                class: "rogue",
                sprites: "https://cdn.ddu.gg/adv-of-thiolden/x6/perneli-front-plain.png",
                name: "Perneli"
            },
        ]
        */
    }

    async module_claimQuestResult(userId: string, questId: string): Promise<object> {
        return {
            "adventurers": [
                {
                    "id": "6be775ac-821c-4189-b07d-3927686dacb2",
                    "experience": 395
                },
                {
                    "id": "9a803992-d35d-4e2a-884e-6985f44439d1",
                    "experience": 395
                },
                {
                    "id": "3ce7852c-0e2d-4247-8f78-78ba91c75cc9",
                    "experience": 380
                }
            ]
        }
    }

    async module_acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<object> {

        const result = await this.acceptQuest(userId, questId, adventurerIds)
        if (result.status !== "ok") return { "status": "error", "error": result.status }
        const quest = this.questsRegistry[questId]
        return {
            "id": result.takenQuest.takenQuestId,
            "started_on": "2023-02-01T04:22:38.139Z",
            "state": "in_progress",
            "is_claimed": false,
            "user_id": userId,
            "quest_id": result.takenQuest.questId,
            "quest": {
                "id": quest.questId,
                "name": quest.name,
                "description": quest.description,
                "reward_ds": 3,
                "reward_xp": 1,
                "difficulty": 2,
                "slots": 4,
                "rarity": "townsfolk",
                "duration": 120763172,
                "requirements": {},
                "is_war_effort": false
            },
            "enrolls": [
                {
                    "taken_quest_id": "fb181bff-34ee-45fd-83d8-2bc6ab49e921",
                    "adventurer_id": "9a516354-f30e-43c1-80f3-1abbda26821d",
                    "adventurer": {
                        "id": "9a516354-f30e-43c1-80f3-1abbda26821d",
                        "on_chain_ref": "AdventurerOfThiolden23127",
                        "experience": 1010,
                        "in_quest": true,
                        "type": "aot",
                        "metadata": {},
                        "class": "blacksmith",
                        "race": "human",
                        "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                    }
                },
                {
                    "taken_quest_id": "fb181bff-34ee-45fd-83d8-2bc6ab49e921",
                    "adventurer_id": "e12f1011-4124-4ecf-8a65-b34ef71a0ca0",
                    "adventurer": {
                        "id": "e12f1011-4124-4ecf-8a65-b34ef71a0ca0",
                        "on_chain_ref": "AdventurerOfThiolden24383",
                        "experience": 1010,
                        "in_quest": true,
                        "type": "aot",
                        "metadata": {},
                        "class": "carpenter",
                        "race": "human",
                        "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                    }
                },
                {
                    "taken_quest_id": "fb181bff-34ee-45fd-83d8-2bc6ab49e921",
                    "adventurer_id": "f795b92c-d9fc-43bf-a162-4283841b6d0b",
                    "adventurer": {
                        "id": "f795b92c-d9fc-43bf-a162-4283841b6d0b",
                        "on_chain_ref": "AdventurerOfThiolden24021",
                        "experience": 1010,
                        "in_quest": true,
                        "type": "aot",
                        "metadata": {},
                        "class": "knight",
                        "race": "human",
                        "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                    }
                }
            ]
        }
    }

    async module_getTakenQuests(userId: string): Promise<object[]> {
        return [
            {
                "id": "2861f7b0-3e09-43dd-bcba-1304c10d9956",
                "started_on": "2023-01-27T16:34:01.090Z",
                "state": "succeeded",
                "is_claimed": false,
                "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49",
                "quest_id": "1c15fe8d-cd04-4996-982a-a784b1d78c7a",
                "quest": {
                    "id": "1c15fe8d-cd04-4996-982a-a784b1d78c7a",
                    "name": "MISSING TOWNFOLK",
                    "description": "Kind adventurers wanted. Our villagers have been disappearing! To the <b>north of Farvirheim, across the river and near the great ruins</b> we have identified <b>a clan of wild Beastmen</b>. It must be related! Our nijmkjold is lacking personel. Neighbours have cooperated with a <b>just</b> reward of <b>3</b> Dragon Silver.",
                    "reward_ds": 3,
                    "reward_xp": 1,
                    "difficulty": 2,
                    "slots": 4,
                    "rarity": "townsfolk",
                    "duration": 120763172,
                    "requirements": {
                        "party": {
                            "balanced": true
                        },
                        "character": []
                    },
                    "is_war_effort": false
                },
                "enrolls": [
                    {
                        "taken_quest_id": "2861f7b0-3e09-43dd-bcba-1304c10d9956",
                        "adventurer_id": "6be775ac-821c-4189-b07d-3927686dacb2",
                        "adventurer": {
                            "id": "6be775ac-821c-4189-b07d-3927686dacb2",
                            "on_chain_ref": "AdventurerOfThiolden9977",
                            "experience": 195,
                            "in_quest": true,
                            "type": "aot",
                            "metadata": {},
                            "class": "blacksmith",
                            "race": "human",
                            "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                        }
                    },
                    {
                        "taken_quest_id": "2861f7b0-3e09-43dd-bcba-1304c10d9956",
                        "adventurer_id": "9a803992-d35d-4e2a-884e-6985f44439d1",
                        "adventurer": {
                            "id": "9a803992-d35d-4e2a-884e-6985f44439d1",
                            "on_chain_ref": "AdventurerOfThiolden1188",
                            "experience": 195,
                            "in_quest": true,
                            "type": "aot",
                            "metadata": {},
                            "class": "trader",
                            "race": "vulkin",
                            "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                        }
                    },
                    {
                        "taken_quest_id": "2861f7b0-3e09-43dd-bcba-1304c10d9956",
                        "adventurer_id": "3ce7852c-0e2d-4247-8f78-78ba91c75cc9",
                        "adventurer": {
                            "id": "3ce7852c-0e2d-4247-8f78-78ba91c75cc9",
                            "on_chain_ref": "AdventurerOfThiolden9852",
                            "experience": 180,
                            "in_quest": true,
                            "type": "aot",
                            "metadata": {},
                            "class": "druid",
                            "race": "elf",
                            "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                        }
                    }
                ]
            },
            {
                "id": "5b648a50-278d-41d1-85f3-b3179395a7e4",
                "started_on": "2023-01-28T03:54:01.748Z",
                "state": "succeeded",
                "is_claimed": false,
                "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49",
                "quest_id": "93553146-6413-4ea2-8726-060da1e5d5ab",
                "quest": {
                    "id": "93553146-6413-4ea2-8726-060da1e5d5ab",
                    "name": "MISSING TOWNFOLK",
                    "description": "Kind adventurers wanted. Our villagers have been disappearing! To the <b>west of Vis, in the dark forest of Kilingard</b> we have identified <b>a young Hippogryph</b>. It must be related! Our nijmkjold is lacking personel. Neighbours have cooperated with a <b>just</b> reward of <b>1</b> Dragon Silver.",
                    "reward_ds": 1,
                    "reward_xp": 1,
                    "difficulty": 1,
                    "slots": 4,
                    "rarity": "townsfolk",
                    "duration": 128645870,
                    "requirements": {
                        "party": {
                            "balanced": true
                        },
                        "character": []
                    },
                    "is_war_effort": false
                },
                "enrolls": [
                    {
                        "taken_quest_id": "5b648a50-278d-41d1-85f3-b3179395a7e4",
                        "adventurer_id": "e1b7ac42-0a2d-4da4-a195-0cef0e0902a9",
                        "adventurer": {
                            "id": "e1b7ac42-0a2d-4da4-a195-0cef0e0902a9",
                            "on_chain_ref": "AdventurerOfThiolden6280",
                            "experience": 180,
                            "in_quest": true,
                            "type": "aot",
                            "metadata": {},
                            "class": "brewer",
                            "race": "elf",
                            "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                        }
                    },
                    {
                        "taken_quest_id": "5b648a50-278d-41d1-85f3-b3179395a7e4",
                        "adventurer_id": "658e28db-0e79-437f-b578-e40690d32cbf",
                        "adventurer": {
                            "id": "658e28db-0e79-437f-b578-e40690d32cbf",
                            "on_chain_ref": "AdventurerOfThiolden23783",
                            "experience": 180,
                            "in_quest": true,
                            "type": "aot",
                            "metadata": {},
                            "class": "warlock",
                            "race": "tiefling",
                            "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                        }
                    },
                    {
                        "taken_quest_id": "5b648a50-278d-41d1-85f3-b3179395a7e4",
                        "adventurer_id": "c5c072c2-361e-4fb8-b73c-7bc6086ac1ca",
                        "adventurer": {
                            "id": "c5c072c2-361e-4fb8-b73c-7bc6086ac1ca",
                            "on_chain_ref": "AdventurerOfThiolden14952",
                            "experience": 120,
                            "in_quest": true,
                            "type": "aot",
                            "metadata": {},
                            "class": "blacksmith",
                            "race": "human",
                            "user_id": "5e402098-be38-4bba-9ea8-d97e2b5c9c49"
                        }
                    }
                ]
            }
        ]
    }

    async module_getAvailableQuests(userId: string): Promise<object[]> {
        return (await this.getAvailableQuests("Auristar")).quests.map(quest => {
            const baseRewardCurrencies = this.rewardCalculator.baseReward(quest.requirements).currencies ?? []
            return { ...quest,
                "id": quest.questId,
                "reward_ds": parseInt(baseRewardCurrencies[0]?.quantity),
                "reward_xp": 1,
                "difficulty": 1,
                "rarity": "townsfolk",
                "is_war_effort": false
            }
        })
        /*
        return [
            {
                "id": "84daa515-72b4-4f96-916e-0c24bb3c3be2",
                "name": "SPRITES, CUTE BUT ANNOYING!",
                "description": "Farmers and miners have reported property damage made by <b>playful and anoying river Sprites</b>. Therefore, help is needed to deal with the infestation. Your adventuring party can find them at the <b>western caverns of Auristar, the cosmic caves known as the Starifjolden</b>. The local farmers and miners promise a <b>modest</b> compensation of <b>3</b> Dragon Silver.",
                "reward_ds": 3,
                "reward_xp": 1,
                "difficulty": 3,
                "slots": 4,
                "rarity": "townsfolk",
                "duration": 161602223,
                "requirements": {
                    "character": [
                        {
                            "race": "elf",
                            "class": "cleric"
                        },
                        {
                            "race": "tiefling"
                        }
                    ]
                },
                "is_war_effort": false
            },
        ]
        */
    }

}