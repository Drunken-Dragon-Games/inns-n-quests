import { MinimalUTxO } from "../tools-cardano"
import { LoggingContext } from "../tools-tracing"
import * as models from "./models"

export interface AssetManagementService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    list(userId: string, options: { count?: number, page?: number, chain?: boolean , policies?: string[] }, logger?: LoggingContext): Promise<models.ListResponse>

    listChainAssetsByAddress(addresses: string[], policies: string[], logger?: LoggingContext, ): Promise<models.ListResponse>
    
    grant(userId: string, asset: models.AssetUnit, logger?: LoggingContext): Promise<models.GrantResponse>

    grantMany(userId: string, asset: models.AssetUnit[], logger?: LoggingContext): Promise<models.GrantResponse>

	userClaims(userId: string, unit: string, page?: number, logger?: LoggingContext): Promise<models.UserClaimsResponse> 

    claim(userId: string, stakeAddress: string, address: string, asset: { unit: string, policyId: string, quantity?: string }, logger?: LoggingContext): Promise<models.ClaimResponse>

    faucetClaim(address: string, assetsInfo: { [policyId: string]: { unit: string; quantityToClaim: string; }[]; }, logger?: LoggingContext | undefined): Promise<models.FaucetClaimResponse>

    //DEPRECATED
    createAssociationTx(stakeAddress: string, MinimalUTxOs: MinimalUTxO[], logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse>

    submitAuthTransaction(witness: string, tx: string, logger?: LoggingContext): Promise<models.SubmitAuthTransactionResult>
    
    submitClaimSignature(claimId: string, serializedSignedTx: string, logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse>

    faucetClaimSubmmit(serializedSignedTx: string, logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse>

    claimStatus(claimId: string, logger?: LoggingContext): Promise<models.ClaimStatusResponse>

    revertStaledClaims(logger?: LoggingContext): Promise<number>
}
