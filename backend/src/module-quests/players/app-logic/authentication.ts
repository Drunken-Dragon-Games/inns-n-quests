import { Player } from "../models.js"
import { Credentials, IdentityService } from "../../../service-identity.js"
import ApiError from "../../app/error/api_error.js"
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../../app/settings.js"
import { LoggingContext } from "../../../tools-tracing.js"

type TokenType = "refresh" | "access"
type AccessToken = {
    user: string
    sessionId: string
    expiration: number
} 
type RefreshToken = {
    refresh: string
    sessionId: string
    expiration: number
}
type AuthenticationTokens = {
    access: string
    refresh: string
}

/**
 * Function that communicates with the Identity Service
 * Creates a player if response is successfull
 * @param credentials 
 * @param address
 * @returns Authentication Response with the tokens
 */
export const handleSignVerification = async (identityService: IdentityService, credentials: Credentials, logger: LoggingContext): Promise<AuthenticationTokens> => {
    const sdkResponse = await identityService.authenticate(credentials, logger)
    if (sdkResponse.status == "bad-credentials" || sdkResponse.status == "unknown-user") 
        throw new ApiError(401, "bad_credentials", "Unauthorized")

    await Player.findOrCreateInstance(sdkResponse.tokens.session.userId)
    const session = sdkResponse.tokens.session
    const token = createToken(session.userId, session.expiration, session.sessionId, "access")
    const refreshToken = createToken(sdkResponse.tokens.refreshToken, session.expiration, session.sessionId, "refresh")
    const authenticationTokens = {
        access: token,
        refresh: refreshToken
    }
    return authenticationTokens
}

export const createToken = (payload: string, expiration: number, sessionId: string, type: TokenType): string => {
    let tokenData: AccessToken | RefreshToken
    if (type == "access"){
        tokenData = {
            user: payload,
            sessionId: sessionId,
            expiration: expiration
        }
    } else {
        tokenData = {
            refresh: payload,
            sessionId: sessionId,
            expiration: expiration
        }
    }

    const token = jwt.sign(tokenData, SECRET_KEY);
    return token
}


export const handleRefreshToken = async (identityService: IdentityService, refreshToken: string, logger: LoggingContext): Promise<AuthenticationTokens> => {
    const refresh = jwt.decode(refreshToken) as RefreshToken
    const sdkResponse = await identityService.refresh(refresh.sessionId, refresh.refresh, logger)
    if (sdkResponse.status == "bad-refresh-token") throw new ApiError(400, "invalid_token", "The refresh token is not valid")
    const session = sdkResponse.tokens.session
    const newAccessToken = createToken(session.userId, session.expiration, session.sessionId, "access")
    const newRefreshToken = createToken(sdkResponse.tokens.refreshToken, session.expiration, session.sessionId, "refresh")
    const authenticationTokens = {
        access: newAccessToken,
        refresh: newRefreshToken
    }
    return authenticationTokens
} 