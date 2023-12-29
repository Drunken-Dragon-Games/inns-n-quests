import { AccountApi, SupportedWallet } from "../account";
import { StoreThunk, storeState } from "./store-state";
import { v4 } from "uuid"

const actions = storeState.actions

export const StoreThunks = {
    displayError: (details: string): StoreThunk =>async (dispatch) => {
        dispatch(actions.setAotOrderState({ ctype: "Error", details }))
        setTimeout(() => dispatch(actions.setAotOrderState({ ctype: "Idle" })), 3000)
    },

    orderAOTs: (supportedWallet: SupportedWallet, quantity: string): StoreThunk => async (dispatch) => {

        try{
            const traceId = v4()

            dispatch(actions.setAotOrderState({ ctype: "Connecting to Wallet" }))
            const walletResult = await AccountApi.getWallet(supportedWallet)
            if (walletResult.status !== "ok") return dispatch(StoreThunks.displayError(walletResult.details))

            dispatch(actions.setAotOrderState({ ctype: "Getting Transaction" }))
            const orderResult = await AccountApi.orderAOT(walletResult.address, quantity, traceId)
            if (orderResult.status !== "ok") return dispatch(StoreThunks.displayError(orderResult.reason))

            dispatch(actions.setAotOrderState({ ctype: "Waiting for Signature" }))
            const tx = walletResult.walletApi.fromTx(orderResult.tx)
            const signedTx  = await tx.sign().complete()
            const serializedSignedTx = signedTx.toString()

            dispatch(actions.setAotOrderState({ ctype: "Submitting Transaction" }))
            const submitResult = await AccountApi.submitAotOrder(orderResult.orderId, serializedSignedTx, traceId)
            if (submitResult.status !== "ok") return dispatch(StoreThunks.displayError(submitResult.reason))

            dispatch(actions.setAotOrderState({ ctype: "Waiting for Confirmation" }))
            dispatch(StoreThunks.checkOrderStatus(orderResult.orderId, traceId))

        }catch (error: any){
            console.error(error)
            return dispatch(StoreThunks.displayError(error.info ?? error.message))
        }
    },

    checkOrderStatus: (orderId: string, traceId: string): StoreThunk => async (dispatch) => {
        setTimeout(async () => {
            const statusResult = await AccountApi.checkAotOrderStatus(orderId, traceId)
            if (statusResult.status !== "ok") 
                return dispatch(StoreThunks.displayError("could not retrive blockchain transaction status"))
            if (statusResult.orderStatus == "created" || statusResult.orderStatus == "transaction_submited") 
                return dispatch(StoreThunks.checkOrderStatus(orderId, traceId))
            if (statusResult.orderStatus == "order_timed_out") 
                return dispatch(StoreThunks.displayError("Transaction timed out"))

            dispatch(actions.setAotOrderState({ ctype: "Transaction Confirmed!" }))
            setTimeout(() => {
                dispatch(actions.setAotOrderState({ ctype: "Idle" }))
            }, 5000)
        }, 2000)
    }
}