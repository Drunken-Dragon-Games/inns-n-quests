import { v4 } from "uuid"
import axios, { AxiosError, AxiosResponse, Method } from "axios"
import urljoin from "url-join"
import { useRouter } from "next/router"
import router from "next/router"
import { SignedMessage } from "lucid-cardano"
import { AuthenticationTokens, ClaimInfo, ClaimStatus, ClaimerInfo, GovernanceBallots, PublicBallot, UTxOMinimal, UserBallot, UserFullInfo } from "./account-dsl"
import { CollectionFilter, CollectionWithGameData, CollectionWithUIMetada } from "../collection/collection-state-models"

export const AccountBackend = {

    async authenticateDevelopment(nickname: string, traceId?: string): Promise<AuthenticationResult> {
        const result = await accountRequest<AuthenticationResult>("POST", "/development/authenticate", {nickname}, traceId)
        return result.data
    },

    async authenticateDiscord(code: string, traceId?: string): Promise<AuthenticationResult> {
        const result = await accountRequest<AuthenticationResult>("POST", "/discord/authenticate", {code}, traceId)
        return result.data
    },

    async signout(traceId?: string): Promise<SignOutResult> {
        const result = await accountRequest<SignOutResult>("POST", "/session/signout", traceId)
        return result.data
    },

    async refreshSession(refreshToken: string, traceId?: string): Promise<AuthenticationResult> {
        const result = await accountRequest<AuthenticationResult>("POST", "/session/refresh", {refreshToken}, traceId)
        return result.data
    },

    async getAssociationNonce(stakeAddress: string, traceId?: string): Promise<GetAssociationNonceResult> {
        const result = await accountRequest("POST", "/association/nonce", {stakeAddress}, traceId)
        return result.data
    },

    async submitAssociationSignature(nonce: string, signedMessage: SignedMessage, traceId?: string): Promise<SubmitAssociationSignatureResult> {
        const result = await accountRequest("POST", "/association/signature", {nonce, signedMessage}, traceId)
        return result.data
    },

    async getRawAssociationTx(stakeAddress: string, address: string, traceId?: string): Promise<CreateAssociationTxResult>{
        const result = await accountRequest("POST", "/association/tx", {stakeAddress, address}, traceId)
        return result.data
    },

    async submitAuthTx(serializedSignedTx: string, authStateId: string, traceId?: string): Promise<ClaimSignAndSubbmitResult>{
        const result = await accountRequest("POST", "/association/submit-tx", {serializedSignedTx, authStateId}, traceId)
        return result.data
    },

    async cleanAssociationState(authStateId: string, error: string, traceId?: string): Promise<CleanAssociationTxResult>{
        const result = await accountRequest("POST", "/association/clean-assosiate-tx-state", {authStateId, error}, traceId)
        return result.data
    },

    async deassociateWallet(stakeAddress: string, traceId?: string): Promise<DeassociationResult>{
        const result = await accountRequest("POST", "/association/deassociate-wallet", {stakeAddress}, traceId)
        return result.data
    },

    async test(): Promise<void> {
        const result = await accountRequest("POST", "/session/test")
        console.log(result)
        console.log(result.headers)
    },

    async getDragonSilverClaims(page?: number, traceId?: string): Promise<GetDragonSilverClaimsResult> {
        const result = await accountRequest("GET", "/assets/claim/dragon-silver", {page}, traceId)
        return result.data
    },

    async claim(stakeAddress: string, address: string, traceId?: string): Promise<ClaimAssetResult> {
        const result = await accountRequest("POST", "/assets/claim/dragon-silver", {stakeAddress, address}, traceId)
        return result.data
    },

    async claimSignAndSubmit(serializedSignedTx: string, claimId: string, traceId?: string): Promise<ClaimSignAndSubbmitResult> {
        const result = await accountRequest("POST", "/assets/claim/sign-and-submit", {serializedSignedTx, claimId}, traceId)
        return result.data
    },

    async claimStatus(claimId: string, traceId?: string): Promise<ClaimStatusResult>{
        const result = await accountRequest("POST", "/assets/claim/status", {claimId}, traceId)
        return result.data
    },

    async getUserInventory(traceId?: string): Promise<getUserInventoryResult>{
        const result = await accountRequest("GET", "/assets/inventory", traceId)
        return result.data
    },

    async granteTest(){
        const result = await accountRequest("GET", "/assets/test/grant")
        return result.data
    },

    async getOpenBallots(traceId?: string): Promise<GetOpenBallotsResult>{
        const result = await accountRequest("GET", "/governance/open", traceId)
        return result.data
    },

    async getUserOpenBallots(traceId?: string): Promise<GetOpenBallotsResult>{
        const result = await accountRequest("GET", "/governance/open-for-user", traceId)
        return result.data
    },

    async getPublicBallots(traceId?: string): Promise<GovernancePublicBallots>{
        const result = await accountRequest("GET", "/governance/public", traceId)
        return result.data
    },

    async getUserBallots(traceId?: string): Promise<GovernanceUserBallotss>{
        const result = await accountRequest("GET", "/governance/user", traceId)
        console.log(result.data)
        return result.data
    },

    async votForBallot(ballotId: string, optionIndex: string, traceId?: string): Promise<VoteResult>{
        const result = await accountRequest("POST", "/governance/vote", {ballotId, optionIndex}, traceId)
        return result.data
    },

    async getUserCollectionWIthMetadata(pageSize: number, filter?: CollectionFilter, traceId?: string): Promise<UserCollectionWithMetadataResult>{
        const result = await accountRequestWRefresh("POST", "/assets/collection-with-metadata", {pageSize, filter}, traceId)
        return result.data
    },

    async getUserWeeklyPasiveEarnings(traceId?: string): Promise<UserWeeklyPasiveEarnings>{
        const result = await accountRequestWRefresh("POST", "/assets/collection-earnings", traceId)
        return result.data
    },

    async getUserMortalCollection(traceId?: string): Promise<UserMortalCollectionResult>{
        const result = await accountRequestWRefresh("POST", "/assets/mortal-collection", traceId)
        return result.data
    },

    async setMortalCollection(assets: CollectionAssets, traceId?: string): Promise<CleanAssociationTxResult>{
        const result = await accountRequestWRefresh("POST", "/assets/set-mortal-collection", {assets}, traceId)
        return result.data
    },

    async getMortalLockState(traceId?: string): Promise<MortalCollectionLockedStateResult>{
        const result = await accountRequestWRefresh("POST", "/assets/get-mortal-collection-state", traceId)
        return result.data
    },

    async lockMortalCollection(traceId?: string): Promise<MortalCollectionLockedStateResult>{
        const result = await accountRequestWRefresh("POST", "/assets/lock-mortal-collection", traceId)
        return result.data
    },

    async modifyMortalCollection(assetRef: string, action: "add" | "remove", traceId?: string): Promise<ModifyMortalCollectionResult>{
        const result = await accountRequestWRefresh("POST", "/assets/modify-mortal-collection", {assetRef, action} ,traceId)
        return result.data
    },

    async syncUserCollection(traceId?: string): Promise<ModifyMortalCollectionResult>{
        const result = await accountRequestWRefresh("POST", "/assets/sync-collection" ,traceId)
        return result.data
    },

    async grantCollection(address: string, traceId?: string): Promise<ClaimAssetResult> {
        if (process.env["NEXT_PUBLIC_ENVIROMENT"] !== "development") return {status: "invalid", reason: "Not allowed", remainingAmount: 0}
        const result = await accountRequestWRefresh("POST", "/assets/claim/test-faucet", {address},traceId)
        return result.data
    },

    async collectionGrantSubmmit(serializedSignedTx: string, traceId: string): Promise<ClaimSignAndSubbmitResult>{
        if (process.env["NEXT_PUBLIC_ENVIROMENT"] !== "development") return {status: "invalid", reason: "Not allowed"}
        const result = await accountRequestWRefresh("POST", "/assets/claim/faucet-sign-and-submit", {serializedSignedTx},traceId)
        return result.data
    },

    async orderAOT(address: string, quantity: string){}
}

