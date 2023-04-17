import { Action, ThunkDispatch } from "@reduxjs/toolkit"
import { NextRouter } from "next/router"
import { cardanoNetwork} from "../../setting"
import { isEmpty } from "../common"
import { AccountBackend, AuthenticationResult } from "./account-backend"
import { ExtractWalletResult, SupportedWallet, minimalUtxoFromLucidUTxO } from "./account-dsl"
import { AccountState, AccountThunk, accountState, accountStore } from "./account-state"
import { Blockfrost, Lucid, C } from "lucid-cardano"

const actions = accountState.actions



export const AccountThunks = {

    extractWalletApiAndStakeAddress: async (wallet: SupportedWallet ): Promise<ExtractWalletResult> => {

        const lucid = await Lucid.new(
            new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "preprod3AJiD07toi4rcvmhnVSZ92Auip8fh2RW"), "Preprod",
          );
        
        const walletApi = 
            wallet == "Nami" && window?.cardano?.nami ? lucid.selectWallet(await window.cardano.nami.enable()) :
            wallet == "Eternl" && window?.cardano?.eternl ?  lucid.selectWallet(await window.cardano.eternl.enable()) :
            undefined
        
        if (isEmpty(walletApi)) {
          return {status: "error", details: `${wallet}'s browser extension not found.`}
        }
      
        if ( walletApi.network != cardanoNetwork) {
          return {status: "error", details: `${wallet} has to be on ${cardanoNetwork} but is configured on ${walletApi.network}.`}
        }
        const stakeAddress = await walletApi.wallet.rewardAddress();
        if (isEmpty(stakeAddress))
            return {status: "error", details: `${wallet} does not have a reward address`}
       
        return { status: "ok", walletApi, stakeAddress };
      },
      
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

        dispatch(actions.setAssociateState({ctype: "wallet-action-state-loading", details: "getting wallet"}))

        const extractedResult = await AccountThunks.extractWalletApiAndStakeAddress(wallet)
        if (extractedResult.status !== "ok")
            return dispatch(actions.setAssociateState({ ctype: "wallet-action-state-error", details: extractedResult.details }))
     
        const { walletApi, stakeAddress } = extractedResult

        // Request nonce
        dispatch(actions.setAssociateState({ctype: "wallet-action-state-loading", details: "Generating Nonce"}))
        const nonceResponse = await AccountBackend.getAssociationNonce(stakeAddress)
        if (nonceResponse.status != "ok") 
            return dispatch(actions.setAssociateState({ ctype: "wallet-action-state-error", details: nonceResponse.status }))
        const nonce = nonceResponse.nonce

        // Sign nonce
        const hex = require("string-hex")
        dispatch(actions.setAssociateState({ctype: "wallet-action-state-loading", details: "Waiting for User Signature"}))
        const signedMessage = await walletApi.wallet.signMessage(stakeAddress, hex(`${nonce}`))
        dispatch(actions.setAssociateState({ctype: "wallet-action-state-loading", details: "Submiting User signature"}))
        const signatureResponse = await AccountBackend.submitAssociationSignature(nonce, signedMessage)
        if (signatureResponse.status != "ok") 
            return dispatch(actions.setAssociateState({ ctype: "wallet-action-state-error", details: signatureResponse.status }))
        dispatch(actions.addStakeAddress(stakeAddress))
        dispatch(AccountThunks.updateInventory())
        dispatch(actions.setAssociateState({ ctype: "wallet-action-state-succeeded"}))
        setTimeout( () => dispatch(actions.setAssociateState({ ctype: "wallet-action-state-idle" })), 5000)
    },

    updateInventory: (): AccountThunk => async (dispatch) => {
        const inventoryResult = await AccountBackend.getUserInventory()
        if (inventoryResult.status !== "ok")
            return dispatch(actions.setAssociateState({ ctype: "wallet-action-state-error", details: inventoryResult.status }))
        console.log(`update inventory got ${inventoryResult.dragonSilver} dragon silver`);
        
        dispatch(actions.updateUserInfo({dragonSilver: inventoryResult.dragonSilver , dragonSilverToClaim: inventoryResult.dragonSilverToClaim}))
    },

    test: (): AccountThunk => async (dispatch) => {
        await AccountBackend.test()
    },

    getDragonSilverClaims: (page?: number): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.getDragonSilverClaims(page)
        if (response.status !== "ok")
            return dispatch(actions.setAssociateState({ ctype: "wallet-action-state-error", details: response.status }))
    },

    claim: (wallet: SupportedWallet): AccountThunk => async (dispatch) => {
        try {
            const state = accountStore.getState()
            if (!state.userInfo || state.userInfo.dragonSilverToClaim == 0)
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: "Nothing to claim." }))

            dispatch(actions.setClaimState({ctype: "wallet-action-state-loading", details: "Getting Wallet"}))
            const extractedResult = await AccountThunks.extractWalletApiAndStakeAddress(wallet)
            if (extractedResult.status !== "ok")
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: extractedResult.details }))
        
            const { walletApi, stakeAddress } = extractedResult
            
            const allUtxos = await walletApi.wallet.getUtxos()
            const utxos = allUtxos.filter(utxo => utxo.assets["lovelace"] >= BigInt("2000000"))

            if (utxos.length == 0)
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: "Not enough ADA or transaction ongoing." }))
       
            dispatch(actions.setClaimState({ctype: "wallet-action-state-loading", details: "Building Transaction"}))
            const claimResponse =  await AccountBackend.claim(stakeAddress, { utxos: minimalUtxoFromLucidUTxO(utxos), receivingAddress: utxos[0].address })
            
            if (claimResponse.status !== "ok")
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: claimResponse.reason }))

            dispatch(actions.updateUserInfo({dragonSilverToClaim: claimResponse.remainingAmount}))
            dispatch(actions.setClaimState({ctype: "wallet-action-state-loading", details: "Waiting for User Signature"}))

            const transaction = C.Transaction.from_bytes(new Uint8Array(Buffer.from( claimResponse.tx, 'hex')))
            const witness = await walletApi.wallet.signTx(transaction)
            const witnessHex = Buffer.from(witness.to_bytes()).toString("hex")
            dispatch(actions.setClaimState({ctype: "wallet-action-state-loading", details: "Submiting User Signature"}))
            const signature = await AccountBackend.claimSignAndSubmit(witnessHex, claimResponse.tx, claimResponse.claimId )
            if ( signature.status !== "ok")
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: `Somethig when wrong on the backend ${signature.reason}` }))
            dispatch(actions.setClaimState({ ctype: "wallet-action-state-submitted", details: "polling" }))
            dispatch(AccountThunks.claimStatus(claimResponse.claimId))
        }catch (error: any){
            console.error(error);
            return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: error.message}))
        }
    },

    claimStatus: ( claimId: string): AccountThunk => async (dispatch) => {
        setTimeout(async () => {
            const statusResult = await AccountBackend.claimStatus(claimId)
            if (statusResult.status !== "ok")
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: "could not retrive bloqchain transaction status"}))
            if (statusResult.claimStatus == "created" || statusResult.claimStatus == "submitted"){
                dispatch(actions.setClaimState({ ctype: "wallet-action-state-submitted", details: statusResult.status }))
                return dispatch(AccountThunks.claimStatus(claimId))
            }
            if (statusResult.claimStatus == "timed-out")
                return dispatch(actions.setClaimState({ ctype: "wallet-action-state-error", details: "transaction timed out"}))
            dispatch(actions.setClaimState({ ctype: "wallet-action-state-submitted", details: "getting assets"}))
            // Wait for 3 seconds to allow Blockfrost to update before proceeding.
            setTimeout( () => {
                dispatch(AccountThunks.updateInventory())
                dispatch(actions.setClaimState({ ctype: "wallet-action-state-succeeded"}))
                setTimeout( () => dispatch(actions.setClaimState({ ctype: "wallet-action-state-idle" })), 5000)
            }, 3000)
        }, 2000)
    },

    testGrant: (): AccountThunk => async (dispatch) => {
        await AccountBackend.granteTest()
        dispatch(AccountThunks.updateInventory())
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