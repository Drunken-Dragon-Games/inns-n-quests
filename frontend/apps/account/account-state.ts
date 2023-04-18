import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { ClaimInfo, ClaimProcessState, UserInfo, WalletAssociationProcessState } from "./account-dsl"

export interface AccountState {
    userInfo?: UserInfo
    claimProcessState: ClaimProcessState
    associateProcessState: WalletAssociationProcessState
    dragonSilverClaims: ClaimInfo[]
}

export type AccountStoreState = 
    ReturnType<typeof accountStore.getState> 

export type AccountThunk<ReturnType = void> = 
    ThunkAction<ReturnType, AccountStoreState, unknown, Action<string>>

const accountInitialState: AccountState = {
    claimProcessState: { ctype: "idle" },
    associateProcessState: { ctype: "idle" },
    dragonSilverClaims: [],
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

        setAssociateProcessState: (state, action: PayloadAction<WalletAssociationProcessState>) => {
            state.associateProcessState = action.payload
        },

        setClaimProcessState: (state, action: PayloadAction<ClaimProcessState>) => {
            state.claimProcessState = action.payload
        },

        setDragonSilverClaims: (state, action: PayloadAction<ClaimInfo[]>) => {
            state.dragonSilverClaims = action.payload
        },

        addDragonSilver: (state, action: PayloadAction<number>) => {
            if (state.userInfo == null) throw new Error("Cannot set dragon silver to claim to claimed when user info is not set")
            state.userInfo.dragonSilver += action.payload
        },
    }
})

export const accountStore = configureStore({
    reducer: accountState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
