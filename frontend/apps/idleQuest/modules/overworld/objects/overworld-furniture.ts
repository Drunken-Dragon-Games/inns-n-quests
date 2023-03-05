import { Furniture } from "../../../common";
import OverworldTransitions from "../overworld-transitions";
import { Overworld } from "../scenes/overworld";

export default class OverworldFurniture {

    public lastClickTime: number = 0

    constructor(
        public readonly furniture: Furniture,
        public readonly sprite: Phaser.Physics.Arcade.Sprite,
        private readonly overworld: Overworld
    ){}

    static init (furniture: Furniture, overworld: Overworld, position: Phaser.Math.Vector2): OverworldFurniture {
        const sprite = OverworldFurniture.createSprite(furniture, overworld, position)
        const owFurniture = new OverworldFurniture(furniture, sprite, overworld)
        overworld.furniture.push(owFurniture)
        sprite.on("pointerup", OverworldFurniture.onPointerUp(overworld, owFurniture))
        sprite.on("dragstart", OverworldFurniture.onDragStart(overworld, owFurniture))
        sprite.on("drag", OverworldFurniture.onDrag(overworld, owFurniture))
        sprite.on("dragend", OverworldFurniture.onDragEnd(overworld, owFurniture))
        return owFurniture
    }

    static createSprite (furniture: Furniture, overworld: Overworld, position: Phaser.Math.Vector2): Phaser.Physics.Arcade.Sprite {
        const i = parseInt(furniture.assetRef.match(/(\d+)/)![0])
        // Later check furniture collection and load from right sprite sheet
        const [sheet, index] = pixelTilesSpritesheetMap(i)
        const sprite = overworld.physics.add.sprite(position.x, position.y, sheet, index)
        //sprite.setSize(32, 16) /** Collision box size */
        //sprite.setOffset(10, 59) /** Collision box offset */
        sprite.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        overworld.input.setDraggable(sprite)
        overworld.physics.add.collider(sprite, overworld.walls)
        return sprite 
    }

    destroy() {
        this.sprite.destroy()
        this.overworld.furniture = this.overworld.furniture.filter(a => a.furniture.entityId !== this.furniture.entityId)
    }

    static onPointerUp = (overworld: Overworld, furniture: OverworldFurniture) => (pointer: Phaser.Input.Pointer) => {
        const now = Date.now()
        const isDoubleClick = now - furniture.lastClickTime < 300
        furniture.lastClickTime = now

        if (isDoubleClick) return furniture.destroy()
        if (pointer.getDuration() < 300) return furniture.sprite.flipX = !furniture.sprite.flipX
    }

    static onDragStart = (overworld: Overworld, furniture: OverworldFurniture) => () => {
        overworld.draggingItem = furniture 
    }

    static onDrag = (overworld: Overworld, furniture: OverworldFurniture) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        furniture.sprite.x = dragX
        furniture.sprite.y = dragY
    }

    static onDragEnd = (overworld: Overworld, furniture: OverworldFurniture) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        overworld.draggingItem = undefined
        furniture.updateLocationState()
    }

    get objectId() { return this.furniture.entityId }

    get depth() { return this.sprite.depth }

    set depth(depth: number) { 
        if (this.furniture.assetRef === "PixelTile62")
            this.sprite.depth = 9
        else 
            this.sprite.depth = depth 
    }

    get x() { return this.sprite.x }

    set x(x: number) { this.sprite.x = x }

    get y() { return this.sprite.y }

    set y(y: number) { this.sprite.y = y }

    updateLocationState() { OverworldTransitions.setObjectLocation(this.furniture, [this.x, this.y]) }
}

const pixelTilesSpritesheetMap = (pxNum: number): [string, number] => {
    switch (pxNum) {
        case 4: return ["pixel-tiles-tables", 0]
        case 5: return ["pixel-tiles-tables", 1]
        case 6: return ["pixel-tiles-tables", 2]
        case 7: return ["pixel-tiles-tables", 3]
        case 8: return ["pixel-tiles-tables", 0]
        case 9: return ["pixel-tiles-tables", 4]

        case 10: return ["pixel-tiles-hearths", 1]
        case 18: return ["pixel-tiles-hearths", 0]
        case 19: return ["pixel-tiles-hearths", 2]

        case 14: return ["pixel-tiles-bar-barrels", 0]
        case 15: return ["pixel-tiles-bar-barrels", 1]
        case 16: return ["pixel-tiles-bar-barrels", 2]
        case 17: return ["pixel-tiles-bar-barrels", 3]

        case 34: return ["pixel-tiles-bars", 0]
        case 35: return ["pixel-tiles-bars", 1]
        case 36: return ["pixel-tiles-bars", 2]
        case 37: return ["pixel-tiles-bars", 3]

        case 40: return ["pixel-tiles-simple-furniture", 0]
        case 30: return ["pixel-tiles-simple-furniture", 2]
        case 26: return ["pixel-tiles-simple-furniture", 3]
        case 39: return ["pixel-tiles-simple-furniture", 4]
        case 25: return ["pixel-tiles-simple-furniture", 5]
        case 38: return ["pixel-tiles-simple-furniture", 6]
        case 27: return ["pixel-tiles-simple-furniture", 7]
        case 28: return ["pixel-tiles-simple-furniture", 8]
        case 29: return ["pixel-tiles-simple-furniture", 9]
        case 20: return ["pixel-tiles-simple-furniture", 10]

        case 62: return ["pixel-tiles-rug", 0]

        default: return ["pixel-tiles-tables", 0]
    }
}

