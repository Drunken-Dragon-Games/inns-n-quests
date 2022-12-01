import { Attempt, failed, succeeded } from "../../tools-utils";
import { AuthType, DeviceType, AuthenticationTokens, SessionInfo } from "../models";
import { StoredSession } from "./session-db";

export type SessionsConfig = {
    duration: number
}

export class Sessions {

    constructor (private config: SessionsConfig){}

    create = async (userId: string, authType: AuthType, deviceType: DeviceType): Promise<AuthenticationTokens> => {
        const signedOn = Date.now()
        const expiration = signedOn+this.config.duration
        const session = await StoredSession.create({ userId, authType, deviceType, signedOn, expiration })
        return { 
            session: {
                sessionId: session.sessionId,
                userId,
                authType,
                expiration
            }, 
            refreshToken: session.refreshToken 
        }
    }

    renew = async (sessionId: string, refreshToken: string): Promise<Attempt<AuthenticationTokens>> => {
        const existingSession = await StoredSession.findOne({ where: { sessionId }})
        if (existingSession == null) return failed
        if (existingSession.refreshToken != refreshToken) return failed
        await existingSession.destroy()
        const newSession = await this.create(existingSession.userId, existingSession.authType, existingSession.deviceType)
        return succeeded(newSession)
    }

    resolve = async (sessionId: string): Promise<Attempt<StoredSession>> => {
        const existingSession = await StoredSession.findOne({ where: { sessionId }})
        if (existingSession == null) return failed
        return succeeded(existingSession)
    }

    delete = async (sessionId: string): Promise<number> => 
        StoredSession.destroy({ where: { sessionId }})

    list = async (userId: string): Promise<SessionInfo[]> => {
        const sessions = await StoredSession.findAll({ where: { userId }})
        return sessions.map(session => { return {
            sessionId: session.sessionId,
            lastSignedIn: session.signedOn,
            deviceType: session.deviceType,
            authType: session.authType
        }})
    }
}
