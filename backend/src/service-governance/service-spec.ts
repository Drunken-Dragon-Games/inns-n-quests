import * as models from "./models"
import { HealthStatus } from "../tools-utils"
export interface GovernanceService {
    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(): Promise<HealthStatus>

    addBallot(ballot: models.registerBallot):Promise<models.RegisterBallotResponse>
}