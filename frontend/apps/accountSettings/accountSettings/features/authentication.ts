import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { combineReducers } from "redux";
import {
    Address
  } from "@emurgo/cardano-serialization-lib-asmjs"

import { createSliceStatus, actionsGenerator } from '../../../utils/features/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setStakeAddress } from "../features/accountData"
import { generalReducerThunk } from '../../../../features/generalReducer';
import { AxiosError } from "axios";
import { fetchRefreshToken } from "../../../../features/refresh";
import { userDataFetch } from '../../../utils/navBar/features/userInfo';

// funcion para obtener y deserializar los datos de la cartera y obtener el address INPUT raw data Wallet

export const deserializeStakeAddress = (): generalReducerThunk => async (dispatch, getState) =>{
  
    dispatch(setDeserializeStakeAddressStatusPending())

    const api = getState().wallet.data.api

    try {  

      // extrae el valor del RewardAddress del objeto obtenido de la cartera  output un array en el cual contiene el Reward Address serializado 
      const raw = await api.getRewardAddresses()

      // extra el reward address serializado del array
      const rewardAddress = raw[0]

      // se desserializa el reward Address y se obtiene el stake Address
      const stakeAddress = Address.from_bytes(Buffer.from(rewardAddress, "hex")).to_bech32() 

      
      dispatch(setDeserializeStakeAddressStatusFulfilled()) 

      //se llama a la funcion para mandar el Address al backend
      dispatch(fetchPostStakeAddresses(stakeAddress, rewardAddress))

    } catch (err:  unknown ) {      
        dispatch(setDeserializeStakeAddressStatusRejected(err))
    }
  
}
  
 //reducer para monitorear el status de deserializeStakeAddress
  
 const  deserializeStakeAddressStatus  = createSliceStatus("deserializeStakeAddressStatus")

 const [ setDeserializeStakeAddressStatusIdle, setDeserializeStakeAddressStatusPending, setDeserializeStakeAddressStatusFulfilled, setDeserializeStakeAddressStatusRejected ] = actionsGenerator(deserializeStakeAddressStatus.actions)


//fetch para mandar el reward address y el stake address

export const fetchPostStakeAddresses = (stakeAddress: string, rewardAddress: string ): generalReducerThunk => async (dispatch) => {

    dispatch(setFetchPostStakeAddressesStatusPending())
    
    try{
        //fetch al backend le envias el stakeAddress OUTPUT la respuesta es un NONCE para que lo firme la wallet y comprobar la autenticidad
        const response = await axiosCustomInstance('api/validate/').post('api/validate/', {"stakeAddress": stakeAddress})
        
        dispatch(setFetchPostStakeAddressesStatusFulfilled())

        //se llama la funcion para firmar el mensaje
        dispatch(signatureMessage(rewardAddress, response.data.nonce))
    }

    catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setFetchPostStakeAddressesStatusRejected(err))
            dispatch(fetchRefreshToken( () => dispatch(fetchPostStakeAddresses(stakeAddress, rewardAddress)), err))
        }
    }
}

//reducer para verificar la coneccion del wallet con el back

const  fetchPostStakeAddressesStatus  = createSliceStatus("fetchPostStakeAddressesStatus")

const [ setFetchPostStakeAddressesStatusIdle, setFetchPostStakeAddressesStatusPending, setFetchPostStakeAddressesStatusFulfilled, setFetchPostStakeAddressesStatusRejected ] = actionsGenerator(fetchPostStakeAddressesStatus.actions)


//funcion para firmar el NONCE y atenticar

export const signatureMessage = (rewardAddress: string, nonce: string): generalReducerThunk => async (dispatch, getState) =>{
  
    // se requiere el el tipo de cifrado hexadecimal
    const hex = require('string-hex')
  
    dispatch(setSignatureMessageStatusPending())

    const api = getState().wallet.data.api
    
    try {

      //pide a la wallet para firmar el mensaje y verificar la autenticacion INPUT rewardAddress y NONCE sifrado en Hexadecimal OUTPUT mensaje cifrado 
      const token = await api.signData(rewardAddress, hex(`${nonce}`));
      
      dispatch(setSignatureMessageStatusFulfilled()) 

      //funcion para madar el nonce firmado por la wallet
      dispatch(fetchSignedMessage(nonce, token))   

    } catch (err) {
      dispatch(setSignatureMessageStatusRejected((err as Error).message))
    }
  
}

//reducer para monitorear el estado de la peticion de la firma

const  signatureMessageStatus  = createSliceStatus("signatureMessageStatus")

const [ setSignatureMessageStatusIdle, setSignatureMessageStatusPending, setSignatureMessageStatusFulfilled, setSignatureMessageStatusRejected ] = actionsGenerator(signatureMessageStatus.actions)


 // fetch para mandar el mensaje ya firmada por la wallet

export const fetchSignedMessage = (nonce: string, messageSigned: string) : generalReducerThunk => async (dispatch) =>{
  
    dispatch(setFetchSignedMessageStatusPending())
    try {  
        //fetch para post el NONCE y el NONCE firmado y enviado al backend para authenticar 
        
        // FIX ME: send traceId in json to backend
        const response = await axiosCustomInstance(`api/validateWallet/${nonce}`).post(`api/validateWallet/${nonce}`, messageSigned)
        
        
        dispatch(setStakeAddress(response.data.stakeAddresses))

        dispatch(userDataFetch())
        
        dispatch(setFetchSignedMessageStatusFulfilled())

        //si se completa el fetch cambia a autenticado para redirigirte
        dispatch(setIsAuthenticated("authenticated"))
     
    } 

    catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setFetchSignedMessageStatusRejected(err))
            dispatch(fetchRefreshToken( () => dispatch(fetchSignedMessage(nonce, messageSigned)), err))
        }
        
        dispatch(setIsAuthenticated("rejected"))
    }
  
}

//reducer para monitorear la verificacion si es autorizado
  
const  fetchSignedMessageStatus  = createSliceStatus("fetchSignedMessageStatus")

const [ setFetchSignedMessageStatusIdle, setFetchSignedMessageStatusPending, setFetchSignedMessageStatusFulfilled, setFetchSignedMessageStatusRejected ] = actionsGenerator(fetchSignedMessageStatus.actions)

//reducer que controla si esta authenticado o no


interface authenticated {
    isAuthenticated: "idle" | "authenticated" | "rejected"
}


const initialStateAuthenticated: authenticated = { isAuthenticated: "idle" }

const makeAuthenticated = createSlice({
    name: "authentication",
    initialState: initialStateAuthenticated,
    reducers: {
      
        setIsAuthenticated: (state, action: PayloadAction<"idle" | "authenticated" | "rejected">) => {
            state.isAuthenticated = action.payload
        
      }
    },
});

export const { setIsAuthenticated } = makeAuthenticated.actions


//all reducers 
export const authenticationStatusReducer = combineReducers({
    authenticated: makeAuthenticated.reducer,
    status: combineReducers({
        deserializeStakeAddressStatus: deserializeStakeAddressStatus.reducer,
        fetchStakeAddressesPostStatus: fetchPostStakeAddressesStatus.reducer,
        signatureMessageStatus: signatureMessageStatus.reducer,
        fetchSignedMessagePostStatus: fetchSignedMessageStatus.reducer,
    })
})

  
  export const selectAuthenticationReducer = (state: any) => state