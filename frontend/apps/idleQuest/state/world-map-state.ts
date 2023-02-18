import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { nwThiolden, WorldMap } from "../dsl"

export type WorldMapState = {
    worldMap: WorldMap
    open: boolean
    currentLocation: [number, number]
}

const worldMapInitialState: WorldMapState = { 
    worldMap: nwThiolden,
    open: false,
    currentLocation: [0, 0]
}

export const worldMapState = createSlice({
    name: "worldMap-state",
    initialState: worldMapInitialState,
    reducers: {

        setCurrentWorldMapLocation: (state, action: PayloadAction<[number, number]>) => {
            state.currentLocation = action.payload
        },

        toggleWorldMap: (state) => {
            state.open = !state.open
        }
    }
})

export const {
    setCurrentWorldMapLocation,
    toggleWorldMap,
} = worldMapState.actions
