import { Lucid, UTxO as LucidUTxO, Utils } from "lucid-cardano"

export type UserInfo = {
    userId: string
    sessionId: string
    nickname: string
    stakeAddresses: string[]
    profileUri: string
    email: string
    dragonSilver: string
    dragonSilverToClaim: string
    dragonGold: string
}

export const SupportedWallets = [ "Nami", "Eternl" ] as const

export type SupportedWallet = typeof SupportedWallets[number]

export type Session = {
    userId: string, 
    sessionId: string, 
    authType: AuthType, 
    expiration: number
}

export type AuthType = "Sig" | "Discord" | "Email"

export type AuthenticationTokens = {
    session: Session, 
    refreshToken: string
}

export type UserFullInfo = {
    userId: string, 
    nickname: string, 
    knownDiscord?: string, 
    knownStakeAddresses: string[],
    imageLink: string,
    knownEmail: string
}

export type BallotState = "open" | "closed" | "archived"

export type StoredBallot = {
    id: string, 
    inquiry: string, 
    descriptionOfInquiry: string, 
    options: {
        option: string, 
        description: string
    }[], 
    voteRegistered: boolean, 
    state: BallotState
}

export type GovernaceState
    = { ctype: "idle" }
    | { ctype: "loading", details: string }
    | { ctype: "error", details: string };

export type WalletAssociationProcessState
    = { ctype: "idle" }
    | { ctype: "loading", details: string }
    | { ctype: "error", details: string };

export type ClaimProcessState
    = { ctype: "idle" }
    | { ctype: "loading", claimStatus: ClaimStatus, details: string }
    | { ctype: "error", details: string }

export type ClaimStatus 
    = "created"
    | "submitted"
    | "timed-out"
    | "confirmed"

export type ClaimInfo = { 
    claimId: string, 
    quantity: string,
    state: ClaimStatus,
    txId?: string,
    createdAt: string
}

export type ClaimerInfo = {
    utxos: UTxOMinimal[],
    receivingAddress: string,
}

export type UTxOMinimal = {
    txHash: string
    outputIndex: number
    assets: Assets
    address: string
}

export declare type Unit = string

export declare type Assets = Record<Unit | "lovelace", string>

export type ExtractWalletResult
    = { status: "ok", walletApi: Lucid, stakeAddress: string, }
    | { status: "error", details: string }

export const minimalUtxoFromLucidUTxO = (utxo: LucidUTxO[]): UTxOMinimal[] => utxo.map(utxo => ({
    txHash: utxo.txHash,
    outputIndex: utxo.outputIndex,
    assets: Object.keys(utxo.assets).reduce((acc, key) => ({ ...acc, [key]: utxo.assets[key].toString() }), {}),
    address: utxo.address,
}))

//types repeted form govenance
type BaseOption = {title: string, description: string}
type VotedOption = BaseOption & {isVotedByUser: boolean}
type SensitiveOption = BaseOption & {lockedInDragonGold: string}
type ClosedOption = SensitiveOption & {isWinner: boolean}
type UserClosedOption = ClosedOption & {isVotedByUser: boolean}

type BaseBallot = {status: BallotState, id: string,  inquiry: string, inquiryDescription: string}

type OpenPublicBallot = BaseBallot & {status: "open", options: BaseOption[]}
type ClosedPublicBallot = BaseBallot & {status: "closed", options: ClosedOption[]}

type OpenUserBallot = BaseBallot & {status: "open", hasVoted: boolean, options: VotedOption[]}
type ClosedUserBallot = BaseBallot & {status: "closed", hasVoted: boolean, options: UserClosedOption[]}

export type PublicBallot = OpenPublicBallot | ClosedPublicBallot
export type UserBallot = OpenUserBallot | ClosedUserBallot

export type GovernanceBallots
    = {[ballotId: string]: UserBallot}
    | {[ballotId: string]: PublicBallot}