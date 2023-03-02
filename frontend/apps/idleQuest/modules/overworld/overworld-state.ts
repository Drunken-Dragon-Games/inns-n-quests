import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Adventurer, Furniture } from "../../common"
import { SectorConfiguration } from "./overworld-dsl"

interface OverworldState {
    name?: string
    innConfiguration?: SectorConfiguration
}

export type OverworldStoreState = 
    ReturnType<typeof overworldStore.getState> // Includes Thunks Middleware

const overworldInitialState: OverworldState = {
}

export const overworldState = createSlice({
    name: "overworld-state",
    initialState: overworldInitialState,
    reducers: {

        setInitialInnState: (state, action: PayloadAction<{ name:string, innConfiguration: SectorConfiguration }>) => {
            state.name = action.payload.name
            state.innConfiguration = action.payload.innConfiguration
        },

        setObjectLocation: (state, action: PayloadAction<{ obj: Adventurer | Furniture, location: [number, number] }>) => { 
            const obj = action.payload.obj
            const location = action.payload.location
            const innConfiguration = state.innConfiguration
            if (!innConfiguration) return
            if (obj.ctype == "adventurer") {
                if (!innConfiguration[obj.adventurerId]) innConfiguration[obj.adventurerId] = { obj, location }
                else innConfiguration[obj.adventurerId].location = location
            } else if (obj.ctype == "furniture") {
                if (!innConfiguration[obj.furnitureId]) innConfiguration[obj.furnitureId] = { obj, location }
                else innConfiguration[obj.furnitureId].location = location
            }
        },
    }
})

export const {
    setInitialInnState,
    setObjectLocation,
} = overworldState.actions

export const overworldStore = configureStore({
    reducer: overworldState.reducer,
})