export type CollectionAssets = { assetRef: string; quantity: string; }[]

export type ClaimFaucetResult
    = { status: "ok", tx: string }
    | { status: "invalid", reason: string}

export type DeassociationResult 
    = { ctype: "success"}
    | { ctype: "failure", error: string}

export type CleanAssociationTxResult 
    = {status: "ok"}
    | {status: "invalid", reason: string}

export type AuthenticationResult
    = { status: "ok", tokens: AuthenticationTokens, inventory: { dragonSilver: string, dragonSilverToClaim: string, dragonGold: string }, info: UserFullInfo }
    | { status: "bad-credentials" }
    | { status: "unknown-user" }

export type SignOutResult
    = { status: "ok" }
    | { status: "unknown-session" }

export type GetAssociationNonceResult
    = { status: "ok", nonce: string }
    | { status: "bad-address" }

export type GetDragonSilverClaimsResult
    = { status: "ok", 
        claims: ClaimInfo[] }
    | { status: "invalid", reason: string }

export type ClaimAssetResult 
    = { status: "ok", claimId: string, tx: string, remainingAmount: number }
    | { status: "invalid", reason: string, remainingAmount: number }
    
export type SubmitAssociationSignatureResult
    = { status: "ok" }
    | { status: "bad-credentials" }
    | { status: "stake-address-used" }

