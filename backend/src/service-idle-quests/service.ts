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
}
