import dotenv from "dotenv"
import { IdleQuestsService } from "./service-spec"
import { QueryInterface, Sequelize } from "sequelize"
import { LoggingContext } from "../tools-tracing"
import { buildMigrator } from "../tools-database"
import path from "path"
import { Umzug } from "umzug"
import { IdleQuestsServiceLogging } from "./logging"

import { HealthStatus } from "./models"

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

}
