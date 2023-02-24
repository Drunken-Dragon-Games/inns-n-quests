import { LoggingContext } from "../tools-tracing"
import AdventurerFun from "./items/adventurer-fun"
import FurnitureFun from "./items/furniture-fun"
import * as models from "./models"

export interface IdleQuestsService {

    adventurerFun: AdventurerFun 

    furnitureFun: FurnitureFun

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    getInventory(userId: string): Promise<models.GetInventoryResult>

    getAvailableQuests(location: string): Promise<models.GetAvailableQuestsResult>

    acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<models.AcceptQuestResult>

    getTakenQuests(userId: string): Promise<models.GetTakenQuestsResult>

    claimQuestResult(userId: string, takenQuestId: string): Promise<models.ClaimQuestResult>
}
