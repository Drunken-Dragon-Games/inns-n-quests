import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"

export interface AssetStoreDSL {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    initAOTContract(buyerAddres: string, quantity: number, logger?: LoggingContext): Promise<SResult<{contractId: string}>>

}
