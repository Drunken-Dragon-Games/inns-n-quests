import { axiosCustomInstance } from "../../../../axios/axiosApi";
import { combineReducers } from "redux";
import { createSliceStatus, actionsGenerator } from "../../../utils/features/utils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generalReducerThunk } from "../../../../features/generalReducer";
import { fetchRefreshToken } from "../../../../features/refresh";
import { AxiosError } from "axios";

export const fetchAccountData = () : generalReducerThunk => async (dispatch) =>{

    dispatch(setFetchAccountDataStatusPending()) 
    try {  
        const response = await axiosCustomInstance('/api/accountData').get('/api/accountData')

        dispatch(setAccountData(response.data))

        dispatch(setFetchAccountDataStatusFulfilled()) 
        
    }  catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setFetchAccountDataStatusRejected(err))
            dispatch(fetchRefreshToken( () => dispatch(fetchAccountData()), err))
        }
            

    }
}

const  fetchAccountDataStatus  = createSliceStatus("fetchAccountDataStatus")

const [ setFetchAccountDataStatusIdle, setFetchAccountDataStatusPending, setFetchAccountDataStatusFulfilled, setFetchAccountDataStatusRejected ] = actionsGenerator(fetchAccountDataStatus.actions)



interface accountData {
    discordUserName: string 
    imgLink: string 
    nameIdentifier: number
    nickName: string 
    stakeAddresses: string []
}

interface nameAndIdentifier {
    nameIdentifier: number
    nickName: string 
}
   
const initialStateAccountData: accountData = {discordUserName: "", imgLink: "", nameIdentifier: 0, nickName: "", stakeAddresses: [] }

const accountData = createSlice({
    name: "accountData",
    initialState: initialStateAccountData,
    reducers: {
      
        setAccountData: (state, action: PayloadAction<accountData>) => {
            state.discordUserName = action.payload.discordUserName
            state.imgLink = action.payload.imgLink
            state.nameIdentifier = action.payload.nameIdentifier
            state.nickName = action.payload.nickName
            state.stakeAddresses = action.payload.stakeAddresses
        },

        setStakeAddress: (state, action: PayloadAction<string[]>) => {
            
            state.stakeAddresses = action.payload
        },

        setNameAndIdentifier: (state, action: PayloadAction<nameAndIdentifier>) =>{
            state.nickName = action.payload.nickName
            state.nameIdentifier = action.payload.nameIdentifier 
        }
      
    },
});

export const { setAccountData, setStakeAddress, setNameAndIdentifier } = accountData.actions


export const accountDataReducer = combineReducers({
    data: accountData.reducer,
    status: fetchAccountDataStatus.reducer
  })
  