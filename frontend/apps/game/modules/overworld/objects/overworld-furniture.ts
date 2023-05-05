import { Furniture } from "../../../../common";
import OverworldTransitions from "../overworld-transitions";
import { Overworld } from "../scenes/overworld";

export default class OverworldFurniture {

    public lastClickTime: number = 0

    constructor(
        public readonly furniture: Furniture,
        public readonly sprite: Phaser.Physics.Arcade.Sprite,
        private readonly overworld: Overworld,
    ){}

    static init (furniture: Furniture, overworld: Overworld, position: Phaser.Math.Vector2, flipped: boolean): OverworldFurniture {
        const sprite = OverworldFurniture.createSprite(furniture, overworld, position, flipped)
        const owFurniture = new OverworldFurniture(furniture, sprite, overworld)
        overworld.furniture.push(owFurniture)
        sprite.on("pointerup", OverworldFurniture.onPointerUp(overworld, owFurniture))
        sprite.on("dragstart", OverworldFurniture.onDragStart(overworld, owFurniture))
        sprite.on("drag", OverworldFurniture.onDrag(overworld, owFurniture))
        sprite.on("dragend", OverworldFurniture.onDragEnd(overworld, owFurniture))
        return owFurniture
    }

    static createSprite (furniture: Furniture, overworld: Overworld, position: Phaser.Math.Vector2, isFacingRight: boolean): Phaser.Physics.Arcade.Sprite {
        const i = parseInt(furniture.assetRef.match(/(\d+)/)![0])
        // Later check furniture collection and load from right sprite sheet
        const { sheet, index, size, offset } = pixelTilesSpritesheetMap(i)
        const sprite = overworld.physics.add.sprite(position.x, position.y, sheet, index)
        sprite.setSize(size[0], size[1]) /** Collision box size */
        sprite.setOffset(offset[0], offset[1]) /** Collision box offset */
        sprite.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        overworld.input.setDraggable(sprite)
        overworld.physics.add.collider(sprite, overworld.walls)

        sprite.flipX = isFacingRight

        return sprite 
    }

    destroy() {
        this.sprite.destroy()
        this.overworld.furniture = this.overworld.furniture.filter(a => a.furniture.entityId !== this.furniture.entityId)
        OverworldTransitions.removeObject(this.furniture)
    }

    static onPointerUp = (overworld: Overworld, furniture: OverworldFurniture) => (pointer: Phaser.Input.Pointer) => {
        const now = Date.now()
        const isDoubleClick = now - furniture.lastClickTime < 300
        furniture.lastClickTime = now

        if (isDoubleClick) return furniture.destroy()
        if (pointer.getDuration() < 300) {
            furniture.sprite.flipX = !furniture.sprite.flipX
            furniture.updateLocationState()
            return
        }
    }

    static onDragStart = (overworld: Overworld, furniture: OverworldFurniture) => () => {
        overworld.draggingItem = furniture 
    }

    static onDrag = (overworld: Overworld, furniture: OverworldFurniture) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        furniture.x = dragX
        furniture.y = dragY
    }

    static onDragEnd = (overworld: Overworld, furniture: OverworldFurniture) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        overworld.draggingItem = undefined
        furniture.updateLocationState()
    }

    get objectId() { return this.furniture.entityId }

    get depth() { return this.sprite.depth }

    setDepth() { 
        if (this.furniture.assetRef === "PixelTile62")
            this.sprite.depth = 9
        else 
            this.sprite.depth = this.sprite.y + this.sprite.height / 2
    }

    get x() { return this.sprite.x }

    set x(x: number) { this.sprite.x = x }

    get y() { return this.sprite.y }

    set y(y: number) { this.sprite.y = y }

    get flip() {return this.sprite.flipX}

    set flip(flipped: boolean) { this.sprite.flipX = flipped }

    updateLocationState() { OverworldTransitions.setObjectLocation(this.furniture, [this.x, this.y], this.flip) }
}

const pixelTilesSpritesheetMap = (pxNum: number): { sheet: string, index: number, size: [number, number], offset: [number, number] } => {
    const tables = { sheet: "pixel-tiles-tables", size: [48, 16] as [number, number], offset: [8, 32] as [number, number] }
    const hearths = { sheet: "pixel-tiles-hearths", size: [72, 16] as [number, number], offset: [12, 112] as [number, number] }
    const barBarrels = { sheet: "pixel-tiles-bar-barrels", size: [72, 16] as [number, number], offset: [12, 42] as [number, number] }
    const bars = { sheet: "pixel-tiles-bars", size: [86, 16] as [number, number], offset: [4, 32] as [number, number] }
    const simpleFurniture = { sheet: "pixel-tiles-simple-furniture", size: [32, 8] as [number, number], offset: [0, 56] as [number, number] }
    const rug = { sheet: "pixel-tiles-rug", size: [32, 16] as [number, number], offset: [0, 59] as [number, number] }
    switch (pxNum) {
        case 4: return {...tables, index: 0 }
        case 5: return {...tables, index: 1 }
        case 6: return {...tables, index: 2 }
        case 7: return {...tables, index: 3 }
        case 8: return {...tables, index: 0 }
        case 9: return {...tables, index: 4 }

        case 10: return {...hearths, index: 1 }
        case 18: return {...hearths, index: 0 }
        case 19: return {...hearths, index: 2 }

        case 14: return {...barBarrels, index: 0 }
        case 15: return {...barBarrels, index: 1 }
        case 16: return {...barBarrels, index: 2 }
        case 17: return {...barBarrels, index: 3 }

        case 34: return {...bars, index: 0 }
        case 35: return {...bars, index: 1 }
        case 36: return {...bars, index: 2 }
        case 37: return {...bars, index: 3 }

        case 40: return {...simpleFurniture, index: 0 }
        case 30: return {...simpleFurniture, index: 2 }
        case 26: return {...simpleFurniture, index: 3 }
        case 39: return {...simpleFurniture, index: 4 }
        case 25: return {...simpleFurniture, index: 5 }
        case 38: return {...simpleFurniture, index: 6 }
        case 27: return {...simpleFurniture, index: 7 }
        case 28: return {...simpleFurniture, index: 8 }
        case 29: return {...simpleFurniture, index: 9 }
        case 20: return {...simpleFurniture, index: 10 }

        case 62: return {...rug, index: 0 }

        default: throw new Error(`Unexpected PixelTile number ${pxNum} on overworld furniture loader.`)
    }
}

