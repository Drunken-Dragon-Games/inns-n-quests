import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"

export interface AssetStoreDSL {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    initAOTContract(userId: string, buyerAddres: string, quantity: number, logger?: LoggingContext): Promise<SResult<{contractId: string}>>

}
