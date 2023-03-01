import { Adventurer } from "../../../common";
import { Overworld } from "../scenes/overworld";

export default class OverworldAdventurer {

    public lastClickTime: number = 0

    constructor(
        public readonly adventurer: Adventurer,
        public readonly sprite: Phaser.Physics.Arcade.Sprite,
        private readonly overworld: Overworld
    ){}

    static init (adventurer: Adventurer, overworld: Overworld, position: Phaser.Math.Vector2): OverworldAdventurer {
        const sprite = OverworldAdventurer.createSprite(adventurer, overworld, position)
        const owAdventurer = new OverworldAdventurer(adventurer, sprite, overworld)
        overworld.adventurers.push(owAdventurer)
        sprite.on("pointerup", OverworldAdventurer.onPointerUp(overworld, owAdventurer))
        sprite.on("dragstart", OverworldAdventurer.onDragStart(overworld, owAdventurer))
        sprite.on("drag", OverworldAdventurer.onDrag(overworld, owAdventurer))
        sprite.on("dragend", OverworldAdventurer.onDragEnd(overworld, owAdventurer))
        return owAdventurer
    }

    static createSprite (adventurer: Adventurer, overworld: Overworld, position: Phaser.Math.Vector2): Phaser.Physics.Arcade.Sprite {
        const i = parseInt(adventurer.assetRef.match(/(\d+)/)![0])
        // Later check adventurer collection and load from right sprite sheet
        const sprite = overworld.physics.add.sprite(position.x, position.y, "gmas1", i-1)
        sprite.setSize(32, 16) /** Collision box size */
        sprite.setOffset(10, 59) /** Collision box offset */
        sprite.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        overworld.input.setDraggable(sprite)
        overworld.physics.add.collider(sprite, overworld.walls)
        return sprite 
    }

    destroy() {
        this.sprite.destroy()
        this.overworld.adventurers = this.overworld.adventurers.filter(a => a.adventurer.adventurerId !== this.adventurer.adventurerId)
    }

    static onPointerUp = (overworld: Overworld, adventurer: OverworldAdventurer) => (pointer: Phaser.Input.Pointer) => {
        const now = Date.now()
        const isDoubleClick = now - adventurer.lastClickTime < 500
        adventurer.lastClickTime = now

        if (isDoubleClick) return adventurer.destroy()
        if (pointer.getDuration() < 200) return adventurer.sprite.flipX = !adventurer.sprite.flipX
    }

    static onDragStart = (overworld: Overworld, adventurer: OverworldAdventurer) => () => {
        overworld.draggingItem = adventurer
    }

    static onDrag = (overworld: Overworld, adventurer: OverworldAdventurer) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        adventurer.sprite.x = dragX
        adventurer.sprite.y = dragY
    }

    static onDragEnd = (overworld: Overworld, adventurer: OverworldAdventurer) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        overworld.draggingItem = undefined
    }

    get depth() { return this.sprite.depth }

    set depth(depth: number) { this.sprite.depth = depth }

    get x() { return this.sprite.x }

    set x(x: number) { this.sprite.x = x }

    get y() { return this.sprite.y }

    set y(y: number) { this.sprite.y = y }
}