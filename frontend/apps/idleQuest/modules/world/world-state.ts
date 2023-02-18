import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AdventurerParty } from "../../dsl"
import { IdSet } from "../../utils"
import { WorldActivity } from "./activity-dsl"
import { nwThiolden, WorldMap } from "./world-map-dsl"

export type WorldState = {
    worldMap: WorldMap
    open: boolean
    viewLocation: [number, number]
    parties: IdSet<AdventurerParty>
    activities: IdSet<WorldActivity>
}

const worldInitialState: WorldState = { 
    worldMap: nwThiolden,
    open: false,
    viewLocation: [0, 0],
    parties: {},
    activities: {},
}

export const worldState = createSlice({
    name: "world-state",
    initialState: worldInitialState,
    reducers: {

        setCurrentWorldMapLocation: (state, action: PayloadAction<[number, number]>) => {
            state.viewLocation = action.payload
        },

        toggleWorldMap: (state) => {
            state.open = !state.open
        },

        setParties: (state, action: PayloadAction<AdventurerParty[]>) => {
            action.payload.forEach(party => {
                state.parties[party.partyId] = party
            })
        },

        setActivities: (state, action: PayloadAction<WorldActivity[]>) => {
            action.payload.forEach(activity => {
                state.activities[activity.activityId] = activity
            })
        },
    }
})

export const {
    setCurrentWorldMapLocation,
    toggleWorldMap,
    setParties,
    setActivities,
} = worldState.actions
