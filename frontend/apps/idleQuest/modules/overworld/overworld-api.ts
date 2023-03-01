import { Adventurer } from "../../common"

export let events: Phaser.Events.EventEmitter

const OverworldApi = {

    setEventEmitter: (eventEmitter: Phaser.Events.EventEmitter) => events = eventEmitter,

    draggingItemIntoOverworld: (item: Adventurer, position: [number, number]) => {
        events.emit("dragging-item", item, position)
    },

}

export default OverworldApi
