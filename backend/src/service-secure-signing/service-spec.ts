import { LoggingContext } from "../tools-tracing.js"
import { HealthStatus } from "../tools-utils.js"
import * as models from "./models.js"
import { C as LucidCore, TxComplete } from "lucid-cardano"

export interface SecureSigningService {

    health(logger?: LoggingContext): Promise<HealthStatus>

    policy(policyId: string, logger?: LoggingContext): Promise<models.PolicyResult>

    signTx(policyId: string, transaction: string, logger?: LoggingContext): Promise<models.SignTxResult>

    signWithPolicy(policyId: string, transaction: string, logger?: LoggingContext): Promise<models.SignTxResult>

    signData(policyId: string, payload: string, logger?: LoggingContext): Promise<models.SignDataResult>

    lucidSignTx(policyId: string, transaction: TxComplete, logger?: LoggingContext): Promise<models.SignTxResult> 
}
