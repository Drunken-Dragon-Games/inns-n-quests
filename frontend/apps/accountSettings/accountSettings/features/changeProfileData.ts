import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { createSliceStatus, actionsGenerator } from '../../../utils/features/utils'
import { setNameAndIdentifier } from "./accountData";
import { combineReducers } from "redux";
import { generalReducerThunk } from "../../../../features/generalReducer";
import { AxiosError } from "axios";
import { fetchRefreshToken } from "../../../../features/refresh";


//fetch para cambiar el nickname
export const fetchPostNickName = (nickNAme: string): generalReducerThunk => async (dispatch) => {

    dispatch(setFetchPostNickNameStatusPending())

    try {
        //fetch al backend le envias el stakeAddress OUTPUT la respuesta es un NONCE para que lo firme la wallet y comprobar la autenticidad
        const response = await axiosCustomInstance('api/setNickName').post('api/setNickName', { "nickname": nickNAme })

        dispatch(setNameAndIdentifier({nickName: response.data.nickName, nameIdentifier: response.data.identifier }))

        dispatch(setFetchPostNickNameStatusFulfilled())
    }

    catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setFetchPostNickNameStatusRejected(err))    
            dispatch(fetchRefreshToken( () => dispatch(fetchPostNickName(nickNAme)), err))
        }
    }
}

//reducer para checar estado de cambio de nickName

const FetchPostNickNameStatus = createSliceStatus("fetchPostNickNameStatus")

const [setFetchPostNickNameStatusIdle, setFetchPostNickNameStatusPending, setFetchPostNickNameStatusFulfilled, setFetchPostNickNameStatusRejected] = actionsGenerator(FetchPostNickNameStatus.actions)


export const ProfileDataReducer = combineReducers({
    nickName : combineReducers({
        status: FetchPostNickNameStatus.reducer
    }),
  })