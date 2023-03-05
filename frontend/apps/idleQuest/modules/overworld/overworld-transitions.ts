import _ from "underscore"
import { Character, Furniture } from "../../common"
import IdleQuestsApi from "../../idle-quests-api"
import { SectorConfiguration } from "./overworld-dsl"
import { overworldStore, setInitialInnState, setObjectLocation } from "./overworld-state"

let lastInnState: { name?: string, innConfiguration?: SectorConfiguration } = {}

const trackInnSaves = () => {
    setInterval(() => {
        const state = overworldStore.getState()
        const innState = { name: state.name, innConfiguration: state.innConfiguration }
        if (!innState.innConfiguration || _.isEqual(innState, lastInnState)) return
        lastInnState = innState
        const innStateToSave = { name: innState.name, objectLocations: ({} as Record<string, [number, number]>) }
        Object.keys(innState.innConfiguration!).forEach(objectId => {
            const obj = innState.innConfiguration![objectId].obj
            const location = innState.innConfiguration![objectId].location
            innStateToSave.objectLocations[obj.entityId] = location
        })
        IdleQuestsApi.setInnState(innStateToSave)
    }, 2000)
}

const OverworldTransitions = {

    trackOverworldState: () => {
        trackInnSaves()
    },

    setObjectLocation: (obj: Character | Furniture, location: [number, number]) => 
        overworldStore.dispatch(setObjectLocation({ obj, location })),
    
    setInitialInnState: (name:string, innConfiguration: SectorConfiguration) => {
        overworldStore.dispatch(setInitialInnState({ name, innConfiguration }))
        lastInnState = { name, innConfiguration }
    },
}

export default OverworldTransitions
