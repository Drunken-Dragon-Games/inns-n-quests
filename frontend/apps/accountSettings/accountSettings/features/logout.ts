import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { createSliceStatus, actionsGenerator } from '../../../utils/features/utils'
import { combineReducers } from "redux";
import { generalReducerThunk } from "../../../../features/generalReducer";
import { AxiosError } from "axios";
import Router from 'next/router'



//fetch para cambiar el nickname
export const fetchLogout = (): generalReducerThunk => async (dispatch) => {


    dispatch(setFetchFetchLogoutStatusPending())

    try {
        //fetch al backend le envias el stakeAddress OUTPUT la respuesta es un NONCE para que lo firme la wallet y comprobar la autenticidad
        const response = await axiosCustomInstance('/api/logout').get('/api/logout')

        dispatch(setFetchFetchLogoutStatusFulfilled())
        
        Router.push({
            pathname: '/',
          })
    }

    catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setFetchFetchLogoutStatusRejected(err))    
        }
    }
}

//reducer para checar estado de cambio de nickName

const fetchFetchLogoutStatus = createSliceStatus("fetchFetchLogoutStatus")

const [setFetchFetchLogoutStatusIdle, setFetchFetchLogoutStatusPending, setFetchFetchLogoutStatusFulfilled, setFetchFetchLogoutStatusRejected] = actionsGenerator(fetchFetchLogoutStatus.actions)


export const logoutReducer = combineReducers({
    logout : combineReducers({
        status: fetchFetchLogoutStatus.reducer
    }),
  })