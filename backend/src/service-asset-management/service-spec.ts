import { LoggingContext } from "../tools-tracing"
import * as models from "./models"

export const endpoints =
    { "health": { method: "get", path: "/api/health" }
    , "registry": { method: "get", path: "/api/registry" }
    , "list": { method: "get", path: "/api/assets" }
    , "grant": { method: "post", path: "/api/assets/grant" }
    , "claim": { method: "post", path: "/api/assets/claim" }
    , "submitClaimSignature": { method: "post", path: "/api/assets/claim/sign" }
    , "claimStatus": { method: "get", path: "/api/assets/claim/status" }
    }

export interface AssetManagementService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    registry(logger?: LoggingContext): models.RegistryPolicy[]

    wellKnownPolicies(logger?: LoggingContext): models.WellKnownPolicies

    list(userId: string, logger?: LoggingContext, options?: { count?: number, page?: number, chain?: boolean , policies?: string[] }): Promise<models.ListResponse>

    grant(userId: string, asset: { unit: string, policyId: string, quantity: string }, logger?: LoggingContext): Promise<models.GrantResponse>

    claim(userId: string, stakeAddress: string, asset: { unit: string, policyId: string, quantity?: string }, logger?: LoggingContext): Promise<models.ClaimResponse>

    submitClaimSignature(claimId: string, tx: string, witness: string, logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse>

    claimStatus(claimId: string, logger?: LoggingContext): Promise<models.ClaimStatusResponse>

    revertStaledClaims(logger?: LoggingContext): Promise<number>
}
