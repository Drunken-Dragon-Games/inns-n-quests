import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type WorldMapState = {
    currentLocation: [number, number]
}

const worldMapInitialState: WorldMapState = { 
    currentLocation: [0, 0]
}

export const worldMapState = createSlice({
    name: "worldMap-state",
    initialState: worldMapInitialState,
    reducers: {

        setCurrentLocation: (state, action: PayloadAction<[number, number]>) => {
            state.currentLocation = action.payload
        },
    }
})

export const {
    setCurrentLocation,
} = worldMapState.actions
