import * as models from "./models.js"
import { HealthStatus } from "../tools-utils"
export interface GovernanceService {
    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(): Promise<HealthStatus>

    addBallot(ballot: models.registerBallotType):Promise<models.RegisterBallotResponse>

    getAdminBallotCollection(): Promise<models.AdminBallotCollection>

    getPublicBallotCollection(): Promise<models.PublicBallotCollection>

    getUserBallotCollection(userId: string): Promise<models.UserBallotCollection>

    getBallots(state?: models.BallotState):Promise<models.MultipleBallots>

    getUserOpenBallots(userId: string): Promise<models.MultipleUserBallots>

    getBallot(ballotId: string):Promise<models.GetBallotResponse>

    closeBallot(ballotId: string): Promise<models.CloseBallotResponse>

    voteForBallot(ballotId: string, optionIndex: number, userId: string, dragonGold: string): Promise<models.voteResponse>
}