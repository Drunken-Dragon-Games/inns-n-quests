import OverworldTransitions from "../overworld-transitions";
import { Overworld } from "../scenes/overworld";

export interface OverworldObjectI<P extends {}> {
    readonly data: P
    readonly sprites: Phaser.Physics.Arcade.Sprite[]
    readonly overworld: Overworld
    readonly objectType: "floor-object" | "3d-object"
    readonly userDraggable: boolean
    get draggable(): boolean
    get depth(): number
    setDepth(): void
    get x(): number
    set x(x: number)
    get y(): number
    set y(y: number)
    get flip(): boolean
    set flip(flipped: boolean)
    destroy(): void
    updateLocationState(): void
    update(time: number, delta: number): void
}

export default class OverworldObject<P extends {}> implements OverworldObjectI<P>  {

    public lastClickTime: number = 0

    constructor( 
        public readonly data: P,
        public readonly sprites: Phaser.Physics.Arcade.Sprite[],
        public readonly overworld: Overworld,
        public readonly objectType: "floor-object" | "3d-object",
        /** If the user can normally move this object. But the draggable property should be used over this. */
        public readonly userDraggable: boolean,
    ) {
        if (this.draggable) {
            this.sprites.forEach(sprite => {
                sprite.on("pointerup", this.onDragPointerUp)
                sprite.on("dragstart", this.onDragStart)
                sprite.on("drag", this.onDrag)
                sprite.on("dragend", this.onDragEnd)
            })
        }
        this.setDepth()
    }

    public get draggable() { return this.userDraggable && OverworldTransitions.getParams().paramDraggableItems }

    get depth() { return this.sprites[0].depth }

    setDepth() {
        if (this.objectType == "3d-object") {
            const baseSprite = this.sprites[0]
            baseSprite.depth = (baseSprite.y + baseSprite.height / 2) + 10 // 10 is the objects lowe bound
            this.sprites.forEach((sprite, index) => {
                if (index === 0) return
                sprite.depth = baseSprite.depth + index
            })
        } else if (this.objectType == "floor-object")
            this.sprites[0].depth = 9
    }

    get x() { return this.sprites[0].x }

    set x(x: number) { 
        const baseSprite = this.sprites[0]
        const baseSpriteX = baseSprite.x
        this.sprites.forEach(sprite => {
            const delta = sprite.x - baseSpriteX
            sprite.x = x + delta
        }) 
    }

    get y() { return this.sprites[0].y }

    set y(y: number) { 
        const baseSprite = this.sprites[0]
        const baseSpriteY = baseSprite.y
        this.sprites.forEach(sprite => {
            const delta = sprite.y - baseSpriteY
            sprite.y = y + delta
        }) 
    }

    get flip() { return this.sprites[0].flipX }

    set flip(flipped: boolean) { this.sprites.forEach(sprite => sprite.flipX = flipped) }

    destroy() {}

    updateLocationState(): void {}

    update(time: number, delta: number): void { this.setDepth() }

    private onDragPointerUp = (pointer: Phaser.Input.Pointer) => {
        const now = Date.now()
        const isDoubleClick = now - this.lastClickTime < 300
        this.lastClickTime = now

        if (isDoubleClick) return this.destroy()
        if (pointer.getDuration() < 300) {
            this.sprites.forEach(sprite => sprite.flipX = !sprite.flipX)
            this.updateLocationState()
            return
        }
    }
    private onDragStart = () => { this.overworld.draggingObject = this }
    private onDrag = (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => { this.x = dragX; this.y = dragY }
    private onDragEnd = (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => { this.overworld.draggingObject = undefined; this.updateLocationState() }
}