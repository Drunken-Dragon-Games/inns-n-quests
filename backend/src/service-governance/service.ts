import path from "path"
import { QueryInterface, Sequelize } from "sequelize"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { GovernanceService } from "./service-spec"
import dotenv from "dotenv"

import * as models from "./models"
import * as ballotDB from "./ballots/ballots-db"

import { config, HealthStatus } from "../tools-utils"

import { Ballots } from "./ballots/ballot-dsl"

export type GovernanceServiceDependencies = {
    database: Sequelize
}

export type GovernanceServiceConfig = {

}

export class GovernanceServiceDsl implements GovernanceService {

    private readonly migrator: Umzug<QueryInterface>

    constructor(
        private readonly database: Sequelize
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: GovernanceServiceDependencies): Promise<GovernanceService> {
        dotenv.config()
        return await GovernanceServiceDsl.loadFromConfig({}, dependencies)
    }
    static async loadFromConfig(servConfig: GovernanceServiceConfig, dependencies: GovernanceServiceDependencies): Promise<GovernanceService> {
        const service = new GovernanceServiceDsl( dependencies.database)
            
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        ballotDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
        await this.database.close()
    }

    async health(): Promise<HealthStatus> {
        let dbHealth: "ok" | "faulty"
        try { await this.database.authenticate(); dbHealth = "ok" }
        catch (e) { console.error(e); dbHealth = "faulty" }
        return {
            status: dbHealth,
            dependencies: [{ name: "database", status: dbHealth }]
        }
    }

    async addBallot(ballot: models.registerBallot):Promise<models.RegisterBallotResponse>{
        return await Ballots.register(ballot)
    }

    async getBallots(state?: models.BallotState | undefined): Promise<models.MultipleBallots> {
        const ballots = await Ballots.getBallots(state)
        return Ballots.processBallots(ballots)
    }

    async getBallot(ballotId: string): Promise<models.GetBallotResponse> {
        return await Ballots.getProcessedBallot(ballotId)
    }

    async closeBallot(ballotId: string): Promise<models.CloseBallotResponse> {
       return await Ballots.closeBallot(ballotId)
    }


}

