import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Character, Furniture } from "../../../common"
import { PositionedObject, SectorConfiguration } from "./overworld-dsl"

export type OverworldParams = {
    paramDraggableItems: boolean
}

interface OverworldState extends OverworldParams {
    name?: string
    innConfiguration?: SectorConfiguration
}

export type OverworldStoreState = 
    ReturnType<typeof overworldStore.getState> // Includes Thunks Middleware

const overworldInitialState: OverworldState = {
    paramDraggableItems: true
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
                state.innConfiguration = { [obj.entityId]: action.payload }
            }
            else{
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

        setParams: (state, action: PayloadAction<OverworldParams>) => {
            state.paramDraggableItems = action.payload.paramDraggableItems
        },
    }
})

export const overworldStore = configureStore({
    reducer: overworldState.reducer,
})

