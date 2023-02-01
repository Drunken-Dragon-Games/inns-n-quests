import { LoggingContext } from "../tools-tracing"
import * as models from "./models"


import * as module_models from "../module-quests/adventurers/models"


export interface IdleQuestsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    module_getAllAdventurers(): Promise<object[]>

    //getItems(challengesType: models.ChallengesType): Promise<models.Item[]>

    //getChallenges(challengesType: models.ChallengesType): Promise<models.Challenge[]>
    
}
