import { LoggingContext } from "../tools-tracing"
import { ObjectsLocations } from "./game-vm"
import { AcceptQuestResult, ClaimQuestResult, GetAvailableQuestsResult, GetInventoryResult, GetTakenQuestsResult, HealthStatus, IdleQuestsService } from "./service-spec"

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

    async health(logger?: LoggingContext): Promise<HealthStatus> {
        const serviceLogger = this.withComponent(logger)
        const status = await this.base.health(serviceLogger)
        if (status.status != "ok") 
            serviceLogger?.log.warn("unhealthy", { status } )
        return status 
    }

    async getInventory(userId: string): Promise<GetInventoryResult> {
        return await this.base.getInventory(userId)
    }

    async getAvailableQuests(location: string): Promise<GetAvailableQuestsResult> {
        return await this.base.getAvailableQuests(location)
    }

    async acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<AcceptQuestResult> {
        return await this.base.acceptQuest(userId, questId, adventurerIds)
    }

    async getTakenQuests(userId: string): Promise<GetTakenQuestsResult> {
        return await this.base.getTakenQuests(userId)
    }

    async claimQuestResult(userId: string, takenQuestId: string): Promise<ClaimQuestResult> {
        return await this.base.claimQuestResult(userId, takenQuestId)
    }

    async grantTestInventory(userId: string): Promise<GetInventoryResult> {
        return await this.base.grantTestInventory(userId)
    }

    async setInnState(userId: string, name?: string, objectLocations?: ObjectsLocations): Promise<void> {
        return await this.base.setInnState(userId, name, objectLocations)
    }
}
