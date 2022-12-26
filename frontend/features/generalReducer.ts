import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit"
import { combineReducers } from "redux";
import { userInfoReducer } from "../apps/utils/navBar/features/userInfo"; 
import { accountDataReducer } from "../apps/accountSettings/accountSettings/features/accountData";
import { addDiscordStatusReducer } from "../apps/accountSettings/accountSettings/features/addDiscord";
import { walletCompleteReducer } from "../apps/login/features/walletsConnect";
import { authenticationStatusReducer } from "../apps/login/features/authentication";
import { ProfileDataReducer } from "../apps/accountSettings/accountSettings/features/changeProfileData";
import { refreshReducer } from "./refresh";
import { logoutReducer } from "../apps/accountSettings/accountSettings/features/logout";
import { exploreOfThioldenReducer } from "../apps/explorerOfThiolden/explorerOfThioldenPage/features/explorerOfThiolden";
import { idleQuest } from "../apps/idleQuest/idleQuest/features/idelQuest";

export const generalReducer = combineReducers({
    userDataNavBar: userInfoReducer,
    accountData: accountDataReducer,
    addDiscord: addDiscordStatusReducer,
    wallet: walletCompleteReducer,
    authentication: authenticationStatusReducer,
    profileData: ProfileDataReducer,
    refresh: refreshReducer,
    logout: logoutReducer,
    exploreOfThioldenReducer: exploreOfThioldenReducer,
    idleQuest: idleQuest
})


export const generalStore = configureStore({
    reducer: generalReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware( {serializableCheck: false}),
})

export type generalReducerRootState = ReturnType<typeof generalStore.getState>

export type generalReducerDispatch = typeof generalStore.dispatch

export type generalReducerThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  generalReducerRootState,
  unknown,
  Action<string>
>


export const selectGeneralReducer = (state: generalReducerRootState) => state