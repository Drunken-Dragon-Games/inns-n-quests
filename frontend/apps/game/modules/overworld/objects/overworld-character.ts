import { Character } from "../../../../common";
import OverworldTransitions from "../overworld-transitions";
import { Overworld } from "../scenes/overworld";
import OverworldObject from "./overworld-object";

/**
 * Handles the creation, positioning, and interaction of character sprites in the Overworld
 */
export default class OverworldCharacter extends OverworldObject<Character> {

    public lastClickTime: number = 0

    constructor(
        public readonly character: Character,
        public readonly sprites: Phaser.Physics.Arcade.Sprite[],
        public readonly overworld: Overworld,
    ){
        super(character, sprites, overworld, "3d-object", true)
    }

    static init(character: Character, overworld: Overworld, position: Phaser.Math.Vector2, flipped: boolean): OverworldCharacter {
        const sprites = OverworldCharacter.buildSprites(character, overworld, position)
        const owAdventurer = new OverworldCharacter(character, sprites, overworld)
        owAdventurer.flip = flipped
        overworld.adventurers.push(owAdventurer)
        return owAdventurer
    }

    static buildSprites(character: Character, overworld: Overworld, position: Phaser.Math.Vector2): Phaser.Physics.Arcade.Sprite[] {
        const i = parseInt(character.assetRef.match(/(\d+)/)![0])
        // Later check character collection and load from right sprite sheet
        const sheet = 
            character.collection === "grandmaster-adventurers" ? 
                `grandmaster-adventurers-front-${Math.floor((i - 1) / 100) + 1}` :
            character.collection === "adventurers-of-thiolden" && (character.sprite.includes("dethiol") || character.sprite.includes("ilinmyr")) ?
                "adventurers-of-thiolden-big-front" :
            character.collection === "adventurers-of-thiolden" ?
                "adventurers-of-thiolden-front" :
            "pixel-tiles-adventurers-front"
        const index = 
            character.collection === "grandmaster-adventurers" ? (i - 1) % 100 :
            character.collection === "adventurers-of-thiolden" ? adventurerOfThioldenSpritesheetMap(character.sprite)
            : pixelTilesSpritesheetMap(i)
        const sprite = overworld.physics.add.sprite(position.x, position.y, sheet, index)

        sprite.setSize(32, 16) /** Collision box size */
        if (character.collection === "grandmaster-adventurers")
            sprite.setOffset(10, 59) /** Collision box offset */
        else if (character.collection === "adventurers-of-thiolden" && (character.sprite.includes("dethiol") || character.sprite.includes("ilinmyr"))) 
            sprite.setOffset(41, 80) /** Collision box offset */
        else if (character.collection === "adventurers-of-thiolden")
            sprite.setOffset(16, 64) /** Collision box offset */
        else if (character.collection === "pixel-tiles")
            sprite.setOffset(0, 48) /** Collision box offset */

        sprite.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        overworld.input.setDraggable(sprite)
        overworld.physics.add.collider(sprite, overworld.walls)
        //here we set the sprite direction
        return [sprite]
    }

    get objectId() { return this.character.entityId }

    destroy() {
        this.sprites.forEach(sprite => sprite.destroy())
        this.overworld.adventurers = this.overworld.adventurers.filter(a => a.character.entityId !== this.character.entityId)
        OverworldTransitions.removeObject(this.character)
    }

    updateLocationState() { OverworldTransitions.setObjectLocation(this.character, [this.x, this.y], this.flip) }

    update(time: number, delta: number): void {
        super.update(time, delta)
    }
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
// Logic


