import Phaser from "phaser"
import { innBuildingTileSet } from "../assets"

export class Preloader extends Phaser.Scene {

    constructor() {
        super("Preloader")
    }

    preload() {
        //this.load.image("tiles", "/maps/inn-building.png")
        //this.load.image("gmas1", "https://cdn.ddu.gg/gmas/sprite-sheets-front/spritesheet-gmas-front_1.png")
        //this.load.tilemapTiledJSON("base-inn", "/maps/base-inn.json")

        //this.load.spritesheet("inn-building", "/maps/inn-building.png", {frameWidth: 32, frameHeight: 80})
        innBuildingTileSet.loadImage(this.load)

        for (let i = 1; i <= 100; i++) {
            this.load.spritesheet(`grandmaster-adventurers-front-${i}`, `/maps/adventurers/grandmaster-adventurers-front/spritesheet-gmas-front_${i}.png`, {
                frameWidth: 52,
                frameHeight: 75,
            })
        }

        this.load.spritesheet("pixel-tiles-adventurers-front", "/maps/adventurers/pixel-tiles-adventurers-front.png", {
            frameWidth: 32,
            frameHeight: 64,
        })
        this.load.spritesheet("adventurers-of-thiolden-front", "/maps/adventurers/adventurers-of-thiolden-front.png", {
            frameWidth: 64,
            frameHeight: 80,
        })
        this.load.spritesheet("adventurers-of-thiolden-big-front", "/maps/adventurers/adventurers-of-thiolden-big-front.png", {
            frameWidth: 96,
            frameHeight: 96,
        })

        this.load.spritesheet("pixel-tiles-bar-barrels", "/maps/furniture/pixel-tiles/bar-barrels.png", {
            frameWidth: 96,
            frameHeight: 64,
        }) 

        this.load.spritesheet("pixel-tiles-bars", "/maps/furniture/pixel-tiles/bars.png", {
            frameWidth: 96,
            frameHeight: 48,
        }) 

        this.load.spritesheet("pixel-tiles-hearths", "/maps/furniture/pixel-tiles/hearths.png", {
            frameWidth: 96,
            frameHeight: 128,
        }) 

        this.load.spritesheet("pixel-tiles-rug", "/maps/furniture/pixel-tiles/rug.png", {
            frameWidth: 96,
            frameHeight: 48,
        }) 

        this.load.spritesheet("pixel-tiles-simple-furniture", "/maps/furniture/pixel-tiles/simple-furniture.png", {
            frameWidth: 32,
            frameHeight: 64,
        }) 

        this.load.spritesheet("pixel-tiles-tables", "/maps/furniture/pixel-tiles/tables.png", {
            frameWidth: 64,
            frameHeight: 48,
        }) 

        this.load.image("inn-bg", "/maps/inn-bg-2.png")
    }

    create() {
        this.game.events.emit("loading-complete")
        this.scene.start("Overworld")
    }
}