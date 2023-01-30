import { LoggingContext } from "../tools-tracing"
import { HealthStatus } from "../tools-utils"
import * as models from "./models"

export interface SecureSigningService {

    health(logger?: LoggingContext): Promise<HealthStatus>

    policy(policyId: string, logger?: LoggingContext): Promise<models.PolicyResult>

    signTx(policyId: string, transaction: string, logger?: LoggingContext): Promise<models.SignTxResult>

    signWithPolicy(policyId: string, transaction: string, logger?: LoggingContext): Promise<models.SignTxResult>

    signData(policyId: string, payload: string, logger?: LoggingContext): Promise<models.SignDataResult>
}
