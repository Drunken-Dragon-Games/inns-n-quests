import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { generalReducerThunk } from '../../../../features/generalReducer';
import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { createSliceStatus, actionsGenerator } from '../../features/utils';
import { AxiosError } from 'axios';
import { fetchRefreshToken } from '../../../../features/refresh';


export const userDataFetch = () : generalReducerThunk => async(dispatch) => {
    
    dispatch(setFetchUserDataStatusPending())
    try {  
        const response = await axiosCustomInstance('api/UserInfo/').get('api/UserInfo/')
        dispatch(setUserData(response.data))
        dispatch(setFetchUserDataStatusFulfilled())
        
    } 
    catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setFetchUserDataStatusRejected(err))
            dispatch(fetchRefreshToken( () => dispatch(userDataFetch()), err))
        }
            

    }

}

const  fetchUserDataStatus  = createSliceStatus("fetchUserDataStatus")

const [ setFetchUserDataStatusIdle, setFetchUserDataStatusPending, setFetchUserDataStatusFulfilled, setFetchUserDataStatusRejected ] = actionsGenerator(fetchUserDataStatus.actions)


interface userData {
   DS: number
   DSTC: number
   amountNFT: number
   imgLink: string | null
   nickName: string | null
}

const initialState: userData = {
    DS: 0,
    DSTC: 0,
    amountNFT: 0,
    imgLink: "",
    nickName: "",
}

const userData = createSlice({
    name: "userData",
    initialState : initialState,
    reducers: {
        setUserData: (state , action: PayloadAction<userData>) =>{

            state.DS = action.payload.DS
            state.DSTC = action.payload.DSTC
            state.amountNFT = action.payload.amountNFT
            state.imgLink = action.payload.imgLink
            state.nickName = action.payload.nickName
        },

        setUserName: (state, action: PayloadAction<string>) =>{
            
            state.nickName = action.payload
        }
    }

})

export const { setUserData, setUserName } = userData.actions

export const userInfoReducer = combineReducers({
    data: userData.reducer,
    status: fetchUserDataStatus.reducer
})
