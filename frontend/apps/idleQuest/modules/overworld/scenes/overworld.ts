import Phaser from "phaser"
import { idleQuestsStore } from "../../../idle-quests-state"
import { innBuildingRenderMatrix } from "../assets"

type KInputs = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    Space: Phaser.Input.Keyboard.Key,
}

export class Overworld extends Phaser.Scene {
    
    walls!: Phaser.GameObjects.Sprite[]
    adventurers: Phaser.GameObjects.Sprite[] = []
    inputs!: KInputs
    cameraControls!: Phaser.Cameras.Controls.SmoothedKeyControl
    draggingDirection?: {
        dragPosition: [number, number]
        lastPosition?: [number, number]
        dragging: boolean
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
        const cameraControl = this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl({
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
        this.cameras.main.setBounds(0, 0, 1577, 1300, true)
        this.cameras.main.scrollX = this.cameras.main.scrollX - 190
        //this.game.events.emit("progress", 1)
    }

    create() {

        this.add.image(0, 0, "inn-bg").setOrigin(0, 0)

        const innOrigin: [number, number] = [350, 485]
        innBuildingRenderMatrix[0].render(this, innOrigin)
        this.walls = innBuildingRenderMatrix[1].render(this, innOrigin)

        const adventurersGroup = this.physics.add.group()

        for (let i = 0; i < 2; i++) {
            const adventurer = this.physics.add.sprite(30 + i * 100, 100, "gmas1", i)
            adventurer.setSize(32,16)
            adventurer.setOffset(10, 59)
            adventurer.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
            //this.input.setDraggable(adventurer)
            this.physics.add.collider(adventurer, this.walls)
            this.adventurers.push(adventurer)

            adventurer.on("pointerin", () => {
                console.log("pointerin")
            })
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
            console.log(gameObject.body.embedded)
            this.draggingDirection = {
                obj: gameObject,
                dragPosition: [dragX, dragY],
                dragging: true,
            }
        });


    }

    update(time: number, delta: number): void {
        this.adventurers.forEach(adventurer => {
            adventurer.depth = adventurer.y + 10
        })
        this.walls.forEach(wall => {
            wall.depth = wall.y + 10
        })
        this.cameraControls.update(delta)

        if (this.draggingDirection) {
            //console.log(this.draggingDirection.obj.body.embedded)

            if (!this.draggingDirection.dragging) {
                this.draggingDirection.obj.setVelocity(0, 0)
                this.draggingDirection == undefined
            }
            else {
                const speed = 500
                const speedX = setSpeed(speed, (this.draggingDirection.dragPosition[0] - this.draggingDirection.obj.x))
                const speedY = setSpeed(speed, (this.draggingDirection.dragPosition[1] - this.draggingDirection.obj.y))
                if (!this.draggingDirection.dragging)//Math.abs(speedX) > limit || Math.abs(speedY) > limit)
                    this.draggingDirection.obj.setVelocity(0, 0)
                else 
                    this.draggingDirection.obj.setVelocity(speedX, speedY)
                this.draggingDirection.dragging = false
            }
            
            //this.draggingDirection.lastPosition = [this.draggingDirection.obj.x, this.draggingDirection.obj.y]
            //this.draggingDirection.obj.x = this.draggingDirection.dragPosition[0]
            //this.draggingDirection.obj.y = this.draggingDirection.dragPosition[1]
            //this.draggingDirection == undefined
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

    old() {
        //const map = this.make.tilemap({ key: "base-inn" })
        //const tileSet = map.addTilesetImage("taver-building", "tiles")
        //map.createLayer("Floor", tileSet, 0, 0)
        //this.walls = map.createLayer("Walls", tileSet, 0, 0)
        //this.walls.setCollisionByProperty({ collides: true })

        for (let i = 0; i < 2; i++) {
            const adventurer = this.physics.add.sprite(300 + i * 10, 200, "gmas1", i)
            adventurer.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
            //this.input.setDraggable(adventurer)
            this.physics.add.collider(adventurer, this.walls)
            this.adventurers.push(adventurer)

            adventurer.on("pointerin", () => {
                console.log("pointerin")
            })
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
            console.log(gameObject.body.embedded)
            gameObject.x = dragX
            gameObject.y = dragY
            /*
            this.draggingDirection = {
                obj: gameObject,
                dragPosition: [dragX, dragY],
                dragging: true,
            }
            */
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
}

function setSpeed(speed: number, delta: number): number {
    if (delta > 0) return Math.min(speed, delta * 10)
    else if (delta < 0) return Math.max(-speed, delta * 10)
    else return 0
}