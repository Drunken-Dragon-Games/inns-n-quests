import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { createSliceStatus, actionsGenerator } from '../../features/utils';
import { fetchRefreshToken } from '../../../../features/refresh';
import { AxiosError } from 'axios';
import { generalReducerThunk } from '../../../../features/generalReducer';

export const claimDragonSilver = (amount: number) : generalReducerThunk => async(dispatch) => {
    
    dispatch(setClaimDragonSilverStatusPending())
    try {  
        const response = await axiosCustomInstance('/quests/api/claim/dragon-silver').post('/quests/api/claim/dragon-silver', {amount: amount })

        console.log(response)
        dispatch(setClaimDragonSilverStatusFulfilled())
    } 
    catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setClaimDragonSilverStatusRejected(err))
            dispatch(fetchRefreshToken( () => dispatch(claimDragonSilver(amount)), err))
        }
            

    }

}

const  claimDragonSilverStatus  = createSliceStatus("claimDragonSilverStatus")

const [ setClaimDragonSilverStatusIdle, setClaimDragonSilverStatusPending, setClaimDragonSilverStatusFulfilled, setClaimDragonSilverStatusRejected ] = actionsGenerator(claimDragonSilverStatus.actions)
