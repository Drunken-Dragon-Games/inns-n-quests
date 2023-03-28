import { AuthenticationTokens, UserFullInfo } from "../service-identity"

export interface AccountService {

    authenticateDiscord(code: string): Promise<AuthenticateDiscordResult>
}

export type AuthenticateDiscordResult
    = { status: "ok", tokens: AuthenticationTokens, inventory: {dragonSilver: number, dragonSilverToClaim: number}, info: UserFullInfo }
    | { status: "bad-credentials" }
    | { status: "unknown-user" }
