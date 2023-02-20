import Phaser from "phaser"

export class Preloader extends Phaser.Scene {

    constructor() {
        super("Preloader")
    }

    preload() {
        this.load.image("tiles", "maps/inn-building.png")
        //this.load.image("gmas1", "https://cdn.ddu.gg/gmas/sprite-sheets-front/spritesheet-gmas-front_1.png")
        this.load.tilemapTiledJSON("base-inn", "maps/base-inn.json")
        this.load.spritesheet("gmas1", "maps/spritesheet-gmas-front_1.png", {
            frameWidth: 52,
            frameHeight: 75,
        })
    }

    create() {
        this.scene.start("Overworld")
    }
}