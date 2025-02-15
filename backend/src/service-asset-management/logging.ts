import { MinimalUTxO } from "../tools-cardano";
import { LoggingContext } from "../tools-tracing";
import * as models from "./models"
import { AssetManagementService } from "./service-spec"

export class AssetManagementServiceLogging implements AssetManagementService {

    constructor(private base: AssetManagementService) {}

    private withComponent(logger?: LoggingContext): LoggingContext | undefined {
        return logger?.withComponent("asset-management-service")
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

    async list(userId: string, options: { count?: number, page?: number, chain?: boolean , policies?: string[] }, logger?: LoggingContext): Promise<models.ListResponse> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.list(userId, options, serviceLogger)
        serviceLogger?.log.info(`listing assets for user ${userId}, result was ${response.status}`, options)
        return response
    }

    async grant(userId: string, asset: { unit: string, policyId: string, quantity: string }, logger?: LoggingContext): Promise<models.GrantResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`granting assets to user ${userId}`, { asset })
        const response = await this.base.grant(userId, asset, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid asset grant to user ${userId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`grant successful`)
        return response
    }

    async grantMany(userId: string, asset: { unit: string, policyId: string, quantity: string }[], logger?: LoggingContext): Promise<models.GrantResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`granting assets to user ${userId}`, { asset })
        const response = await this.base.grantMany(userId, asset, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid asset grant to user ${userId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`grant successful`)
        return response
    }

	async userClaims(userId: string, unit: string, page?: number, logger?: LoggingContext): Promise<models.UserClaimsResponse> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.userClaims(userId, unit, page, serviceLogger)
        serviceLogger?.log.info(`listing claims for user ${userId}, result was ${response.status}`)
        return response
    }

    async claim(userId: string, stakeAddress: string, address: string, asset: { unit: string, policyId: string, quantity?: string }, logger?: LoggingContext): Promise<models.ClaimResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`claiming assets for user ${userId}`, { address, asset })
        const response = await this.base.claim(userId, stakeAddress, address, asset, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid claim for user ${userId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`claim successful`)
        return response
    }

    async faucetClaim(address: string, assetsInfo: { [policyId: string]: { unit: string; quantityToClaim: string; }[]; }, logger?: LoggingContext | undefined): Promise<models.FaucetClaimResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`claiming assets for user `, { assetsInfo })
        const response = await this.base.faucetClaim(address, assetsInfo, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid claim for user reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`claim successful`)
        return response
    }

    async faucetClaimSubmmit(serializedSignedTx: string, logger?: LoggingContext | undefined): Promise<models.SubmitClaimSignatureResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`submmiting claim `)
        const response = await this.base.faucetClaimSubmmit(serializedSignedTx, logger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid submmit for user reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`submmit successful`)
        return response
    }

    async createAssociationTx(stakeAddress: string, MinimalUTxOs: MinimalUTxO[], logger?: LoggingContext | undefined): Promise<models.SubmitClaimSignatureResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`Creating Auth Tx for stake address`, { stakeAddress})
        const response = await this.base.createAssociationTx(stakeAddress, MinimalUTxOs, serviceLogger)
        if (response.status == "invalid"){
            //cambio el error real por un user facing error mas apropiado
            serviceLogger?.log.error(`invalid auth tx for for stake address ${stakeAddress} reason:${response.reason}`)
            //agrego el trace ID al userfacing error para facilitar debugging
            return {status:"invalid", reason: `blockfrost-error. error: ${logger?.traceId}`}
        }
        serviceLogger?.log.info(`Auth Tx created succesfully successful`)
        return response
    }

    async submitAuthTransaction(witness: string, tx: string, logger?: LoggingContext | undefined): Promise<models.SubmitAuthTransactionResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`submiting auth tx`)
        const response = await this.base.submitAuthTransaction(witness, tx, serviceLogger)
        if (response.status !== "ok"){
            //cambio el error real por un user facing error mas apropiado
            serviceLogger?.log.error(`failed to submit Assosiation tx reason: ${response.reason}`)
            //agrego el trace ID al userfacing error para facilitar debugging
            return {status:"invalid", reason: `Could not submit Transaction. error: ${logger?.traceId}`}
        }
        serviceLogger?.log.info(`succesfully submited Assosiation tx`)
        return response
    }

    async submitClaimSignature(claimId: string, serializedSignedTx: string, logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`Submitting claim signature for claim ${claimId}`)
        const response = await this.base.submitClaimSignature(claimId, serializedSignedTx, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`Claim signature invalid for claim ${claimId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`claim signature submited`)
        return response
    }

    async claimStatus(claimId: string, logger?: LoggingContext): Promise<models.ClaimStatusResponse> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.claimStatus(claimId, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`Claim ${claimId} status invalid reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`Claim ${claimId} status ok`)
        return response
    }

    async revertStaledClaims(logger?: LoggingContext): Promise<number> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.revertStaledClaims(serviceLogger)
        return response
    }
}
