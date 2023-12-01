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

        //Ferraz Input

        //Audio

        this.load.audio("ambient-sound","/maps/audio/river-sound2.mp3")

        //Animation Assets

        this.load.atlas("lake-assets", "/maps/lake_assets_name.png", "/maps/lake_assets_name_atlas.json")
        this.load.image('inn-roof', "/maps/inn-roof.png")
       // this.load.image("npc", "/maps/Enemy_Paladin.png")
        this.load.image("blue-bg", "/maps/BG-blueFall.png")
        this.load.image("bridge-side1", "/maps/bridge-side1.png")
        this.load.image("bridge-side2", "/maps/bridge-side2.png")
        this.load.image("cloud1", "/maps/cloud1.png")
        this.load.image("cloud2", "/maps/cloud2.png")
        this.load.image("dummies", "/maps/dummies.png")
        this.load.image("statue-dummy", "/maps/statue-dummy.png")
        this.load.image("tree-trunk", "/maps/tree-trunk.png")
        this.load.image("tree-yellow", "/maps/tree-yellow.png")
        //this.load.image("no_zone", "/maps/NO_Zone.png")

        
        

        // BG Images load

        this.load.image("layer0", "/maps/layer0Winter.png") 
        this.load.image("layer1", "/maps/layer1Winter.png")
        this.load.image("layer2", "/maps/layer2Winter.png")
        this.load.image("layer3", "/maps/layer3Winter.png")
        this.load.image("layer4", "/maps/layer4Winter.png")
        this.load.image("layer5", "/maps/layer5Winter.png")
        this.load.image("layer6", "/maps/layer6Winter.png")
        this.load.image("layer7", "/maps/layer7Winter.png")

        this.load.spritesheet("Hearth-fire", "/maps/furniture/pixel-tiles/FirePlaceSpriteSheet.png", {
            frameWidth: 64, 
            frameHeight: 64
        })
        
        // this.load.spritesheet("tree-sprite-sheet", "/maps/TreeSpritesheetFall.png", {
        //     frameWidth: 256, 
        //     frameHeight: 256
        // })

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