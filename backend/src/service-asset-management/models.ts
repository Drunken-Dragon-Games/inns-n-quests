
export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export type RegistryPolicy =
    { policyId: string
    , name: string
    , description: string
    , tags: string[]
    }

export type Inventory = 
    { [policyId: string]: { unit: string, quantity: string, chain: boolean }[] }

export type DDUAsset =
    { unit: string
    , policyId: string
    , quantity: string 
    , chain: boolean
    }

export type ListResponse 
    = { status: "ok", inventory: Inventory }
    | { status: "unknown-user" }

export type ClaimStatus 
    = "created"
    | "submitted"
    | "timed-out"
    | "confirmed"

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
