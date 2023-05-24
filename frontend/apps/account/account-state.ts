import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { ClaimInfo, ClaimProcessState, GovernaceState, GovernanceBallots, UserInfo, WalletAssociationProcessState } from "./account-dsl"

export interface AccountState {
    userInfo?: UserInfo
    claimProcessState: ClaimProcessState
    associateProcessState: WalletAssociationProcessState
    dragonSilverClaims: ClaimInfo[]
    governanceBallots: GovernanceBallots
    governanceState: GovernaceState
}

export type AccountStoreState = 
    ReturnType<typeof accountStore.getState> 

export type AccountThunk<ReturnType = void> = 
    ThunkAction<ReturnType, AccountStoreState, unknown, Action<string>>

/*
const ballotsTestData: GovernanceBallots = {
    "1": {
        id: "1",
        inquiry: "Should we add a new emoji to the Discord server?",
        descriptionOfInquiry: "The new emoji would be a dragon.",
        options: [
            { option: "yes", description: "Add the dragon emoji" },
            { option: "no", description: "Do not add the dragon emoji" }
        ],
        voteRegistered: false,
        state: "open"
    },
    "2": {
        id: "2",
        inquiry: "Should we add a new emoji to the Discord server?",
        descriptionOfInquiry: "The new emoji would be a dragon.",
        options: [
            { option: "yes", description: "Add the dragon emoji" },
            { option: "no", description: "Do not add the dragon emoji" }
        ],
        voteRegistered: false,
        state: "closed"
    },
    "3": {
        id: "3",
        inquiry: "Should we add a new emoji to the Discord server?",
        descriptionOfInquiry: "The new emoji would be a dragon.",
        options: [
            { option: "yes", description: "Add the dragon emoji" },
            { option: "no", description: "Do not add the dragon emoji" }
        ],
        voteRegistered: false,
        state: "archived"
    },
    "4": {
        id: "4",
        inquiry: "Should we add a new emoji to the Discord server?",
        descriptionOfInquiry: "The new emoji would be a dragon.",
        options: [
            { option: "yes", description: "Add the dragon emoji" },
            { option: "no", description: "Do not add the dragon emoji" }
        ],
        voteRegistered: false,
        state: "open"
    },
}
*/

const accountInitialState: AccountState = {
    claimProcessState: { ctype: "idle" },
    associateProcessState: { ctype: "idle" },
    dragonSilverClaims: [],
    governanceBallots: {},//ballotsTestData,
    governanceState: {ctype: "idle"}
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

        setGovernanceBallots: (state, action: PayloadAction<GovernanceBallots>) => {
            state.governanceBallots = action.payload
        },

        setGovernanceState: (state, action: PayloadAction<GovernaceState>) => {
            state.governanceState = action.payload
        },

        updateVoteRegistered: (state, action: PayloadAction<string>) => {
            const ballotId = action.payload
            const ballot = state.governanceBallots[ballotId]
            if (!ballot) throw new Error(`Ballot with ID ${ballotId} not found`)
            state.governanceBallots[ballotId].voteRegistered = true
        },
    }
})

export const accountStore = configureStore({
    reducer: accountState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
