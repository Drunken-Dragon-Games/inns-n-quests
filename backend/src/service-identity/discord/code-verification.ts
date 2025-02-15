import axios from "axios"
import { User } from "../users/users-db"
import { StoredSession } from "../sessions/session-db"
import { Attempt, succeeded, failed, Unit, unit } from "../../tools-utils";
import { LoggingContext } from "../../tools-tracing";

const discordAPI = "https://discord.com/api/v10/oauth2/token";

export type DiscordConfig = {
    clientId: string,
    clientSecret: string,
    redirect: string,
}

export type DiscordTokens = { discordBearerToken: string, refreshtoken: string }

interface DiscordAccesResponse {
    access_token: string
    expires_in: number
    refresh_token: string
    scope: string
    token_type: string
}

interface DiscordUserInfo {
    discordUserId: string
    discordName: string
    discordGlobalName?: string
    email: string
}

export const genDiscordTokens = (authValues: DiscordAccesResponse): DiscordTokens => {
    const discordBearerToken = authValues.token_type + " " + authValues.access_token
    const refreshtoken = authValues.refresh_token
    return { discordBearerToken, refreshtoken };
}

export const verifyDiscordAuthCode = async (code: string, config: DiscordConfig, verifyType: "add" | "validate"): Promise<Attempt<DiscordTokens>> => {
    try {
        const params = new URLSearchParams({ 
            code, 
            client_id: config.clientId, 
            client_secret: config.clientSecret, 
            redirect_uri: config.redirect, //verifyType == "add" ? config.redirectAdd : config.redirectValidate,
            grant_type: 'authorization_code', 
        }).toString();
        const response = await axios.post(discordAPI, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        const authValues: DiscordAccesResponse = response.data
        return succeeded(genDiscordTokens(authValues))
    } catch (error) {
        console.error(error)
        return failed
    }
}

export const getUserInfoFromBearerToken = async (Authorization: string, logger?: LoggingContext): Promise<Attempt<DiscordUserInfo>> => {
    try {
        let playerInfo = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization } })
        return succeeded({
            discordUserId: playerInfo.data.id,
            discordName: playerInfo.data.username + "#" + playerInfo.data.discriminator,
            discordGlobalName: playerInfo.data.global_name,
            email: playerInfo.data.email
        })
    } catch (error: any) {
        logger?.log.error(error.message ?? error)
        return failed
    }
}

export const checkValidDiscordRefresh = async (refresh_token: string, config: DiscordConfig): Promise<Attempt<DiscordAccesResponse>> => {
    let authValues: DiscordAccesResponse
    try {
        const params = new URLSearchParams({
            client_id: config.clientId, 
            client_secret: config.clientSecret, 
            grant_type: 'refresh_token',
            refresh_token
        }).toString();
        let r = await axios.post( discordAPI, params,{headers:{ 'Content-Type': 'application/x-www-form-urlencoded' }});
        authValues = r.data;
        return succeeded(authValues);
    } catch (_) {
        return failed
    }
}


export const validateDiscordSession =async (SessionInstance: StoredSession, config: DiscordConfig): Promise<Attempt<string>> => {
    const UserIntance = await User.findOne({ where: { userId: SessionInstance.userId } });
    if (UserIntance == null) return failed
    const tokens = await checkValidDiscordRefresh(UserIntance.discordRefreshToken, config)
    if (tokens.ctype == "failure") return failed
    else {
        const cleanTokens = genDiscordTokens(tokens.result)
        UserIntance.discordRefreshToken = cleanTokens.refreshtoken
        await UserIntance.save()
        return succeeded(cleanTokens.discordBearerToken)
    }
}