import { Action, ThunkDispatch } from "@reduxjs/toolkit"
import { NextRouter } from "next/router"
import { AccountBackend, AuthenticationResult } from "./account-backend"
import { AccountState, accountState, AccountThunk } from "./account-state"
import { SupportedWallet } from "./account-models"

const actions = accountState.actions

export const AccountThunks = {

    authenticateDevelopment: (nickname: string, router: NextRouter): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.authenticateDevelopment(nickname)
        signin(response, dispatch)
        setTimeout(() => router.push("/"), 100)
    },

    authenticateDiscord: (code: string, router: NextRouter): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.authenticateDiscord(code)
        signin(response, dispatch)
        setTimeout(() => router.push("/"), 100)
    },

    signout: (router: NextRouter): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.signout()
        if (response.status != "ok") return
        localStorage.removeItem("refresh")
        dispatch(actions.signout())
        router.push("/")
    },

    /**
     * Refreshes the current session if and only if the session token is saved in the browser's local storage.
     */
    refreshSession: (callback?: (signed: boolean) => void): AccountThunk => async (dispatch) => {
        const refreshToken = localStorage.getItem("refresh")
        if (!refreshToken) return callback && callback(false)
        const response = await AccountBackend.refreshSession(refreshToken)
        const signedIn = signin(response, dispatch)
        callback && callback(signedIn)
    },

    connectWallet: (wallet: SupportedWallet): AccountThunk => async (dispatch) => {
        
    },

    test: (): AccountThunk => async (dispatch) => {
        await AccountBackend.test()
    },
}

function signin(response: AuthenticationResult, dispatch: ThunkDispatch<AccountState, unknown, Action<string>>): boolean {
    if (response.status != "ok") return false
    localStorage.setItem("refresh", response.tokens.refreshToken)
    dispatch(actions.signin({
        userId: response.info.userId,
        sessionId: response.tokens.session.sessionId,
        nickname: response.info.nickname,
        stakeAddresses: response.info.knownStakeAddresses,
        profileUri: response.info.imageLink,
        email: response.info.knownEmail,
        dragonSilver: response.inventory.dragonSilver,
        dragonSilverToClaim: response.inventory.dragonSilverToClaim,
    }))
    const expirationDuration = response.tokens.session.expiration - Date.now() - 5000
    console.log("Refresh Token expiration duration: " + (expirationDuration / 1000) + "s.")
    setTimeout(() => dispatch(AccountThunks.refreshSession()), expirationDuration)
    return true
}