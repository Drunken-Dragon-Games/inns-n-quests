import { Request } from "express"

export type AuthType = "Sig" | "Discord" | "Email"

interface IToken {
    userId: string, 
    sessionId: string, 
    authType: AuthType, 
    expiration: number
}

interface AuthRequest extends Request {
    auth: IToken
}

interface ValidateAddress {
    isCorrectLength: boolean,
    hasCorrectName: boolean,
    doesNotHaveSpecialChars?: boolean
}

interface IAvatar {
    name: string,
    imageLink: string,
    type: string,
    sprite: string
}
interface IApiNft {
    name: string,
    quantity: string
}

export interface DrunkenDragonInventory {
    pixeltiles: IApiNft[]
    gmas: IApiNft[]
    emojis: IApiNft[]
}

export interface StandardOutput {
    message?: string
    code?: string
    error?: string
}

export interface AccountDataOutput extends StandardOutput {
    discordUserName: string | undefined
    stakeAddresses: string[]
    nickName: string
    nameIdentifier: string
    imgLink: string
}

export interface DiscordAccesResponse {
    access_token: string
    expires_in: number
    refresh_token: string
    scope: string
    token_type: string
}

export interface AddStakeAddressOutput extends StandardOutput {
    stakeAddresses: string[]
}

export interface setNickNameOutput extends StandardOutput {
    nickName: string
    identifier: number
}

export interface getDiscordBearerTokenOutput { discordBearerToken: string, refreshtoken: string }

export {
    IToken,
    AuthRequest,
    ValidateAddress,
    IAvatar,
    IApiNft
}