import { AccountApi, SupportedWallet } from "../account";
import { StoreThunk, storeState } from "./store-state";
import { v4 } from "uuid"

const actions = storeState.actions

export const StoreThunks = {
    orderAOTs: (supportedWallet: SupportedWallet, quantity: string): StoreThunk => async (dispatch) => {

        const displayErrorAndHeal = (details: string) => {
            dispatch(actions.setAotOrderState({ ctype: "error", details }))
            setTimeout(() => dispatch(actions.setAotOrderState({ ctype: "idle" })), 3000)
        }

        try{
            const traceId = v4()

            dispatch(actions.setAotOrderState({ ctype: "connecting to wallet" }))
            const walletResult = await AccountApi.getWallet(supportedWallet)
            if (walletResult.status !== "ok") return displayErrorAndHeal(walletResult.details)

            dispatch(actions.setAotOrderState({ ctype: "Getting transaction" }))
            const orderResult = await AccountApi.orderAOT(walletResult.address, quantity, traceId)
            if (orderResult.status !== "ok") return displayErrorAndHeal(orderResult.reason)

            dispatch(actions.setAotOrderState({ ctype: "Waiting for signature" }))
            const tx = walletResult.walletApi.fromTx(orderResult.tx)
            const signedTx  = await tx.sign().complete()
            const serializedSignedTx = signedTx.toString()

            dispatch(actions.setAotOrderState({ ctype: "submiting transaction" }))
            const submitResult = await AccountApi.submitAotOrder(orderResult.orderId, serializedSignedTx, traceId)
            if (submitResult.status !== "ok") return displayErrorAndHeal(submitResult.reason)

            dispatch(actions.setAotOrderState({ ctype: "waiting for confirmation" }))
            dispatch(StoreThunks.checkOrderStatus(orderResult.orderId, traceId))

        }catch (error: any){
            console.error(error)
            return displayErrorAndHeal(error.info ?? error.message)
        }
    },

    checkOrderStatus: (orderId: string, traceId: string): StoreThunk => async (dispatch) => {
        setTimeout(async () => {
            const statusResult = await AccountApi.checkAotOrderStatus(orderId, traceId)
            if (statusResult.status !== "ok") 
                return dispatch(actions.setAotOrderState({ ctype: "error", details: "could not retrive blockchain transaction status"}))
            if (statusResult.orderStatus == "created" || statusResult.orderStatus == "transaction_submited") 
                return dispatch(StoreThunks.checkOrderStatus(orderId, traceId))
            if (statusResult.orderStatus == "order_timed_out") 
                return dispatch(actions.setAotOrderState({ ctype: "error", details: "Transaction timed out"}))

            dispatch(actions.setAotOrderState({ ctype: "Transaction confirmed!" }))
        }, 2000)
    }
}