import * as models from "./models"
import { HealthStatus } from "../tools-utils"
export interface GovernanceService {
    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(): Promise<HealthStatus>

    addBallot(ballot: models.registerBallotType):Promise<models.RegisterBallotResponse>

    getBallots(state?: models.BallotState):Promise<models.MultipleBallots>

    getUserOpenBallots(userId: string): Promise<models.MultipleUserBallots>

    getBallot(ballotId: string):Promise<models.GetBallotResponse>

    closeBallot(ballotId: string): Promise<models.CloseBallotResponse>

    voteForBallot(ballotId: string, optionIndex: number, userId: string, dragonGold: number): Promise<models.voteResponse>
}