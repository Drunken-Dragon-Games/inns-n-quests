import * as models from "./models"

export interface GovernanceService {
    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    addBallot(ballot: models.Ballot):Promise<models.AddBallotResponse>
}