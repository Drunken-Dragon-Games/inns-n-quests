import { LoggingContext } from "../tools-tracing"
import * as models from "./models"

export interface IdleQuestsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    //getItems(challengesType: models.ChallengesType): Promise<models.Item[]>

    //getChallenges(challengesType: models.ChallengesType): Promise<models.Challenge[]>
}
