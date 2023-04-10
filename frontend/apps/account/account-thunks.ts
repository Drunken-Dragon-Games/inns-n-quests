import { Action, ThunkDispatch } from "@reduxjs/toolkit"
import { NextRouter } from "next/router"
import { AccountBackend, AuthenticationResult } from "./account-backend"
import { AccountState, accountState, AccountThunk } from "./account-state"
import { SupportedWallet } from "./account-dsl"
import { cardano_network, networkName } from "../../setting"
import { useRef } from "react"

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

    associateWallet: (wallet: SupportedWallet): AccountThunk => async (dispatch) => {
        
        dispatch(actions.setWalletApi({ ctype: "loading" }))

        // Extract wallet api
        const api = 
            wallet == "Nami" && window?.cardano?.nami ? await window.cardano.nami.enable() :
            wallet == "Eternl" && window?.cardano?.eternl ? await window.cardano.eternl.enable() :
            undefined
        if (!api) 
            return dispatch(actions.setWalletApi({ ctype: "error", error: `${wallet}'s browser extension not found.` }))
        const net: 1 | 0 = await api.getNetworkId()
        const currentNetwork = cardano_network()
        if (net != currentNetwork) 
            return dispatch(actions.setWalletApi({ ctype: "error", error: `${wallet} has to be on ${networkName(currentNetwork)} but is configured on ${networkName(net)}.` }))
        dispatch(actions.setWalletApi({ ctype: "api", wallet, api }))
        
        // Extract stake address
        const { Address } = await import("@emurgo/cardano-serialization-lib-asmjs")
        const raw = await api.getRewardAddresses()
        const serializedStakeAddress = raw[0]
        const stakeAddress = Address.from_bytes(Buffer.from(serializedStakeAddress, "hex")).to_bech32() 

        // Nonce flow

    },

    test: (): AccountThunk => async (dispatch) => {
        await AccountBackend.test()
    },

    claim: (stakeAddress: string): AccountThunk => async (dispatch) => {
        const claimResponse =  await AccountBackend.claim(stakeAddress)
        //storing it as a reference to use in the future IDK maybe i need to add it to the state
        const txRef = useRef ("no claiming transaction found")
        if (claimResponse.status == "ok"){
            txRef.current = claimResponse.tx
            //TODO: update dragon silver after tx is confirmed
            dispatch(actions.updateUserInfo({dragonSilverToClaim: 0}))
        }
    }
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