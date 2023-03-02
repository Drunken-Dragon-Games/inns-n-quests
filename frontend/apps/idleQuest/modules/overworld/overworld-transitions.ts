import _ from "underscore"
import { Adventurer, Furniture } from "../../common"
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
            if (obj.ctype == "adventurer") {
                innStateToSave.objectLocations[obj.adventurerId] = location
            } else if (obj.ctype == "furniture") {
                innStateToSave.objectLocations[obj.furnitureId] = location
            }
        })
        IdleQuestsApi.setInnState(innStateToSave)
    }, 2000)
}

const OverworldTransitions = {

    trackOverworldState: () => {
        trackInnSaves()
    },

    setObjectLocation: (obj: Adventurer | Furniture, location: [number, number]) => 
        overworldStore.dispatch(setObjectLocation({ obj, location })),
    
    setInitialInnState: (name:string, innConfiguration: SectorConfiguration) => {
        overworldStore.dispatch(setInitialInnState({ name, innConfiguration }))
        lastInnState = { name, innConfiguration }
    },
}

export default OverworldTransitions
