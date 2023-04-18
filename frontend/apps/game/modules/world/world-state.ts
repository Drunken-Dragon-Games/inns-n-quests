import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IdSet } from "../../../common"
import { WorldActivity } from "./activity-dsl"
import { WorldMap } from "./world-dsl"
import { BaseInn, NorthWestThioldenPaperMap, WorldMapName } from "./worlds"

export type WorldState = {
    activeMap: WorldMap
    open: boolean
    viewLocation: { [worldName in WorldMapName]: [number, number] }

    //parties: IdSet<AdventurerParty>
    activities: IdSet<WorldActivity>
}

const worldInitialState: WorldState = { 
    activeMap: NorthWestThioldenPaperMap,
    open: false,
    viewLocation: { "Northwest Thiolden": [0, 0], "Base Inn": [0, 0] },
    //parties: {},
    activities: {},
}

export const worldState = createSlice({
    name: "world-state",
    initialState: worldInitialState,
    reducers: {

        setWorldViewLocation: (state, action: PayloadAction<[number, number]>) => {
            const scale = state.activeMap.metadata.units.scale
            const [ changeX, changeY ] = action.payload
            const [ currentX, currentY ] = state.viewLocation[state.activeMap.metadata.name]
            state.viewLocation[state.activeMap.metadata.name] = [ changeX, changeY ]
        },

        setWorldMap: (state, action: PayloadAction<{ open?: boolean, worldName?: WorldMapName }>) => {
            state.open = action.payload.open ?? !state.open
            state.activeMap = 
                action.payload.worldName == "Northwest Thiolden" ? NorthWestThioldenPaperMap : 
                action.payload.worldName == "Base Inn" ? BaseInn :
                state.activeMap
        },

        /*
        setParties: (state, action: PayloadAction<AdventurerParty[]>) => {
            action.payload.forEach(party => {
                state.parties[party.partyId] = party
            })
        },
        */

        setActivities: (state, action: PayloadAction<WorldActivity[]>) => {
            action.payload.forEach(activity => {
                state.activities[activity.activityId] = activity
            })
        },
    }
})

export const {
    setWorldViewLocation,
    setWorldMap,
    //setParties,
    setActivities,
} = worldState.actions
