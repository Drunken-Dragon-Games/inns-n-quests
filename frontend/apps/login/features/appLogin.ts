import { combineReducers } from "redux";
import { walletCompleteReducer } from "./walletsConnect";
import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit"
import { authenticationStatusReducer } from "./authentication";
import { discordCompleteReducer } from "./discordConnect";

// import { authenticationStatusReducer } from "./authentication"; 

export const loginPageReducer = combineReducers({
    wallet: walletCompleteReducer,
    authentication: authenticationStatusReducer,
    discord: discordCompleteReducer
})

export const loginStore = configureStore({
    reducer: loginPageReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware( {serializableCheck: false}),
})

export type loginRootState = ReturnType<typeof loginStore.getState>

export type loginDispatch = typeof loginStore.dispatch

export type LoginThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  loginRootState,
  unknown,
  Action<string>
>



export const selectLoginPageReducer = (state: loginRootState) => state