export type AssociationNonceResult = ClaimSignAndSubbmitResult

export type CreateAssociationTxResult
    = { status: "ok", rawTx: string, authStateId: string }
    | { status: "invalid", reason: string }

export type ClaimSignAndSubbmitResult 
    = { status: "ok", txId: string }
    | { status: "invalid", reason: string }

export type ClaimStatusResult
    = { status: "ok", claimStatus: ClaimStatus }
    | { status: "invalid", reason: string }

export type getUserInventoryResult
    = { status: "ok", dragonSilverToClaim: string, dragonSilver: string, dragonGold: string}
    | { status: "unknown-user" }

export type GetOpenBallotsResult
    = { status: "ok", payload: GovernanceBallots}
    | { status: "invalid", reason: string }

export type GovernancePublicBallots =
    {status: "ok", payload: {[ballotId: string]: PublicBallot}}|
    {status: "invalid", reason: string}
  
export type GovernanceUserBallotss =
    {status: "ok", payload: {[ballotId: string]: UserBallot}}|
    {status: "invalid", reason: string}

export type VoteResult 
    = { status: "ok" }
    | { status: "invalid", reason: string }

export type UserCollectionWithMetadataResult
    = {status: "ok", collection: CollectionWithUIMetada, hasMore: boolean}
    | {status: "invalid", reason: string}

export type UserWeeklyPasiveEarnings
    = {status: "ok", weeklyEarnings: number}
    | {status: "invalid", reason: string}

export type UserMortalCollectionResult
    = {status: "ok", collection: CollectionWithGameData}
    | {status: "invalid", reason: string}

export type ModifyMortalCollectionResult
    = {status: "ok"}
    | {status: "invalid", reason: string}

export type MortalCollectionLockedStateResult
    = {status: "ok", locked: boolean}
    | {status: "invalid", reason: string}

async function accountRequestWRefresh<ResData = any, ReqData = any>(method: Method, endpoint: string, data?: ReqData, traceId?: string): Promise<AxiosResponse<ResData>> {
    return await withTokenRefresh(() => accountRequest(method, endpoint, data))
}

async function accountRequest<ResData = any, ReqData = any>(method: Method, endpoint: string, data?: ReqData, traceId?: string): Promise<AxiosResponse<ResData>> {
    const finalTraceId = traceId ?? v4()
    const baseURL = urljoin(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:5000", "api/account")
    //if (baseURL.includes("acceptance.") || baseURL.includes("testnet.") || baseURL.includes("localhost")) 
        console.log(`${method}: ${endpoint}\ntrace-id: ${finalTraceId}`)
    return await axios.request<ResData, AxiosResponse<ResData>, ReqData>({
        method,
        baseURL,
        url: endpoint,
        data,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "Trace-ID": finalTraceId
        },
        timeout: 10000,
        withCredentials: true,
    })
}

async function withTokenRefresh<T>(fn: () => Promise<T>): Promise<T> {
    try { return await fn() }
    catch (err) { 
        if (await refreshToken(err)) return await fn()
        else throw err 
    }
}

async function refreshToken(error: any): Promise<boolean> {
    //const router = useRouter()
    const refreshToken = localStorage.getItem("refresh")
    if(error instanceof AxiosError && error.response?.status == 401 && refreshToken){
        try {
            const response = await accountRequest("POST", "/session/refresh", { refreshToken })
            localStorage.setItem("refresh", response.data.refreshToken)
            return true
        }
        catch (err) { 
            localStorage.removeItem("refresh")
            router.push("/inq")
            return false 
        }
    } else {
        router.push("/inq")
        return false
    }
}
