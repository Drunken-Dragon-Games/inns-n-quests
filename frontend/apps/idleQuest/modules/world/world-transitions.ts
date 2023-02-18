import { IdleQuestsSnD } from "../../idle-quests-state"
import { setCurrentWorldMapLocation, toggleWorldMap } from "./world-state"

export type WorldTransitions = {
    onWorldMapLocationChange: (newLocation: [number, number]) => void
    onToggleWorldView: () => void
}

export const worldTransitions = ({ state, dispatch }: IdleQuestsSnD): WorldTransitions => ({

    onWorldMapLocationChange: (newLocation: [number, number]) => {
        dispatch(setCurrentWorldMapLocation(newLocation))
    },

    onToggleWorldView: () => {
        dispatch(toggleWorldMap())
    }
})