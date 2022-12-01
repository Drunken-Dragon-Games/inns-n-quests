import { LoggingContext } from "../tools-tracing"
import { HealthStatus } from "../tools-utils"
import * as models from "./models"
import { SecureSigningService } from "./service-spec"

export class SecureSigningServiceLogging implements SecureSigningService {

    constructor(private base: SecureSigningService) {}

    private withComponent(logger: LoggingContext): LoggingContext {
        return logger.withComponent("secure-signing-service")
    }

    async health(logger: LoggingContext): Promise<HealthStatus> {
        const serviceLogger = this.withComponent(logger)
        const status = await this.base.health(serviceLogger)
        if (status.status != "ok") 
            serviceLogger.warn("unhealthy", { status })
        return status 
    }

    async policy(policyId: string, logger: LoggingContext): Promise<models.PolicyResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger.info("looking for full policy", { policyId })
        const response = await this.base.policy(policyId, serviceLogger)
        serviceLogger.info("full policy", { status: response.status })
        return response
    }

    async signTx(policyId: string, transaction: string, logger: LoggingContext): Promise<models.SignTxResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger.info("signing transaction", { policyId })
        const response = await this.base.signTx(policyId, transaction, serviceLogger)
        serviceLogger.info("transaction signing outcome", { status: response.status })
        return response
    }

    async signWithPolicy(policyId: string, transaction: string, logger: LoggingContext): Promise<models.SignTxResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger.info("signing transaction with policy", { policyId })
        const response = await this.base.signWithPolicy(policyId, transaction, serviceLogger)
        serviceLogger.info("signing transaction with policy outcome", { status: response.status })
        return response
    }

    async signData(policyId: string, payload: string, logger: LoggingContext): Promise<models.SignDataResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger.info("signing data", { policyId })
        const response = await this.base.signData(policyId, payload, serviceLogger)
        serviceLogger.info("signing data outcome", { status: response.status })
        return response
    }
}
