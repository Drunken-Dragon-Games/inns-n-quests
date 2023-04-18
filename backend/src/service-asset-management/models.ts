import { MinimalUTxO } from "../tools-cardano"

export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export type Inventory = 
    { [policyId: string]: { unit: string, quantity: string, chain: boolean }[] }

export type AssetUnit = {
    unit: string,
    policyId: string,
    quantity: string,
}

export type DDUAsset =
    { unit: string
    , policyId: string
    , quantity: string 
    , chain: boolean
    }

export interface AssetClaim {
    claimId: string,
    userId: string,
    policyId: string,
    unit: string,
    quantity: string,
    state: ClaimStatus,
    txId?: string,
    createdAt: string
}

export type ClaimerInfo = {
    utxos: MinimalUTxO[],
    receivingAddress: string,
}

export type ListResponse 
    = { status: "ok", inventory: Inventory }
    | { status: "unknown-user" }

export type ClaimStatus 
    = "created"
    | "submitted"
    | "timed-out"
    | "confirmed"
//    | "error"

export type UserClaimsResponse
    = { status: "ok", claims: AssetClaim[] }
    | { status: "invalid", reason: string }

export type GrantResponse
    = { status: "ok" }
    | { status: "invalid", reason: string }

export type ClaimResponse
    = { status: "ok", claimId: string, tx: string }
    | { status: "invalid", reason: string }

export type SubmitClaimSignatureResponse
    = { status: "ok", txId: string }
    | { status: "invalid", reason: string }

export type ClaimStatusResponse
    = { status: "ok", claimStatus: ClaimStatus }
    | { status: "invalid", reason: string }

export type LucidClaimResponse
    = { status: "ok", claimId: string, tx: string, dragonSilverWitness: string }
    | { status: "invalid", reason: string }

export type LucidReportSubmissionResponse 
    = { status: "ok" }
    | { status: "invalid", reason: string }
