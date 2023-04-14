import axios from "axios"
import { User } from "../users/users-db.js"
import { StoredSession } from "../sessions/session-db.js"
import { Attempt, succeeded, failed, Unit, unit } from "../../tools-utils/index.js";

const discordAPI = "https://discord.com/api/v10/oauth2/token";

export type DiscordConfig = {
    clientId: string,
    clientSecret: string,
    redirect: string,
    redirectValidate: string,
    redirectAdd: string,
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
    discordName: string
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

export const getUserInfoFromBearerToken = async (Authorization: string): Promise<Attempt<DiscordUserInfo>> => {
    try {
        let playerInfo = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization } })
        return succeeded({
            discordName: playerInfo.data.username + "#" + playerInfo.data.discriminator,
            email: playerInfo.data.email
        })
    } catch (error) {
        console.log(error);
        return failed
    }
}

export const checkValidDiscordRefresh = async (refresh_token: string, config: DiscordConfig): Promise<Attempt<string>> => {
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
        return succeeded(authValues.refresh_token);
    } catch (_) {
        return failed
    }
}


export const validateDiscordSession =async (SessionInstance: StoredSession, config: DiscordConfig): Promise<Attempt<Unit>> => {
    const UserIntance = await User.findOne({ where: { userId: SessionInstance.userId } });
    if (UserIntance == null) return failed
    const newRefresh = await checkValidDiscordRefresh(UserIntance.discordRefreshToken, config)
    if (newRefresh.ctype == "failure") return failed
    else {
        UserIntance.discordRefreshToken = newRefresh.result
        await UserIntance.save()
        return succeeded(unit)
    }
}