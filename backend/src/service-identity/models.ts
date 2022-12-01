
export type HealthStatus = { 
    status: "ok" | "warning" | "faulty", 
    dependencies: {
        name: string, 
        status: "ok" | "warning" | "faulty"
    }[]
}

export type DeviceType = "Browser" | "Desktop" | "Mobile"

export type AuthType = "Sig" | "Discord" | "Email"

export type Address
    = { addressType: "stake", address: string }
    | { addressType: "reciving", address: string }

export type Credentials
    = { ctype: "email-pass", deviceType: DeviceType, email: string, password: string }
    | { ctype: "sig", deviceType: DeviceType, publicKey: string, nonce: string, signedNonce: string }
    | { ctype: "discord", deviceType: DeviceType, authCode: string }

export type UserInfo = {
    userId: string, 
    nickname: string, 
    knownDiscord?: string, 
    knownStakeAddresses: string[]
}

export type UserFullInfo = {
    userId: string, 
    nickname: string, 
    knownDiscord?: string, 
    knownStakeAddresses: string[],
    imageLink: string,
    knownEmail: string
}

export type SessionInfo = {
    sessionId: string, 
    lastSignedIn: number, 
    deviceType: DeviceType, 
    authType: AuthType
}

export type Session = {
    userId: string, 
    sessionId: string, 
    authType: AuthType, 
    expiration: number
}

export type AuthenticationTokens = {
    session: Session, 
    refreshToken: string
}

export type CreateNonceResult
    = { status: "ok", nonce: string }
    | { status: "bad-address" }

export type AuthenticationResult
    = { status: "ok", tokens: AuthenticationTokens }
    | { status: "bad-credentials" }
    | { status: "unknown-user" }

export type RefreshResult
    = { status: "ok", tokens: AuthenticationTokens }
    | { status: "bad-refresh-token" }

export type RegistrationResult
    = { status: "ok", tokens: AuthenticationTokens }
    | { status: "bad-signature" }
    | { status: "bad-discord-code" }

export type AssociationResult
    = { status: "ok" }
    | { status: "bad-credentials" }
    | { status: "stake-address-used" }
    | { status: "discord-used" }

export type ListSessionsResult
    = { status: "ok", sessions: SessionInfo[] }

export type SignOutResult
    = { status: "ok" }
    | { status: "unknown-session" }

export type ResolveUserResult
    = { status: "ok", info: UserInfo }
    | { status: "unknown-user-id" }

export type ResolveSesionResult
    = { status: "ok", info: UserFullInfo;}
    | { status: "unknown-session-id"} 
    | { status: "invalid-discord-token"} 
    | { status: "unknown-user-id"}
    
export type UpdateUserResult
    = { status: "ok" }
    | { status: "nickname-unavailable" }
