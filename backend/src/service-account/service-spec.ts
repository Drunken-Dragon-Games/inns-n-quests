import { AuthenticationTokens, UserFullInfo } from "../service-identity"

export interface AccountService {
    authenticateDevelopment(nickname: string): Promise<AuthenticateResult>
    authenticateDiscord(code: string): Promise<AuthenticateResult>
    signout(sessionId: string): Promise<SignOutResult>
    refreshSession(sessionId: string, refreshToken: string): Promise<AuthenticateResult>
    getAssociationNonce(stakeAddress: string): Promise<GetAssociationNonceResult>
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
