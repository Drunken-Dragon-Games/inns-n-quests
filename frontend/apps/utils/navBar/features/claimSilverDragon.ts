import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { createSliceStatus, actionsGenerator } from '../../features/utils';
import { fetchRefreshToken } from '../../../../features/refresh';
import { AxiosError } from 'axios';
import { GeneralReducerThunk } from '../../../../features/generalReducer';

export const claimDragonSilver = (amount: number, authenticationMethod: string | null): GeneralReducerThunk => async (dispatch) => {

    dispatch(setClaimDragonSilverStatusPending())
    try {
        const response = await axiosCustomInstance('/quests/api/claim/dragon-silver').post('/quests/api/claim/dragon-silver', { amount: amount })

        dispatch(signPolicy(response.data.tx, response.data.claimId, authenticationMethod))

        dispatch(setClaimDragonSilverStatusFulfilled())

    }
    catch (err: unknown) {

        if (err instanceof AxiosError) {
            dispatch(setClaimDragonSilverStatusRejected(err))
            dispatch(fetchRefreshToken(() => dispatch(claimDragonSilver(amount, authenticationMethod)), err))
        }


    }

}

const claimDragonSilverStatus = createSliceStatus("claimDragonSilverStatus")

const [setClaimDragonSilverStatusIdle, setClaimDragonSilverStatusPending, setClaimDragonSilverStatusFulfilled, setClaimDragonSilverStatusRejected] = actionsGenerator(claimDragonSilverStatus.actions)

const signPolicy = (transaction: string, claimId: string, authenticationMethod: string | null): GeneralReducerThunk => async (dispatch, state) => {

    let api = null
    console.log(api)
    try {

        if (authenticationMethod == 'Nami') {

            api = await window.cardano.nami.enable()

        } else if (authenticationMethod == 'Eternl') {
            api = await window.cardano.eternl.enable()
            console.log(api)
        }

        //se pide la firma del usuario
        const signature = await api.signTx(transaction, true)

        //se llama la funcion para enviar la transaccion
        dispatch(submitTransactionPost(signature, transaction, claimId))
        //   dispatch(setSignPolicyStatusFulfilled())

    } catch (err) {
        //   dispatch(setSignPolicyStatusErrors())
    }

}

const submitTransactionPost = (witness: string, tx: string, claimId: string): GeneralReducerThunk => async (dispatch, state) => {


    try {

        const response = await axiosCustomInstance('/quests/api/submit-tx').post('/quests/api/submit-tx', { witness, tx, claimId })

        console.log(response);

        //se llama la funcion para enviar la transaccion
        //   dispatch(submitTransactionPost(signature, transaction, false))
        //   dispatch(setSignPolicyStatusFulfilled())

    } catch (err) {
        //   dispatch(setSignPolicyStatusErrors())
    }

}
