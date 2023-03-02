import { Adventurer, Furniture } from "../../common"

export let events: Phaser.Events.EventEmitter

const OverworldApi = {

    setEventEmitter: (eventEmitter: Phaser.Events.EventEmitter) => events = eventEmitter,

    draggingItemIntoOverworld: (item: Adventurer | Furniture, position?: [number, number]) => {
        events.emit("dragging-item-from-inventory", item, position)
    },

    cancelDraggingItemIntoOverworld: () => {
        events.emit("cancel-dragging-item-from-inventory")
    },
}

export default OverworldApi
