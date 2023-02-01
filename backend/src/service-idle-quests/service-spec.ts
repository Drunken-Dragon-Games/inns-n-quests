import { LoggingContext } from "../tools-tracing"
import * as models from "./models"


import * as module_models from "../module-quests/adventurers/models"


export interface IdleQuestsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    module_getAllAdventurers(userId: string): Promise<object[]>

    module_getAvailableQuests(userId: string): Promise<object[]> 

    module_acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<object>

    module_getTakenQuests(userId: string): Promise<object[]>

    module_claimQuestResult(userId: string, questId: string): Promise<object>

    getAllAdventurers(): Promise<models.GetAllAdventurersResult>
}
