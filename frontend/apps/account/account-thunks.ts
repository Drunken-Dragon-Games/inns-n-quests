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

        const displayErrorAndHeal = (details: string) => {
            dispatch(actions.setAssociateProcessState({ ctype: "error", details }))
            setTimeout(() => dispatch(actions.setAssociateProcessState({ ctype: "idle" })), 3000)
        }

        try {
            dispatch(actions.setAssociateProcessState({ ctype: "loading", details: `Connecting ${wallet}...` }))

            const extractedResult = await AccountThunks.extractWalletApiAndStakeAddress(wallet)
            if (extractedResult.status !== "ok")
                return displayErrorAndHeal(extractedResult.details)

            const { walletApi, stakeAddress } = extractedResult

            // Request nonce
            dispatch(actions.setAssociateProcessState({ ctype: "loading", details: "Generating nonce..." }))
            const nonceResponse = await AccountBackend.getAssociationNonce(stakeAddress)
            if (nonceResponse.status != "ok")
                return displayErrorAndHeal(nonceResponse.status)
            const nonce = nonceResponse.nonce

            // Sign nonce
            const hex = require("string-hex")
            dispatch(actions.setAssociateProcessState({ ctype: "loading", details: "Waiting for wallet signature..." }))
            const signedMessage = await walletApi.wallet.signMessage(stakeAddress, hex(`${nonce}`))
            dispatch(actions.setAssociateProcessState({ ctype: "loading", details: "Submitting signature..." }))
            const signatureResponse = await AccountBackend.submitAssociationSignature(nonce, signedMessage)
            if (signatureResponse.status != "ok")
                return displayErrorAndHeal(signatureResponse.status)
            dispatch(actions.setAssociateProcessState({ ctype: "loading", details: "Updating inventory..." }))
            dispatch(actions.addStakeAddress(stakeAddress))
            dispatch(AccountThunks.updateInventory())
            setTimeout(() => dispatch(actions.setAssociateProcessState({ ctype: "idle" })), 3000)
        } catch (error: any) {
            console.error(error)
            return displayErrorAndHeal(error.info ?? error.message)
        }
    },

    updateInventory: (): AccountThunk => async (dispatch) => {
        const inventoryResult = await AccountBackend.getUserInventory()
        if (inventoryResult.status !== "ok")
            return dispatch(actions.setAssociateProcessState({ ctype: "error", details: inventoryResult.status }))
        console.log(`update inventory got ${inventoryResult.dragonSilver} dragon silver`);
        
        dispatch(actions.updateUserInfo({dragonSilver: inventoryResult.dragonSilver , dragonSilverToClaim: inventoryResult.dragonSilverToClaim}))
    },

    test: (): AccountThunk => async (dispatch) => {
        await AccountBackend.test()
    },

    getDragonSilverClaims: (page?: number): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.getDragonSilverClaims(page)
        if (response.status !== "ok")
            dispatch(actions.setClaimProcessState({ ctype: "error", details: response.status }))
        else 
            dispatch(actions.setDragonSilverClaims(response.claims))
    },

    claim: (wallet: SupportedWallet): AccountThunk => async (dispatch) => {

        const displayErrorAndHeal = (details: string) => {
            dispatch(actions.setClaimProcessState({ ctype: "error", details }))
            setTimeout(() => dispatch(actions.setClaimProcessState({ ctype: "idle" })), 3000)
        }

        try {
            const state = accountStore.getState()
            if (!state.userInfo || state.userInfo.dragonSilverToClaim == 0)
                return displayErrorAndHeal("Nothing to claim.")

            dispatch(actions.setClaimProcessState({ctype: "loading", claimStatus: "created", details: `Connecting ${wallet}...`}))
            const extractedResult = await AccountThunks.extractWalletApiAndStakeAddress(wallet)
            if (extractedResult.status !== "ok")
                return displayErrorAndHeal(extractedResult.details)
        
            const { walletApi, stakeAddress } = extractedResult
            
            const allUtxos = await walletApi.wallet.getUtxos()
            const utxos = allUtxos.filter(utxo => utxo.assets["lovelace"] >= BigInt("2000000"))

            if (utxos.length == 0)
                return displayErrorAndHeal("Not enough ADA or transaction ongoing")
       
            dispatch(actions.setClaimProcessState({ctype: "loading", claimStatus: "created", details: "Building transaction..."}))
            const dragonSilverToClaim = state.userInfo.dragonSilverToClaim
            const claimResponse =  await AccountBackend.claim(stakeAddress, { utxos: minimalUtxoFromLucidUTxO(utxos), receivingAddress: utxos[0].address })
            
            if (claimResponse.status !== "ok")
                return displayErrorAndHeal(claimResponse.reason)

            dispatch(actions.updateUserInfo({dragonSilverToClaim: claimResponse.remainingAmount}))
            dispatch(actions.setClaimProcessState({ctype: "loading", claimStatus: "created", details: "Waiting for wallet signature..."}))

            const transaction = C.Transaction.from_bytes(new Uint8Array(Buffer.from( claimResponse.tx, 'hex')))
            const witness = await walletApi.wallet.signTx(transaction)
            const witnessHex = Buffer.from(witness.to_bytes()).toString("hex")
            dispatch(actions.setClaimProcessState({ctype: "loading", claimStatus: "created", details: "Submiting signature..."}))
            const signature = await AccountBackend.claimSignAndSubmit(witnessHex, claimResponse.tx, claimResponse.claimId )
            if ( signature.status !== "ok")
                return displayErrorAndHeal(`Somethig went wrong: ${signature.reason}`)
            dispatch(actions.setClaimProcessState({ ctype: "loading", claimStatus: "submitted", details: "Tx submitted, waiting for confirmation..." }))
            dispatch(AccountThunks.claimStatus(claimResponse.claimId, dragonSilverToClaim))
        }catch (error: any){
            console.error(error)
            return displayErrorAndHeal(error.info ?? error.message)
        }
    },

    claimStatus: (claimId: string, dragonSilverToClaim: number): AccountThunk => async (dispatch) => {
        setTimeout(async () => {
            const statusResult = await AccountBackend.claimStatus(claimId)
            if (statusResult.status !== "ok")
                return dispatch(actions.setClaimProcessState({ ctype: "error", details: "could not retrive bloqchain transaction status"}))
            if (statusResult.claimStatus == "created" || statusResult.claimStatus == "submitted"){
                return dispatch(AccountThunks.claimStatus(claimId, dragonSilverToClaim))
            }
            if (statusResult.claimStatus == "timed-out")
                return dispatch(actions.setClaimProcessState({ ctype: "loading", claimStatus: "timed-out", details: "Transaction timed out"}))
            dispatch(actions.setClaimProcessState({ ctype: "loading", claimStatus: "submitted", details: "Transaction confirmed!" }))
            setTimeout(() => {
                dispatch(actions.setClaimProcessState({ ctype: "idle" }))
                dispatch(AccountThunks.getDragonSilverClaims())
                dispatch(actions.addDragonSilver(dragonSilverToClaim))
            }, 5000)
        }, 2000)
    },

    testGrant: (): AccountThunk => async (dispatch) => {
        await AccountBackend.granteTest()
        dispatch(AccountThunks.updateInventory())
    },

    getGoverncanceBallots: (): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.getOpenBallots()
        if (response.status !== "ok")
            dispatch(actions.setGovernanceState({ ctype: "error", details: response.status }))
        else 
            dispatch(actions.setGovernanceBallots(response.payload))
    },

    voteForGovernanceBallot: (ballotId: string, optionIndex: string): AccountThunk => async (dispatch) => {
        actions.setGovernanceState({ ctype: "loading", details: "submiting vote"})
        const response = await AccountBackend.votForBallot(ballotId, optionIndex)
        if (response.status !== "ok")
            dispatch(actions.setGovernanceState({ ctype: "error", details: response.status }))
        else 
            actions.setGovernanceState({ ctype: "idle"})
    }   
}

//local storage set
//se debe llamar dentro de un hook de use efect para que el server side rendering no este chingando
//      --santiago
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