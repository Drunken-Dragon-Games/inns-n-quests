import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Character, Furniture } from "../../../common"
import { PositionedObject, SectorConfiguration } from "./overworld-dsl"

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

        setObjectLocation: (state, action: PayloadAction<PositionedObject>) => { 
            const obj = action.payload.obj
            const location = action.payload.location
            const flipped = action.payload.flipped
            const innConfiguration = state.innConfiguration
            // Is there a future reason for differentiating between Character and Furniture here?
            // The logic for both cases currenlty appears to be the same.
            if (!innConfiguration) {
                if (obj.ctype == "character") state.innConfiguration = { [obj.entityId]: action.payload }
                else if (obj.ctype == "furniture") state.innConfiguration = { [obj.entityId]: action.payload }
            }
            else if (obj.ctype == "character") {
                if (!innConfiguration[obj.entityId]) innConfiguration[obj.entityId] = action.payload
                else {
                    innConfiguration[obj.entityId].location = location
                    innConfiguration[obj.entityId].flipped = flipped
                }
            } else if (obj.ctype == "furniture") {
                if (!innConfiguration[obj.entityId]) innConfiguration[obj.entityId] = action.payload
                else {
                    innConfiguration[obj.entityId].location = location
                    innConfiguration[obj.entityId].flipped = flipped
                }
            }
        },

        removeObject: (state, action: PayloadAction<Character | Furniture>) => {
            const innConfiguration = state.innConfiguration
            if (innConfiguration && innConfiguration[action.payload.entityId]) 
                    delete innConfiguration[action.payload.entityId]
        },
    }
})

export const overworldStore = configureStore({
    reducer: overworldState.reducer,
})

