import path from "path"
import { QueryInterface, Sequelize } from "sequelize"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { GovernanceService } from "./service-spec"

import * as models from "./models"

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

    async loadDatabaseModels(): Promise<void> {}

    async unloadDatabaseModels(): Promise<void> {}

    async addBallot(ballot: models.Ballot):Promise<models.AddBallotResponse>{
        return {state: "error", reason: "not implemented yet"}
    }

}