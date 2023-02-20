import Phaser from "phaser"
import { idleQuestsStore } from "../../../idle-quests-state"

type KInputs = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    Space: Phaser.Input.Keyboard.Key,
}

export class Overworld extends Phaser.Scene {
    
    walls!: Phaser.Tilemaps.TilemapLayer
    adventurers: Phaser.GameObjects.Sprite[] = []
    inputs!: KInputs
    cameraControls!: Phaser.Cameras.Controls.SmoothedKeyControl
    draggingDirection?: {
        x: number,
        y: number,
        active: boolean,
        obj: Phaser.Physics.Arcade.Sprite
    }


    constructor(
        //public readonly tilesSet: TileSet<Tid>
    ) {
        super("Overworld")
    }

    preload() {
        this.inputs = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            Space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        }
        this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
            left: this.inputs.A,
            right: this.inputs.D,
            up: this.inputs.W,
            down: this.inputs.S,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 1,
            drag: 1,
            zoomSpeed: 1,
            maxSpeed: 0.35,
            minZoom: 1,
            maxZoom: 2.0
        })
        //this.game.events.emit("progress", 1)
    }

    create() {

        const map = this.make.tilemap({ key: "base-inn" })
        const tileSet = map.addTilesetImage("taver-building", "tiles")
        map.createLayer("Floor", tileSet, 0, 0)
        this.walls = map.createLayer("Walls", tileSet, 0, 0)
        this.walls.setCollisionByProperty({ collides: true })

        const group = this.add.group()
        group.add(this.walls)

        for (let i = 0; i < 1; i++) {
            const adventurer = this.physics.add.sprite(300, 200, "gmas1", i)
            adventurer.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
            //this.input.setDraggable(adventurer)
            this.physics.add.collider(adventurer, this.walls)
            this.physics.add.overlap(adventurer, this.walls)
            this.adventurers.push(adventurer)
            /*
            adventurer.on("pointerdown", () => {
                this.activeCollides = { obj: adventurer, collides: false }})
            adventurer.on("pointerup", () => {
                this.activeCollides = undefined })
            */
        }

        this.inputs.Space.on("down", () => {
            console.log("space")
        })


        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            this.draggingDirection = {
                obj: gameObject,
                x: dragX,
                y: dragY,
                active: true,
            }
        });

        /*
        const gridEngineConfig = {
            characters: [
                {
                    id: "adventurer",
                    sprite: adventurer,
                    walkingAnimationMapping: 0,
                    startPosition: { x: 10, y: 12 },
                }
            ]
        }

        this.gridEngine.create(map, gridEngineConfig)
        */


        //const map = this.make.tilemap({ key: "overworld" })
        //this.tilesSet.set.forEach(({  }) => map.addTilesetImage(tileId, tileId))
        //const tileset = map.addTilesetImage("tiles", "tiles")
        //const layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0)
    }

    update(time: number, delta: number): void {
        this.adventurers.forEach(adventurer => {
            adventurer.depth = adventurer.y + 10
        })
        this.cameraControls.update(delta)

        if (this.draggingDirection) {
            const speed = 1
            const speedX = this.draggingDirection.x - this.draggingDirection.obj.x
            const speedY = this.draggingDirection.y - this.draggingDirection.obj.y
            this.draggingDirection.obj.setVelocity(speedX, speedY)
            this.draggingDirection == undefined
        }
        //console.log(time * delta)
        //onsole.log("update")
        //adventurer.setPosition(this.adventurer.x + 1, this.adventurer.y + 1)
        //console.log(idleQuestsStore.getState().questBoard.availableQuests[0])
        /*
        } else if (cursors.right.isDown) {
        } else if (cursors.up.isDown) {
        } else if (cursors.down.isDown) {
        }
        */
    }
}