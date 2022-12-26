import { generalReducerThunk } from "./generalReducer"
import { axiosCustomInstance } from "../axios/axiosApi"
import { AxiosError } from "axios"
import { createSliceStatus } from "../apps/utils/features/utils"
import { actionsGenerator } from "../apps/utils/features/utils"
import { combineReducers } from "redux";


export const fetchRefreshToken = (action: ()=> void, error: AxiosError ) : generalReducerThunk => async(dispatch) => {
    
    if(error.response?.status == 401){

        dispatch(setFetchRefreshTokenStatusPending())

        const refreshToken = localStorage.getItem("refresh");

        if(typeof refreshToken == "string" ){
            try {
         
                const response = await axiosCustomInstance('/api/refreshSession/').post('/api/refreshSession/',  {"fullRefreshToken": refreshToken})
                
                localStorage.setItem("refresh", response.data.refreshToken)
        
                dispatch(setFetchRefreshTokenStatusFulfilled())
                                
                action()
                
            } 
        
            catch (err:  unknown ) {      
                
                if(err instanceof AxiosError )
                    dispatch(setFetchRefreshTokenStatusRejected(err))
        
            }
        } else {
            dispatch(setFetchRefreshTokenStatusRejected("there is no refresh token"))
        }
    }
   


}

const  fetchRefreshTokenStatus  = createSliceStatus("fetchRefreshTokenStatus")

const [ setFetchRefreshTokenStatusIdle, setFetchRefreshTokenStatusPending, setFetchRefreshTokenStatusFulfilled, setFetchRefreshTokenStatusRejected ] = actionsGenerator(fetchRefreshTokenStatus.actions)

export const refreshReducer = combineReducers({
    status: fetchRefreshTokenStatus.reducer
})