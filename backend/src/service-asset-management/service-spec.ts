import { MinimalUTxO } from "../tools-cardano"
import { LoggingContext } from "../tools-tracing"
import * as models from "./models"

export interface AssetManagementService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    list(userId: string, options: { count?: number, page?: number, chain?: boolean , policies?: string[] }, logger?: LoggingContext): Promise<models.ListResponse>

    grant(userId: string, asset: models.AssetUnit, logger?: LoggingContext): Promise<models.GrantResponse>

    grantMany(userId: string, asset: models.AssetUnit[], logger?: LoggingContext): Promise<models.GrantResponse>

	userClaims(userId: string, unit: string, page?: number, logger?: LoggingContext): Promise<models.UserClaimsResponse> 

    claim(userId: string, stakeAddress: string, asset: { unit: string, policyId: string, quantity?: string }, claimerInfo?: models.ClaimerInfo, logger?: LoggingContext): Promise<models.ClaimResponse>

    createAssociationTx(stakeAddress: string, MinimalUTxOs: MinimalUTxO[], logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse>
    
    submitClaimSignature(claimId: string, tx: string, witness: string, logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse>

    claimStatus(claimId: string, logger?: LoggingContext): Promise<models.ClaimStatusResponse>

    revertStaledClaims(logger?: LoggingContext): Promise<number>
}
