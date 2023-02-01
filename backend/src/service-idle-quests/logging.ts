import { LoggingContext } from "../tools-tracing";
import * as models from "./models"
import { IdleQuestsService } from "./service-spec"


import * as module_models from "../module-quests/adventurers/models"


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

    async module_getAllAdventurers(): Promise<object[]> {
        return await this.base.module_getAllAdventurers()
    }
}
