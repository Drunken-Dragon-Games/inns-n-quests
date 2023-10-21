import { Furniture } from "../../../../common";
import OverworldTransitions from "../overworld-transitions";
import { Overworld } from "../scenes/overworld";
import OverworldObject from "./overworld-object";

export default class OverworldFurniture extends OverworldObject<Furniture>  {

    public lastClickTime: number = 0

    constructor( 
        public readonly furniture: Furniture,
        public readonly sprites: Phaser.Physics.Arcade.Sprite[],
        public readonly overworld: Overworld,
    ){
        const objectType = furniture.assetRef == "PixelTile62" ? "floor-object" : "3d-object"
        super(furniture, sprites, overworld, objectType, true)
    }

    static init(furniture: Furniture, overworld: Overworld, position: Phaser.Math.Vector2, flipped: boolean = false): OverworldFurniture {
        const spriteComposite = OverworldFurniture.buildSprites(furniture, overworld, position)
        const owFurniture = new OverworldFurniture(furniture, spriteComposite, overworld)
        owFurniture.flip = flipped
        overworld.furniture.push(owFurniture)
        return owFurniture
    }

    static buildSprites(furniture: Furniture, overworld: Overworld, position: Phaser.Math.Vector2): Phaser.Physics.Arcade.Sprite[] {
        const spriteComposite: Phaser.Physics.Arcade.Sprite[] = []

        const i = parseInt(furniture.assetRef.match(/(\d+)/)![0])
        // Later check furniture collection and load from right sprite sheet
        const { sheet, index, size, offset } = pixelTilesSpritesheetMap(i)
        const baseSprite = overworld.physics.add.sprite(position.x, position.y, sheet, index)
        const animationSprite = overworld.physics.add.sprite(baseSprite.x, baseSprite.y+42, sheet, index)
        baseSprite.setSize(size[0], size[1]) /** Collision box size */
        baseSprite.setOffset(offset[0], offset[1]) /** Collision box offset */
        baseSprite.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        overworld.input.setDraggable(baseSprite)
        overworld.physics.add.collider(baseSprite, overworld.walls)
        spriteComposite.push(baseSprite)

        // If a furniture has a fire, create animation
        if(furniture.assetRef=="PixelTile18"||furniture.assetRef=="PixelTile19"){
            
            animationSprite.anims.create({key: "PixelTile18_anim",
            frames : baseSprite.anims.generateFrameNumbers("Hearth-fire", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1})
            
            animationSprite.play("PixelTile18_anim")
            animationSprite.x = baseSprite.x
            animationSprite.y = baseSprite.y+42

            spriteComposite.push(animationSprite)

        } else if (furniture.assetRef=="PixelTile5") {

        } else if (furniture.assetRef=="PixelTile6") {

        }

        return spriteComposite
    }
    
    get objectId() { return this.furniture.entityId }

    destroy() {
        this.sprites.forEach(sprite => sprite.destroy())
        this.overworld.furniture = this.overworld.furniture.filter(a => a.furniture.entityId !== this.furniture.entityId)
        OverworldTransitions.removeObject(this.furniture)
    }

    updateLocationState() {
        OverworldTransitions.setObjectLocation(this.furniture, [this.x, this.y], this.flip)
    }

    update(time: number, delta: number): void {
        super.update(time, delta)
    }
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

