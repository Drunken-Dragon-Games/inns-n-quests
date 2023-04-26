import { ClaimerInfo } from "../service-asset-management"
import { AuthenticationTokens, UserFullInfo } from "../service-identity"

export interface AccountService {
    authenticateDevelopment(nickname: string): Promise<AuthenticateResult>
    authenticateDiscord(code: string): Promise<AuthenticateResult>
    signout(sessionId: string): Promise<SignOutResult>
    refreshSession(sessionId: string, refreshToken: string): Promise<AuthenticateResult>
    getAssociationNonce(stakeAddress: string): Promise<GetAssociationNonceResult>
    submitAssociationSignature(userId: string, nonce: string, publicKey: string, signature: string): Promise<SubmitAssociationSignatureResult>
    getDragonSilverClaims(userId: string, page?: number): Promise<GetDragonSilverClaimsResult>
    claimDragonSilver(userId: string, stakeAddress: string, claimerInfo: ClaimerInfo): Promise<ClaimDragonSilverResult>
    claimSignAndSubbmit(witness: string, tx: string, claimId: string): Promise<ClaimSignAndSubbmitResult>
    getUserInventory(userId: string): Promise<getUserInventoryResult>
    claimStatus(claimId: string): Promise<ClaimStatusResult>
    grantTest(userId: string): Promise<void>
    voteForBallot(userId: string, ballotId: string, optionIndex: number): Promise<VoteResult>
}

export type AuthenticateResult
    = { status: "ok", tokens: AuthenticationTokens, inventory: {dragonSilver: number, dragonSilverToClaim: number}, info: UserFullInfo }
    | { status: "bad-credentials" }
    | { status: "unknown-user" }

export type SignOutResult
    = { status: "ok" }
    | { status: "unknown-session" }

export type GetAssociationNonceResult
    = { status: "ok", nonce: string }
    | { status: "bad-address" }

export type SubmitAssociationSignatureResult
    = { status: "ok" }
    | { status: "bad-credentials" }
    | { status: "stake-address-used" }

export type GetDragonSilverClaimsResult
    = { status: "ok", 
        claims: { 
            claimId: string, 
            quantity: string,
            state: ClaimStatus,
            txId?: string,
            createdAt: string
        }[] }
    | { status: "invalid", reason: string }

export type ClaimDragonSilverResult
    = { status: "ok", claimId: string, tx: string, remainingAmount: number }
    | { status: "invalid", reason: string, remainingAmount?: number }


export type ClaimSignAndSubbmitResult 
    = { status: "ok", txId: string }
    | { status: "invalid", reason: string }

type ClaimStatus 
    = "created"
    | "submitted"
    | "timed-out"
    | "confirmed"

export type ClaimStatusResult
    = { status: "ok", claimStatus: ClaimStatus }
    | { status: "invalid", reason: string }

export type getUserInventoryResult
    = { status: "ok", dragonSilverToClaim: number, dragonSilver: number}
    | { status: "unknown-user" }

export type VoteResult 
    = { status: "ok" }
    | { status: "invalid", reason: string }

