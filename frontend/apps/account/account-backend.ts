import { v4 } from "uuid"
import axios, { AxiosError, AxiosResponse, Method } from "axios"
import urljoin from "url-join"
import { useRouter } from "next/router"

export const AccountBackend = {

    async authenticateDevelopment(nickname: string): Promise<AuthenticationResult> {
        const result = await accountRequest<AuthenticationResult>("post", "/development/authenticate", {nickname})
        return result.data
    },

    async authenticateDiscord(code: string): Promise<AuthenticationResult> {
        const result = await accountRequest<AuthenticationResult>("post", "/discord/authenticate", {code})
        console.log(result)
        console.log(result.headers)
        return result.data
    },

    async signout(): Promise<SignOutResult> {
        const result = await accountRequest<SignOutResult>("post", "/session/signout")
        return result.data
    },

    async refreshSession(refreshToken: string): Promise<AuthenticationResult> {
        const result = await accountRequest<AuthenticationResult>("post", "/session/refresh", {refreshToken})
        return result.data
    },

    async getAssociationNonce(stakeAddress: string): Promise<GetAssociationNonceResult> {
        const result = await accountRequest("post", "/association/nonce", {stakeAddress})
        return result.data
    },

    async test(): Promise<void> {
        const result = await accountRequest("post", "/session/test")
        console.log(result)
        console.log(result.headers)
    },

    async claim(): Promise<claimAssetResult> {
        const result = await userRequesr("POST", "/claimDS")
        return result.data
    }
}

export type AuthenticationResult
    = { status: "ok", tokens: AuthenticationTokens, inventory: { dragonSilver: number, dragonSilverToClaim: number }, info: UserFullInfo }
    | { status: "bad-credentials" }
    | { status: "unknown-user" }

export type SignOutResult
    = { status: "ok" }
    | { status: "unknown-session" }

export type GetAssociationNonceResult
    = { status: "ok", nonce: string }
    | { status: "bad-address" }

export type claimAssetResult 
    = { status: "ok", claimId: string, tx: string, remainingAmount: number }
    | { status: "invalid", reason: string, remainingAmount: number }

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


async function accountRequestWRefresh<ResData = any, ReqData = any>(method: Method, endpoint: string, data?: ReqData): Promise<AxiosResponse<ResData>> {
    return await withTokenRefresh(() => accountRequest(method, endpoint, data))
}

/*Temporary implmentation 
just  to keep working wile i wait for the senior Devs aprobal */
async function userRequesr<ResData = any, ReqData = any>(method: Method, endpoint: string, data?: ReqData): Promise<AxiosResponse<ResData>> {
    const traceId = v4()
    const baseURL = urljoin(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:5000/", "api")
        console.log(`${method}: ${endpoint}\ntrace-id: ${traceId}`)
    return await axios.request<ResData, AxiosResponse<ResData>, ReqData>({
        method,
        baseURL,
        url: endpoint,
        data,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "Trace-ID": traceId
        },
        timeout: 5000,
        withCredentials: true,
    })
}

async function accountRequest<ResData = any, ReqData = any>(method: Method, endpoint: string, data?: ReqData): Promise<AxiosResponse<ResData>> {
    const traceId = v4()
    const baseURL = urljoin(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:5000", "api/account")
    //if (baseURL.includes("acceptance.") || baseURL.includes("testnet.") || baseURL.includes("localhost")) 
        console.log(`${method}: ${endpoint}\ntrace-id: ${traceId}`)
    return await axios.request<ResData, AxiosResponse<ResData>, ReqData>({
        method,
        baseURL,
        url: endpoint,
        data,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "Trace-ID": traceId
        },
        timeout: 5000,
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
    const router = useRouter()
    const refreshToken = localStorage.getItem("refresh")
    if(error instanceof AxiosError && error.response?.status == 401 && refreshToken){
        try {
            const response = await accountRequest("post", "/api/refreshSession/", { "fullRefreshToken": refreshToken })
            localStorage.setItem("refresh", response.data.refreshToken)
            return true
        }
        catch (err) { 
            localStorage.removeItem("refresh")
            router.push("/")
            return false 
        }
    } else {
        router.push("/")
        return false
    }
}
