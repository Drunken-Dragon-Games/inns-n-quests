import { ClaimerInfo } from "../service-asset-management"
import { AuthenticationTokens, UserFullInfo } from "../service-identity"
import { LoggingContext } from "../tools-tracing"
import { MinimalUTxO } from "../tools-cardano"

export interface AccountService {
    authenticateDevelopment(nickname: string, logger?: LoggingContext): Promise<AuthenticateResult>
    authenticateDiscord(code: string, logger?: LoggingContext): Promise<AuthenticateResult>
    signout(sessionId: string, logger?: LoggingContext): Promise<SignOutResult>
    refreshSession(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<AuthenticateResult>
    getAssociationNonce(stakeAddress: string, logger?: LoggingContext): Promise<GetAssociationNonceResult>
    submitAssociationSignature(userId: string, nonce: string, publicKey: string, signature: string, logger?: LoggingContext): Promise<SubmitAssociationSignatureResult>
    getDragonSilverClaims(userId: string, page?: number, logger?: LoggingContext): Promise<GetDragonSilverClaimsResult>
    claimDragonSilver(userId: string, stakeAddress: string, claimerInfo: ClaimerInfo, logger?: LoggingContext): Promise<ClaimDragonSilverResult>
    claimSignAndSubbmit(witness: string, tx: string, claimId: string, logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult>
    getUserInventory(userId: string, logger?: LoggingContext): Promise<GetUserInventoryResult>
    claimStatus(claimId: string, logger?: LoggingContext): Promise<ClaimStatusResult>
    grantTest(userId: string, logger?: LoggingContext): Promise<void>
    getOpenBallots(logger?: LoggingContext): Promise<OpenBallotsResult>
    getUserOpenBallots(userId: string, logger?: LoggingContext): Promise<OpenUserBallotsResult>
    voteForBallot(userId: string, ballotId: string, optionIndex: number, logger?: LoggingContext): Promise<VoteResult>
    getPublicBallots(logger?: LoggingContext): Promise<PublicBallotResult>
    getUserBallots(userId: string, logger?: LoggingContext):Promise<UserBallotResult>
    getAssociationTx(userId: string, stakeAddress: string, utxos: MinimalUTxO[], logger?: LoggingContext): Promise<CreateAssociationTxResult>
    submitAssociationTx(userId: string, witness: string, tx: string, authStateId: string, logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult>
    cleanAssociationState(userId: string, authStateId: string, logger?: LoggingContext): Promise<CleanAssociationTxResult>
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
    = { status: "ok", txId: string, authStateId: string }
    | { status: "invalid", reason: string }

export type AssociationNonceResult = ClaimSignAndSubbmitResult

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

//types repeted from governance service
type BallotState = "open"|"closed" | "archived"
export type StoredBallot = {id: string, inquiry: string, descriptionOfInquiry: string, options: {option: string, description: string ,dragonGold: string}[], state: BallotState}
export type StoredUserBallot = {id: string, inquiry: string, descriptionOfInquiry: string, options: {option: string, description: string }[], voteRegistered: boolean, state: BallotState}

//types repeted from govenance service
//types repeted on frontedn accound dsl
type BaseOption = {title: string, description: string}
type VotedOption = BaseOption & {isVotedByUser: boolean}
type SensitiveOption = BaseOption & {lockedInDragonGold: string}
type ClosedOption = SensitiveOption & {isWinner: boolean}
type UserClosedOption = ClosedOption & {isVotedByUser: boolean}

type BaseBallot = {status: BallotState, id: string,  inquiry: string , inquiryDescription: string}

type OpenPublicBallot = BaseBallot & {status: "open", options: BaseOption[]}
type ClosedPublicBallot = BaseBallot & {status: "closed", options: ClosedOption[]}

type OpenUserBallot = BaseBallot & {status: "open", hasVoted: boolean, options: VotedOption[]}
type ClosedUserBallot = BaseBallot & {status: "closed", hasVoted: boolean, options: UserClosedOption[]}

type PublicBallot = OpenPublicBallot | ClosedPublicBallot
type UserBallot = OpenUserBallot | ClosedUserBallot

export type PublicBallotResult =
  {status: "ok", payload: {[ballotId: string]: PublicBallot}}|
  {status: "invalid", reason: string}

export type UserBallotResult =
  {status: "ok", payload: {[ballotId: string]: UserBallot}}|
  {status: "invalid", reason: string}