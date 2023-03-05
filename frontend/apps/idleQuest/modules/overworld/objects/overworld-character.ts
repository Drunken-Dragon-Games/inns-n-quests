import { Character } from "../../../common";
import OverworldTransitions from "../overworld-transitions";
import { Overworld } from "../scenes/overworld";

export default class OverworldCharacter {

    public lastClickTime: number = 0

    constructor(
        public readonly adventurer: Character,
        public readonly sprite: Phaser.Physics.Arcade.Sprite,
        private readonly overworld: Overworld
    ){}

    static init (adventurer: Character, overworld: Overworld, position: Phaser.Math.Vector2): OverworldCharacter {
        const sprite = OverworldCharacter.createSprite(adventurer, overworld, position)
        const owAdventurer = new OverworldCharacter(adventurer, sprite, overworld)
        overworld.adventurers.push(owAdventurer)
        sprite.on("pointerup", OverworldCharacter.onPointerUp(overworld, owAdventurer))
        sprite.on("dragstart", OverworldCharacter.onDragStart(overworld, owAdventurer))
        sprite.on("drag", OverworldCharacter.onDrag(overworld, owAdventurer))
        sprite.on("dragend", OverworldCharacter.onDragEnd(overworld, owAdventurer))
        return owAdventurer
    }

    static createSprite (adventurer: Character, overworld: Overworld, position: Phaser.Math.Vector2): Phaser.Physics.Arcade.Sprite {
        const i = parseInt(adventurer.assetRef.match(/(\d+)/)![0])
        // Later check adventurer collection and load from right sprite sheet
        const sheet = 
            adventurer.collection === "grandmaster-adventurers" ? 
                "grandmaster-adventurers-front" :
            adventurer.collection === "adventurers-of-thiolden" && (adventurer.sprite.includes("dethiol") || adventurer.sprite.includes("ilinmyr")) ?
                "adventurers-of-thiolden-big-front" :
            adventurer.collection === "adventurers-of-thiolden" ?
                "adventurers-of-thiolden-front" :
            "pixel-tiles-adventurers-front"
        const index = 
            adventurer.collection === "grandmaster-adventurers" ? i-1 :
            adventurer.collection === "adventurers-of-thiolden" ? adventurerOfThioldenSpritesheetMap(adventurer.sprite)
            : pixelTilesSpritesheetMap(i)
        const sprite = overworld.physics.add.sprite(position.x, position.y, sheet, index)
        sprite.setSize(32, 16) /** Collision box size */
        sprite.setOffset(10, 59) /** Collision box offset */
        sprite.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        overworld.input.setDraggable(sprite)
        overworld.physics.add.collider(sprite, overworld.walls)
        return sprite 
    }

    destroy() {
        this.sprite.destroy()
        this.overworld.adventurers = this.overworld.adventurers.filter(a => a.adventurer.entityId !== this.adventurer.entityId)
    }

    static onPointerUp = (overworld: Overworld, adventurer: OverworldCharacter) => (pointer: Phaser.Input.Pointer) => {
        const now = Date.now()
        const isDoubleClick = now - adventurer.lastClickTime < 300
        adventurer.lastClickTime = now

        if (isDoubleClick) return adventurer.destroy()
        if (pointer.getDuration() < 300) return adventurer.sprite.flipX = !adventurer.sprite.flipX
    }

    static onDragStart = (overworld: Overworld, adventurer: OverworldCharacter) => () => {
        overworld.draggingItem = adventurer
    }

    static onDrag = (overworld: Overworld, adventurer: OverworldCharacter) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        adventurer.sprite.x = dragX
        adventurer.sprite.y = dragY
    }

    static onDragEnd = (overworld: Overworld, adventurer: OverworldCharacter) => (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        overworld.draggingItem = undefined
        adventurer.updateLocationState()
    }

    get objectId() { return this.adventurer.entityId }

    get depth() { return this.sprite.depth }

    set depth(depth: number) { this.sprite.depth = depth }

    get x() { return this.sprite.x }

    set x(x: number) { this.sprite.x = x }

    get y() { return this.sprite.y }

    set y(y: number) { this.sprite.y = y }

    updateLocationState() { OverworldTransitions.setObjectLocation(this.adventurer, [this.x, this.y]) }
}

const pixelTilesSpritesheetMap = (pxNum: number) => {
    switch (pxNum) {
        case 1: return 0
        case 2: return 1
        case 3: return 2
        case 11: return 3
        case 12: return 4
        case 13: return 5
        case 21: return 6
        case 22: return 7
        case 23: return 8
        case 24: return 9
        case 31: return 10
        case 32: return 11
        case 33: return 12
        case 41: return 13
        case 42: return 14
        case 43: return 15
        case 44: return 16
        case 45: return 17
        case 46: return 18
        case 47: return 19
        case 48: return 20
        case 49: return 21
        case 50: return 22
        case 51: return 23
        case 52: return 24
        case 53: return 25
        case 54: return 26
        case 55: return 27
        case 56: return 28
        case 57: return 29
        case 58: return 30
        case 59: return 31
        case 60: return 32
        case 61: return 33
        default: return 0
    }
}

const adventurerOfThioldenSpritesheetMap = (spriteName: string) => {
    const matchRes = spriteName.match(/.+\/x6\/(.+)-front-(chroma|plain)\.png/)!
    const name = matchRes[1]
    const chroma = matchRes[2] === "chroma"
    console.log(name)
    let index = 0
    switch (name) {
        case 'abbelka' : index = 0; break
        case 'aki' : index = 1; break
        case 'aragren' : index = 2; break
        case 'arin' : index = 3; break
        case 'arne' : index = 7; break
        case 'arunna' : index = 8; break
        case 'astrid' : index = 9; break
        case 'aumara' : index = 10; break
        case 'avva_fire' : index = 13; break
        case 'avva_ice' : index = 14; break
        case 'aztuneio' : index = 15; break
        case 'bo' : index = 19; break
        case 'bodica' : index = 16; break
        case 'delthamar' : index = 20; break
        case 'dethiol' : index = 0; break
        case 'drignir' : index = 4; break
        case 'eify' : index = 11; break
        case 'ferra' : index = 17; break
        case 'filgrald' : index = 27; break
        case 'fjolnaer' : index = 21; break
        case 'friga' : index = 22; break
        case 'gadrull' : index = 23; break
        case 'gulnim' : index = 25; break
        case 'haakon' : index = 26; break
        case 'hilana' : index = 30; break
        case 'ilinmyr' : index = 1; break
        case 'kilia' : index = 31; break
        case 'lyskyr' : index = 28; break
        case 'mare' : index = 32; break
        case 'marendil' : index = 33; break
        case 'marlanye' : index = 5; break
        case 'mey' : index = 12; break
        case 'mili' : index = 18; break
        case 'milnim' : index = 24; break
        case 'naya' : index = 34; break
        case 'othil' : index = 35; break
        case 'perneli' : index = 36; break
        case 'rando' : index = 29; break
        case 'rei' : index = 37; break
        case 'rundir' : index = 38; break
        case 'shaden' : index = 39; break
        case 'syonir' : index = 42; break
        case 'terrorhertz' : index = 43; break
        case 'thelas' : index = 44; break
        case 'tyr' : index = 40; break
        case 'udenamvar' : index = 45; break
        case 'ulf' : index = 41; break
        case 'vadanna' : index = 6; break
        case 'vale' : index = 46; break
        case 'vimtyr' : index = 48; break
        case 'volggan' : index = 47; break
    }
    return chroma ? index * 2 : index * 2 + 1
}
