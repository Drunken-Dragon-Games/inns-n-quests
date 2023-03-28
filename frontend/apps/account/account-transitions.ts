import { v4 } from "uuid"
import { NextRouter } from "next/router"
import { accountState, accountStore } from "./account-state"
import { discord_client_id, discord_redirect_uri, discord_response_type, discord_scope } from "../../setting"
import { useEffect, useMemo, useState } from "react"
import { AccountThunks } from "./account-thunks"

const actions = accountState.actions

const dispatch = accountStore.dispatch

// import { hasCookie } from "cookies-next"
// const authenticated = hasCookie("access")

export const AccountTransitions = {

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
}