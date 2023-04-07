import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { UserInfo, WalletApi } from "./account-dsl"

export interface AccountState {
    userInfo?: UserInfo
    walletApi?: WalletApi
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

        signin: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },

        signout: (state) => {
            state.userInfo = undefined
        },

        updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
            if (state.userInfo == null) throw new Error("Cannot update user info when it is not set")
            state.userInfo = { ...state.userInfo, ...action.payload }
        },

        addStakeAddress: (state, action: PayloadAction<string>) => {
            if (state.userInfo == null) throw new Error("Cannot add stake address when user info is not set")
            state.userInfo.stakeAddresses.push(action.payload)
        },

        setWalletApi: (state, action: PayloadAction<WalletApi>) => {
            state.walletApi = action.payload
        },
    }
})

export const accountStore = configureStore({
    reducer: accountState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
