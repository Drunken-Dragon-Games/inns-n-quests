import { IdleQuestsSnD } from "../../idle-quests-state"
import { setWorldViewLocation, setWorldMap } from "./world-state"
import { WorldMapName } from "./worlds"

export type WorldTransitions = {
    onWorldViewLocationChange: (locationDirection: [number, number]) => void
    onSetWorldMap: (worldMap: { open?: boolean, worldName?: WorldMapName }) => void
}

export const worldTransitions = ({ state, dispatch }: IdleQuestsSnD): WorldTransitions => ({

    onWorldViewLocationChange: (locationDirection: [number, number]) => {
        dispatch(setWorldViewLocation(locationDirection))
    },

    onSetWorldMap: (worldMap: { open?: boolean, worldName?: WorldMapName }) => {
        dispatch(setWorldMap(worldMap))
    }
})