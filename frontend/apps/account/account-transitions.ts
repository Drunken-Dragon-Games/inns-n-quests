import { hasCookie, getCookies } from "cookies-next"
import { NextRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { v4 } from "uuid"
import { discord_client_id, discord_redirect_uri, discord_response_type, discord_scope } from "../../setting"
import { notEmpty } from "../common"
import { accountState, accountStore } from "./account-state"
import { AccountThunks } from "./account-thunks"
import { SupportedWallet } from "./account-dsl"

const actions = accountState.actions

const dispatch = accountStore.dispatch

export const AccountTransitions = {

    signed(): boolean {
        // TODO: We need to figure out how to check if the user is signed in on the server side.
        // There is a known bug in most browsers where cross site cookies are invisible to the browser.
        if (typeof window === "undefined") return false
        const hasAuthCookie = hasCookie("access")
        const hasRefreshToken = notEmpty(localStorage.getItem("refresh"))
        const hasUserInfo = notEmpty(accountStore.getState().userInfo)
        const signed = hasAuthCookie && hasRefreshToken && hasUserInfo
        //const missingData = !signed && (hasAuthCookie || hasRefreshToken || hasUserInfo)
        //if (missingData) console.error("Missing data for signed in user.", "Has auth cookie:", hasAuthCookie, "has refresh token:", hasRefreshToken, "has user info:", hasUserInfo)
        return signed
    },

    signinDevelopment(nickname: string, router: NextRouter): void {
        dispatch(AccountThunks.authenticateDevelopment(nickname, router))
    },

    startDiscordAuth(router: NextRouter): void {
        const nonce = v4()
        sessionStorage.setItem("discordNonce", nonce);
        const discordLink = `https://discord.com/api/oauth2/authorize?client_id=${discord_client_id}&redirect_uri=${discord_redirect_uri}&response_type=${discord_response_type}&scope=${discord_scope}&state=${nonce}`
        router.push(discordLink)
    },

    /**
     * Checks the nonce and code from the Discord auth callback and finishes the auth process.
     * Returns true if the auth was successful, false if there was no Discord auth callback query elements.
     * 
     * @param router 
     * @returns 
     */
    useDiscordFinish(router: NextRouter): boolean {
        const isFinish = useMemo(() => 
            AccountTransitions.finishDiscordAuth(router)
        , [router.query])
        return isFinish
    },

    /**
     * Checks the nonce and code from the Discord auth callback and finishes the auth process.
     * Returns true if the auth was successful, false if there was no Discord auth callback query elements.
     * 
     * @param router 
     * @returns 
     */
    finishDiscordAuth(router: NextRouter): boolean {
        const state = router.query.state
        const code = router.query.code
        if (typeof state !== "string" || typeof code !== "string") return false
        const storedNonce = sessionStorage.getItem("discordNonce") || ""
        sessionStorage.removeItem("discordNonce")
        if (storedNonce == "") return false
        if (storedNonce != state) {
            console.error("Discord nonce mismatch. Got", state, "expected", storedNonce)
            router.push("/")
            return false
        } else {
            dispatch(AccountThunks.authenticateDiscord(code, router))
            return true
        }
    },

    signout(router: NextRouter): void {
        dispatch(AccountThunks.signout(router))
    },

    useRefreshSession(callback?: (signed: boolean) => void): void {
        useEffect(() => AccountTransitions.refreshSession(callback), [])
    },

    /**
     * Refreshes the current session if and only if the session token is saved in the browser's local storage
     * and the access cookie is set.
     */
    refreshSession(callback?: (signed: boolean) => void): void {
        dispatch(AccountThunks.refreshSession(callback))
    },

    associateWallet(wallet: SupportedWallet): void {
        dispatch(AccountThunks.associateWallet(wallet))
    },

    test: () => {
        console.log("get cookies", getCookies({ path: "/api/account/session/test", domain: "localhost:5000" }))
        dispatch(AccountThunks.test())
    },

    getDragonSilverClaims: (page?: number) => {
        dispatch(AccountThunks.getDragonSilverClaims(page))
    },

    claimDragonSilver: (wallet: SupportedWallet) => {
        dispatch(AccountThunks.claim(wallet))
    },

    grantTest: () => {
        dispatch(AccountThunks.testGrant())
    }
}