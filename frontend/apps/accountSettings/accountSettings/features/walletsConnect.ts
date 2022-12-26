import { createSliceStatus, actionsGenerator } from '../../../utils/features/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import { deserializeStakeAddress } from './authentication';
import { generalReducerThunk } from '../../../../features/generalReducer';
import { cardano_network } from '../../../../setting';

//esta funcion regresa la api dependendiendo de la wallet

export const walletConnection =  (wallet: "nami" | "eternl"): generalReducerThunk => async (dispatch) => {
  let api


  try{
      if (wallet == 'nami') {

          api = await window.cardano.nami.enable()

          dispatch(setWalletManager({api: api}))

          dispatch(connectNami())
      
      } else if (wallet == 'eternl') {
          
          api = await window.cardano.eternl.enable()

          dispatch(setWalletManager({api: api}))

          dispatch(connectEternl())
      } 
   
  }catch (err){

      dispatch(setWalletStatusRejected("Wallet extension was not found"))

  }
}


// una conecion local para llamar a la cartera de nami 

export const connectNami = (): generalReducerThunk => async (dispatch, getState) => {

  dispatch(setWalletStatusPending())


  try {

    //realiza la coneccion con la cartera funcion que regresa la api requerida
    let api = getState().wallet.data.api

    //realiza un llamado para saber si la cartera esta en output Mainnet (1) o Testnet (0) 
    let net: 1 | 0 = await api.getNetworkId()

    const currentNet: 1 | 0 = cardano_network()

    //revisa en que net esta actualmente
    if (net == currentNet) {

      // se agrega la api y que wallet es al estado
      dispatch(setWalletManager({ api: api }))

      // se llama a la funcion de deserializacion para obtener el stakeAddress
      dispatch(deserializeStakeAddress())

    } else {

      const message = `The wallet with you want to authenticated has to be on ${ typeof process.env["NEXT_PUBLIC_CARDANO_NETWORK"] == "string" ? process.env["NEXT_PUBLIC_CARDANO_NETWORK"] : "testnet"}.`

      dispatch(setWalletStatusRejected(message))

    }


  }
  catch (err) {

    //si el error es que no se encontro la extencion de nami manda el mensaje de error
    if ((err as Error).message == "Cannot read properties of undefined (reading 'nami')") {

      dispatch(setWalletStatusRejected("Nami wallet extension was not found"))

    }
  }

}


// una conecion local para llamar a la cartera de eternl

export const connectEternl = (): generalReducerThunk => async (dispatch, getState) => {


  dispatch(setWalletStatusPending())



  try {

    //realiza la coneccion con la cartera funcion que regresa la api requerida
    let api = getState().wallet.data.api

    
    

    //realiza un llamado para saber si la cartera esta en output Mainnet (1) o Testnet (0) 
    let net: 1 | 0 = await api.getNetworkId()

    
    const currentNet: 1 | 0 = cardano_network()

    
    //revisa en que net esta actualmente el alpha es testnet 
    if (net == currentNet) {



      // se agrega la api y que wallet es al estado
      dispatch(setWalletManager({ api: api }))


      // se llama a la funcion de deserializacion para obtener el stakeAddress
      dispatch(deserializeStakeAddress())

    } else{

      const message = `The wallet with you want to authenticated has to be on ${ typeof process.env["NEXT_PUBLIC_CARDANO_NETWORK"] == "string" ? process.env["NEXT_PUBLIC_CARDANO_NETWORK"] : "testnet"}.`

      dispatch(setWalletStatusRejected(message))

    }
    dispatch(setWalletStatusFulfilled())

  }
  catch (err: unknown) {

    //si el error es que no se encontro la extencion de eternl manda el mensaje de error
    if ((err as Error).message == "Cannot read properties of undefined (reading 'Etenl')") {

      dispatch(setWalletStatusRejected("Etenl wallet extension was not found"))

    }
  }

}

// reducer para moniterear el estado de la llamada a las carteras

const walletStatus = createSliceStatus("wallet")

const [setWalletStatusIdle, setWalletStatusPending, setWalletStatusFulfilled, setWalletStatusRejected] = actionsGenerator(walletStatus.actions)


interface walletManager {
  api: any | null
}

const initialStateWallet: walletManager = { api: null,}

const walletManager = createSlice({
  name: "walletManager",
  initialState: initialStateWallet,
  reducers: {

    setWalletManager: (state, action: PayloadAction<walletManager>) => {

      state.api = action.payload.api
    }
  },
});

const { setWalletManager } = walletManager.actions


export const walletCompleteReducer = combineReducers({
  connectWalletStatus: walletStatus.reducer,
  data: walletManager.reducer,
})
