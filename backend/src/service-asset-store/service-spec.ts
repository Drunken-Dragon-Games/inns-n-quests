import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { SuportedWallet } from "./models"

export interface AssetStoreDSL {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    initAOTContract(userId: string, browserWallet: SuportedWallet, buyerAddres: string, quantity: number, logger?: LoggingContext): Promise<SResult<{contractId: string}>>

    
}
