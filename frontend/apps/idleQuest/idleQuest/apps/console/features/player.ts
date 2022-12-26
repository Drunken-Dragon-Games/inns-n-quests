import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { generalReducerThunk } from '../../../../../../features/generalReducer';
  
//fetch para obeter a el dragon silver to claim

export const getDragonSilverToClaim = () : generalReducerThunk => async (dispatch) =>{
  
    dispatch(setFetchGetDragonSilverToClaimStatusPending())
    try {  
        
        if(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] !== undefined){
            //fetch para pedir el dragonSilver to Claim
             // FIXME: verify path
            const response = await axiosCustomInstance('/quests/api/vm/dragon-silver').get('/quests/api/vm/dragon-silver') 

        
            //setea el dragon silver to claim en el estado
            dispatch(setDragonSilverToClaim(response.data))
            dispatch(setFetchGetDragonSilverToClaimStatusFulfilled())

        } else{
            dispatch(setDragonSilverToClaim(15))
            dispatch(setFetchGetDragonSilverToClaimStatusFulfilled())
        }
       
              
    } catch (err: unknown) {
        
        // if(err instanceof AxiosError ){
        //     // dispatch(setFetchGetDragonSilverToClaimStatusErrors(err.response))
        //     // dispatch(fetchRefreshToken( () => dispatch(getDragonSilverToClaim()), err))
        // }
    }
  
}

//reducer para monitorear el estado del request para el dragon silver to claim

const  fetchGetDragonSilverToClaimStatus  = createSliceStatus("fetchGetDragonSilverToClaimStatus")

const [ setFetchGetDragonSilverToClaimStatusIdle, setFetchGetDragonSilverToClaimStatusPending, setFetchGetDragonSilverToClaimStatusFulfilled, setFetchGetDragonSilverToClaimStatusErrors ] = actionsGenerator(fetchGetDragonSilverToClaimStatus.actions)
  
//fetch para obeter a el dragon silver

export const getDragonSilver = () : generalReducerThunk => async (dispatch) =>{
  
    dispatch(setFetchGetDragonSilverStatusPending())
    try {  
        
        if(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] !== undefined){
            //fetch para pedir el dragonSilver to Claim
            // FIXME: verify path
            const response = await axiosCustomInstance('/quests/api/vm/dragon-silver').get('/quests/api/vm/dragon-silver') 

            //setea el dragon silver to claim en el estado
            dispatch(setDragonSilver(response.data))
            dispatch(setFetchGetDragonSilverStatusFulfilled())

        } else{
            dispatch(setDragonSilver(10))
            dispatch(setFetchGetDragonSilverStatusFulfilled())
        }
       
              
    } catch (err: unknown) {
        
        // if(err instanceof AxiosError ){
        //     // dispatch(setFetchGetDragonSilverStatusErrors(err.response))
        //     // dispatch(fetchRefreshToken( () => dispatch(getDragonSilverToClaim()), err))
        // }
    }
  
}

//reducer para monitorear el estado del request para el dragon silver to claim

const  fetchGetDragonSilverStatus  = createSliceStatus("fetchGetDragonSilverStatus")

const [ setFetchGetDragonSilverStatusIdle, setFetchGetDragonSilverStatusPending, setFetchGetDragonSilverStatusFulfilled, setFetchGetDragonSilverStatusErrors ] = actionsGenerator(fetchGetDragonSilverToClaimStatus.actions)
  

interface initialStatePlayer {
    dragonSilver: number
    dragonSilverToClaim: number
}

const initialStatePlayer:  initialStatePlayer  = {dragonSilver: 0, dragonSilverToClaim: 0 }

const player = createSlice({
    name: "player ",
    initialState: initialStatePlayer,
    reducers: {

        setDragonSilverToClaim: (state, action: PayloadAction<number>) => {

            state.dragonSilverToClaim = action.payload

        },

        setAddDragonSilverToClaim: (state, action: PayloadAction<number>) => {

            const dragonSilverToClaim = Number(state.dragonSilverToClaim) + Number(action.payload)

            state.dragonSilverToClaim = dragonSilverToClaim

        },

        setDragonSilver: (state, action: PayloadAction<number>) => {

            state.dragonSilver = action.payload

        },

       
    },
});

export const { setDragonSilverToClaim, setAddDragonSilverToClaim, setDragonSilver } = player.actions


//combinacion de reducer
export const playerReducer = combineReducers({
    data: player.reducer,
    status: combineReducers({
        dragonSilver: fetchGetDragonSilverStatus.reducer,
        dragonSilverToClaim: fetchGetDragonSilverToClaimStatus.reducer
    })
})
  

