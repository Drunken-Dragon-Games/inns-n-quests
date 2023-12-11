import { ClaimStatus } from "../service-asset-management"
import { CollectionFilter, CollectionWithGameData, CollectionWithUIMetada, GetCollectionResult } from "../service-collection"
import { PublicBallot, StoredBallot, StoredUserBallot, UserBallot } from "../service-governance"
import { AuthenticationTokens, UserFullInfo } from "../service-identity"
import { LoggingContext } from "../tools-tracing"
import { SResult } from "../tools-utils"

export interface AccountService {
    authenticateDevelopment(nickname: string, logger?: LoggingContext): Promise<AuthenticateResult>
    authenticateDiscord(code: string, logger?: LoggingContext): Promise<AuthenticateResult>
    signout(sessionId: string, logger?: LoggingContext): Promise<SignOutResult>
    refreshSession(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<AuthenticateResult>
    getAssociationNonce(stakeAddress: string, logger?: LoggingContext): Promise<GetAssociationNonceResult>
    submitAssociationSignature(userId: string, nonce: string, publicKey: string, signature: string, logger?: LoggingContext): Promise<SubmitAssociationSignatureResult>
    deassociateWallet(userId: string, stakeAddress: string, logger?: LoggingContext): Promise<DeassociationResult>
    getDragonSilverClaims(userId: string, page?: number, logger?: LoggingContext): Promise<GetDragonSilverClaimsResult>
    testClaimNFTs(userId: string, address: string, logger?: LoggingContext): Promise<ClaimFaucetResult>
    faucetSubmmit(serializedSignedTx: string, logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult>
    claimDragonSilver(userId: string, stakeAddress: string, address: string, logger?: LoggingContext): Promise<ClaimDragonSilverResult>
    claimSignAndSubbmit(serializedSignedTx: string, claimId: string, logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult>
    getUserInventory(userId: string, logger?: LoggingContext): Promise<GetUserInventoryResult>
    claimStatus(claimId: string, logger?: LoggingContext): Promise<ClaimStatusResult>
    grantTest(userId: string, logger?: LoggingContext): Promise<void>
    getOpenBallots(logger?: LoggingContext): Promise<OpenBallotsResult>
    getUserOpenBallots(userId: string, logger?: LoggingContext): Promise<OpenUserBallotsResult>
    voteForBallot(userId: string, ballotId: string, optionIndex: number, logger?: LoggingContext): Promise<VoteResult>
    getPublicBallots(logger?: LoggingContext): Promise<PublicBallotResult>
    getUserBallots(userId: string, logger?: LoggingContext):Promise<UserBallotResult>
    getAssociationTx(userId: string, stakeAddress: string, address: string, logger?: LoggingContext): Promise<CreateAssociationTxResult>
    submitAssociationTx(userId: string, serializedSignedTx: string, authStateId: string,  logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult>
    cleanAssociationState(authStateId: string, error: string, logger?: LoggingContext): Promise<CleanAssociationTxResult>
    getUserDisplayCollection(userId: string, pageSize: number, filter?: CollectionFilter,  logger?: LoggingContext): Promise<UserCollectionWithMetadataResult>
    getUserMortalCollection(userId: string, logger?: LoggingContext): Promise<UserMortalCollectionResult>
    getUserWeeklyPasiveEarnings(userId: string, logger?: LoggingContext): Promise<UserWeeklyPasiveEarnings>
    modifyMortalCollection(userId: string, assetRef: string, action: "add" | "remove", logger?: LoggingContext): Promise<ModifyMortalCollectionResult>
    syncUserCollection(userId: string, logger?: LoggingContext):Promise<SyncUserCollectionResult>
    lockMortalCollection(userId: string, logger?: LoggingContext):Promise<SyncUserCollectionResult>
    getMortalCollectionLockedState(userId: string, logger?: LoggingContext):Promise<MortalCollectionLockedStateResult>
    setMortalCollection(userId: string, assets: CollectionAssets, logger?: LoggingContext): Promise<SyncUserCollectionResult>
}

export type CleanAssociationTxResult 
    = {status: "ok"}
    | {status: "invalid", reason: string}

export type AuthenticateResult
    = { status: "ok", tokens: AuthenticationTokens, inventory: {dragonSilver: string, dragonSilverToClaim: string, dragonGold: string}, info: UserFullInfo }
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

export type DeassociationResult
    = SResult<{}>

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

export type CreateAssociationTxResult
    = { status: "ok", rawTx: string, authStateId: string }
    | { status: "invalid", reason: string }

export type AssociationNonceResult = ClaimSignAndSubbmitResult

export type ClaimDragonSilverResult
    = { status: "ok", claimId: string, tx: string, remainingAmount: number }
    | { status: "invalid", reason: string, remainingAmount?: number }

export type ClaimFaucetResult
    = { status: "ok", tx: string }
    | { status: "invalid", reason: string}

export type ClaimSignAndSubbmitResult 
    = { status: "ok", txId: string }
    | { status: "invalid", reason: string }

export type ClaimStatusResult
    = { status: "ok", claimStatus: ClaimStatus }
    | { status: "invalid", reason: string }

export type GetUserInventoryResult
    = { status: "ok", dragonSilverToClaim: string, dragonSilver: string, dragonGold: string}
    | { status: "unknown-user" }

export type OpenBallotsResult
    = { status: "ok", payload: {[ballotId: string]: StoredBallot}}
    | { status: "invalid", reason: string }

export type OpenUserBallotsResult =
    {status: "ok", payload: {[ballotId: string]: StoredUserBallot}}|
    {status: "invalid", reason: string}

export type VoteResult
    = { status: "ok" }
    | { status: "invalid", reason: string }

export type PublicBallotResult =
  {status: "ok", payload: {[ballotId: string]: PublicBallot}}|
  {status: "invalid", reason: string}

export type UserBallotResult =
  {status: "ok", payload: {[ballotId: string]: UserBallot}}|
  {status: "invalid", reason: string}

export type UserCollectionWithMetadataResult
    = {status: "ok", collection: CollectionWithUIMetada, hasMore: boolean}
    | {status: "invalid", reason: string}

export type UserMortalCollectionResult
    = {status: "ok", collection: CollectionWithGameData}
    | {status: "invalid", reason: string}

export type UserWeeklyPasiveEarnings
    = {status: "ok", weeklyEarnings: number}
    | {status: "invalid", reason: string}

export type ModifyMortalCollectionResult
    = {status: "ok"}
    | {status: "invalid", reason: string}

export type SyncUserCollectionResult
    = {status: "ok"}
    | {status: "invalid", reason: string}

export type MortalCollectionLockedStateResult
    = {status: "ok", locked: boolean}
    | {status: "invalid", reason: string}

export type InitAotSellResult
    = {status: "ok", contractId: string, depositTx: string, orderId: string}
    | {status: "invalid", reason: string}

export type CollectionAssets = { assetRef: string; quantity: string; }[]