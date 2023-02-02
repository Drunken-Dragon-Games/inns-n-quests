import { LoggingContext } from "../tools-tracing";
import * as models from "./models"
import { IdleQuestsService } from "./service-spec"

export class IdleQuestsServiceLogging implements IdleQuestsService {

    constructor(private base: IdleQuestsService) {}

    private withComponent(logger?: LoggingContext): LoggingContext | undefined {
        return logger?.withComponent("idle-quests-service")
    }

    async loadDatabaseModels(): Promise<void> { 
        await this.base.loadDatabaseModels() 
    }

    async unloadDatabaseModels(): Promise<void> { 
        await this.base.unloadDatabaseModels() 
    }

    async health(logger?: LoggingContext): Promise<models.HealthStatus> {
        const serviceLogger = this.withComponent(logger)
        const status = await this.base.health(serviceLogger)
        if (status.status != "ok") 
            serviceLogger?.log.warn("unhealthy", { status } )
        return status 
    }

    async module_getAllAdventurers(userId: string): Promise<object[]> {
        return await this.base.module_getAllAdventurers(userId)
    }

    async module_getAvailableQuests(userId: string): Promise<object[]> {
        return await this.base.module_getAvailableQuests(userId)
    }

    async module_acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<object> {
        return await this.base.module_acceptQuest(userId, questId, adventurerIds)
    }

    async module_getTakenQuests(userId: string): Promise<object[]> {
        return await this.base.module_getTakenQuests(userId)
    }

    async module_claimQuestResult(userId: string, questId: string): Promise<object> {
        return await this.base.module_claimQuestResult(userId, questId)
    }

    async getAllAdventurers(userId: string): Promise<models.GetAllAdventurersResult> {
        return await this.base.getAllAdventurers(userId)
    }
}
