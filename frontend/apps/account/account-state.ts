import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { UserInfo } from "./account-models"

export interface AccountState {
    userInfo?: UserInfo
}

export type AccountStoreState = 
    ReturnType<typeof accountStore.getState> 

export type AccountThunk<ReturnType = void> = 
    ThunkAction<ReturnType, AccountStoreState, unknown, Action<string>>

const accountInitialState: AccountState = {

}

export const accountState = createSlice({
    name: "account-state",
    initialState: accountInitialState,
    reducers: {

        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },

        updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
            if (state.userInfo == null) throw new Error("Cannot update user info when it is not set")
            state.userInfo = { ...state.userInfo, ...action.payload }
        },
    }
})

export const accountStore = configureStore({
    reducer: accountState.reducer,
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
