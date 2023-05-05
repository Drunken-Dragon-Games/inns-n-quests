import _ from "underscore"
import { Character, Furniture } from "../../../common"
import IdleQuestsApi from "../../idle-quests-api"
import { SectorConfiguration } from "./overworld-dsl"
import { overworldState, overworldStore } from "./overworld-state"
import { ObjectsLocations } from "../../game-vm"

const actions = overworldState.actions

const dispatch = overworldStore.dispatch

let lastInnState: { name?: string, innConfiguration?: SectorConfiguration } = {}

/**
 * Handles the translation between the frontend innState: SectorConfiguration
 * and the backend innState: Sector.ObjectsLocations
 */
const trackInnSaves = () => {
    setInterval(() => {
        const state = overworldStore.getState()
        const innState = { name: state.name, innConfiguration: state.innConfiguration }
        if (!innState.innConfiguration || _.isEqual(innState, lastInnState)) return
        lastInnState = innState
        const innStateToSave = { name: innState.name, objectLocations: ({} as ObjectsLocations) }
        Object.keys(innState.innConfiguration!).forEach(objectId => {
            const obj = innState.innConfiguration![objectId].obj
            const location = innState.innConfiguration![objectId].location
            const flipped = innState.innConfiguration![objectId].flipped
            innStateToSave.objectLocations[obj.entityId] = innStateToSave.objectLocations[obj.entityId] || {}
            innStateToSave.objectLocations[obj.entityId] = {cord:location, flipped}
        })
        IdleQuestsApi.setInnState(innStateToSave)
    }, 2000)
}

const OverworldTransitions = {

    trackOverworldState: () => {
        trackInnSaves()
    },

    setObjectLocation: (obj: Character | Furniture, location: [number, number], flipped: boolean) => 
        dispatch(actions.setObjectLocation({ obj, location, flipped})),

    removeObject: (obj: Character | Furniture) =>
        dispatch(actions.removeObject(obj)),
    
    setInitialInnState: (name:string, innConfiguration: SectorConfiguration) => {
        dispatch(actions.setInitialInnState({ name, innConfiguration }))
        lastInnState = { name, innConfiguration }
    },
}

export default OverworldTransitions
