import { Character, Furniture, IdleQuestsInventory } from "../../../common"
import { SectorConfiguration } from "./overworld-dsl"
import { OverworldParams } from "./overworld-state"
import OverworldTransitions from "./overworld-transitions"

export let events: Phaser.Events.EventEmitter

const OverworldApi = {

    setEventEmitter: (eventEmitter: Phaser.Events.EventEmitter) => events = eventEmitter,

    draggingItemIntoOverworld: (item: Character | Furniture, position?: [number, number]) => {
        events.emit("dragging-item-from-inventory", item, position)
    },

    cancelDraggingItemIntoOverworld: () => {
        events.emit("cancel-dragging-item-from-inventory")
    },

    /**
     * Handles the translation between the backend inventory.innState: Sector type
     * into the frontend innState: SectorConfiguration type
     * @param inventory
     */
    setInitialInnState: (inventory: IdleQuestsInventory) => {
        const innState = inventory.innState
        if (innState) {
            const innConfiguration: SectorConfiguration = {}
            Object.keys(innState.objectLocations).forEach(objectId => {
                const obj: Character | Furniture = inventory.characters[objectId] || inventory.furniture[objectId]
                innConfiguration[objectId] = { obj, location: innState.objectLocations[objectId].cord, flipped: innState.objectLocations[objectId].flipped }
            })
            OverworldTransitions.setInitialInnState(innState.name, innConfiguration)
        }
    },

    getPrams: (): OverworldParams => OverworldTransitions.getParams(),

    setParams: (params: OverworldParams) => OverworldTransitions.setParams(params),
}

const retry = (fn: () => void, retries: number, delay: number) => {
    if (retries === 0) return
    try { fn() } 
    catch { setTimeout(() => retry(fn, retries - 1, delay), delay) }
}

export default OverworldApi
