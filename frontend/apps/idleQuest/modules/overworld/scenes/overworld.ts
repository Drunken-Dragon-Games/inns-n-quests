import Phaser from "phaser"
import { Adventurer, Furniture } from "../../../common"
import { innBuildingRenderMatrix } from "../assets"
import OverworldAdventurer from "../objects/overworld-adventurer"
import OverworldFurniture from "../objects/overworld-furniture"
import { overworldState, overworldStore } from "../overworld-state"
import OverworldTransitions from "../overworld-transitions"

type KInputs = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    Space: Phaser.Input.Keyboard.Key,
}

export class Overworld extends Phaser.Scene {
    
    /** Objects */
    walls!: Phaser.GameObjects.Sprite[]
    adventurers: OverworldAdventurer[] = []
    furniture: OverworldFurniture[]= []
    draggingItem?: OverworldAdventurer | OverworldFurniture
    
    /** Controls */
    inputs!: KInputs
    cameraControls!: Phaser.Cameras.Controls.SmoothedKeyControl
    origDragPoint?: Phaser.Math.Vector2

    constructor() { super("Overworld") }

    subscribeDraggingItemFromInventory() {
        this.game.events.on("dragging-item-from-inventory", (item: Adventurer | Furniture, position?: [number, number]) => {
            const camera = this.cameras.main
            if (!position) {
                this.draggingItem?.updateLocationState()
                this.draggingItem = undefined
                return 
            }
            const overworldPosition = new Phaser.Math.Vector2(
                (position[0] * camera.scaleManager.displayScale.x / camera.zoom + camera.worldView.left), 
                (position[1] * camera.scaleManager.displayScale.y / camera.zoom + camera.worldView.top)
            )
            if (this.draggingItem) {
                this.draggingItem.x = overworldPosition.x
                this.draggingItem.y = overworldPosition.y
            }
            else {
                if (item.ctype === "adventurer")
                    this.draggingItem = 
                        this.adventurers.filter(adventurer => adventurer.adventurer.adventurerId === item.adventurerId)[0] ||
                        OverworldAdventurer.init(item, this, overworldPosition)
                else if (item.ctype === "furniture")
                    this.draggingItem = 
                        this.furniture.filter(furniture => furniture.furniture.furnitureId === item.furnitureId)[0] ||
                        OverworldFurniture.init(item, this, overworldPosition)
            }
        })
    }

    subscribeCancelDraggingItemFromInventory() {
        this.game.events.on("cancel-dragging-item-from-inventory", () => {
            if (this.draggingItem) {
                this.draggingItem.destroy()
                this.draggingItem = undefined
            }
        })
    }

    setInitialInnState() {
        const state = overworldStore.getState()
        const innConfiguration = state.innConfiguration
        if (innConfiguration) {
            this.adventurers.forEach(adventurer => adventurer.destroy())
            this.furniture.forEach(furniture => furniture.destroy())
            Object.values(innConfiguration).forEach(({ obj, location }) => {
                if (obj.ctype === "adventurer")
                    this.adventurers.push(OverworldAdventurer.init(obj, this, new Phaser.Math.Vector2(location[0], location[1])))
                else if (obj.ctype === "furniture")
                    this.furniture.push(OverworldFurniture.init(obj, this, new Phaser.Math.Vector2(location[0], location[1])))
            })
        }
        OverworldTransitions.trackOverworldState()
    }

    preload() {
        this.subscribeDraggingItemFromInventory()
        this.subscribeCancelDraggingItemFromInventory()
        this.inputs = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            Space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        }
        const cameraControl = this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
            left: this.inputs.A,
            right: this.inputs.D,
            up: this.inputs.W,
            down: this.inputs.S,
            acceleration: 1,
            drag: 1,
            zoomSpeed: 1,
            maxSpeed: 0.35,
            minZoom: 1,
            maxZoom: 2.0
        })
        this.cameras.main.setBounds(0, 0, 1577, 1300, true)
        this.cameras.main.scrollX = this.cameras.main.scrollX - 190
    }

    create() {
        this.add.image(0, 0, "inn-bg").setOrigin(0, 0)
        const innOrigin: [number, number] = [350, 485]
        innBuildingRenderMatrix[0].render(this, innOrigin)
        this.walls = innBuildingRenderMatrix[1].render(this, innOrigin)

        // @ts-ignore
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.cameras.main.setZoom(deltaY > 0 ? 1 : 2)
        })

        this.setInitialInnState()
    }

    update(time: number, delta: number): void {
        this.adventurers.forEach(adventurer => adventurer.depth = adventurer.y + 10)
        this.furniture.forEach(furniture => furniture.depth = furniture.y + 10)
        this.walls.forEach(wall => wall.depth = wall.y + 10)
        this.cameraControls.update(delta)

        if (this.game.input.activePointer.isDown && !this.draggingItem) {
            if (this.origDragPoint) {
                // move the camera by the amount the mouse has moved since last update		
                this.cameras.main.scrollX += this.origDragPoint.x - this.game.input.activePointer.position.x
                this.cameras.main.scrollY += this.origDragPoint.y - this.game.input.activePointer.position.y
            }
            // set new drag origin to current position	
            this.origDragPoint = this.game.input.activePointer.position.clone()
        } else {
            this.origDragPoint = undefined
        }
    }
}
