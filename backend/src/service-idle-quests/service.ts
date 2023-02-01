import dotenv from "dotenv"
import { IdleQuestsService } from "./service-spec"
import { QueryInterface, Sequelize } from "sequelize"
import { LoggingContext } from "../tools-tracing"
import { buildMigrator } from "../tools-database"
import path from "path"
import { Umzug } from "umzug"
import { IdleQuestsServiceLogging } from "./logging"

import { HealthStatus } from "./models"

import * as module_models from "../module-quests/adventurers/models"



export interface IdleQuestsServiceConfig 
    { 
    }

export interface AssetManagemenetServiceDependencies 
    { database: Sequelize
    }

export class IdleQuestsServiceDsl implements IdleQuestsService {

    private readonly migrator: Umzug<QueryInterface>

    constructor (
        private readonly database: Sequelize,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: AssetManagemenetServiceDependencies): Promise<IdleQuestsService> {
        dotenv.config()
        return await IdleQuestsServiceDsl.loadFromConfig(
            { 
            }, dependencies)
    }

    static async loadFromConfig(servConfig: IdleQuestsServiceConfig, dependencies: AssetManagemenetServiceDependencies): Promise<IdleQuestsService> {
        const service = new IdleQuestsServiceLogging(new IdleQuestsServiceDsl(
            dependencies.database,
        ))
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
    }

    async unloadDatabaseModels(): Promise<void> {
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

    async module_getAllAdventurers(): Promise<object[]> {
        return [
            {
                id: "6d550e6d-9822-4abc-a7db-f564f19e2bf7",
                on_chain_ref: "AdventurerOfThiolden7062",
                experience: 4120,
                in_quest: false,
                type: "aot",
                metadata: {},
                race: "human",
                class: "paladin",
                sprites: "https://cdn.ddu.gg/adv-of-thiolden/x6/tyr-front-plain.png",
                name: "Tyr"
            },
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
            {
                id: "005f9aaa-1634-44d1-95a8-b4597341d602",
                on_chain_ref: "AdventurerOfThiolden14073",
                experience: 130,
                in_quest: false,
                type: "aot",
                metadata: {},
                race: "worgenkin",
                class: "ranger",
                sprites: "https://cdn.ddu.gg/adv-of-thiolden/x6/friga-front-plain.png",
                name: "Friga"
            }
        ]
    }

    async module_getAvailableQuests(userId: string): Promise<object[]> {
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
            {
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
            {
                "id": "041c6665-1682-41f6-86dc-8765014ee534",
                "name": "SPRITES, CUTE BUT ANNOYING!",
                "description": "Farmers and miners have reported property damage made by <b>rock Sprites</b>. Therefore, help is needed to deal with the infestation. Your adventuring party can find them at the <b>western caverns of Auristar, the cosmic caves known as the Starifjolden</b>. The local farmers and miners promise a <b>just</b> compensation of <b>4</b> Dragon Silver.",
                "reward_ds": 4,
                "reward_xp": 1,
                "difficulty": 3,
                "slots": 3,
                "rarity": "townsfolk",
                "duration": 183308616,
                "requirements": {},
                "is_war_effort": false
            },
        ]
    }

    async module_acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<object> {
        return {
            "id": "fb181bff-34ee-45fd-83d8-2bc6ab49e921",
            "started_on": "2023-02-01T04:22:38.139Z",
            "state": "in_progress",
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
}
