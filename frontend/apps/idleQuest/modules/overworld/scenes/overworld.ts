import Phaser from "phaser"
import { Adventurer } from "../../../common"
import { innBuildingRenderMatrix } from "../assets"

type KInputs = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    Space: Phaser.Input.Keyboard.Key,
}

export class Overworld extends Phaser.Scene {
    
    origDragPoint?: Phaser.Math.Vector2

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

    draggingItem?: Phaser.Physics.Arcade.Sprite

    subscribeDraggingItem() {
        this.game.events.on("dragging-item", (item: Adventurer, position: [number, number]) => {
            const camera = this.cameras.main
            const overworldPosition = new Phaser.Math.Vector2(
                (position[0] * camera.scaleManager.displayScale.x / camera.zoom + camera.worldView.left), 
                (position[1] * camera.scaleManager.displayScale.y / camera.zoom + camera.worldView.top)
            )
            if (this.draggingItem) {
                const sprite = this.draggingItem
                sprite.x = overworldPosition.x
                sprite.y = overworldPosition.y
            }
            else {
                const sprite = this.createAdventurer(item.assetRef, overworldPosition.x, overworldPosition.y)
                this.draggingItem = sprite
            }
        })
    }

    // 370 + i * 50, 600
    createAdventurer(assetRef: string, x: number, y: number): Phaser.Physics.Arcade.Sprite {
        // match regexp "(GrandmasterAdventurer|AdventurerOfThiolden|PixelTile)(\d+)" and extract the digits.
        const i = parseInt(assetRef.match(/\d+/)![0])
        const adventurer = this.physics.add.sprite(x, y, "gmas1", i-1)
        adventurer.setSize(32, 16)
        adventurer.setOffset(10, 59)
        adventurer.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true })
        this.input.setDraggable(adventurer)
        this.physics.add.collider(adventurer, this.walls)
        this.adventurers.push(adventurer)
        adventurer.on("dragstart", () => {
            this.draggingItem = adventurer
        })
        adventurer.on("drag", (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            adventurer.x = dragX
            adventurer.y = dragY
        })
        adventurer.on("dragend", (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.draggingItem = undefined
        })
        return adventurer
    }

    preload() {
        this.subscribeDraggingItem()
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

        for (let i = 0; i < 1; i++) {
            this.createAdventurer("GrandmasterAdventurer36", 370 + i * 50, 600)
            /*
            adventurer.on("pointerin", () => {
                console.log("pointerin")
            })
            adventurer.on("pointerdown", () => {
                this.activeCollides = { obj: adventurer, collides: false }})
            adventurer.on("pointerup", () => {
                this.activeCollides = undefined })
            */
        }

        this.inputs.Space.on("down", () => {
            console.log("space")
        })

        // @ts-ignore
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.cameras.main.setZoom(deltaY > 0 ? 1 : 2)
        })

        // @ts-ignore
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
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

        /*
        if (this.draggingDirection) {

            if (!this.draggingDirection.dragging) {
                this.draggingDirection.obj.setVelocity(0, 0)
                this.draggingDirection = undefined
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
        else 
        */
        if (this.game.input.activePointer.isDown && !this.draggingItem) {
            if (this.origDragPoint) {
                // move the camera by the amount the mouse has moved since last update		
                this.cameras.main.scrollX += this.origDragPoint.x - this.game.input.activePointer.position.x
                this.cameras.main.scrollY += this.origDragPoint.y - this.game.input.activePointer.position.y
            }
            // set new drag origin to current position	
            this.origDragPoint = this.game.input.activePointer.position.clone()
        } else {
            this.origDragPoint = undefined
        }
    }
}

function setSpeed(speed: number, delta: number): number {
    if (delta > 0) return Math.min(speed, delta * 10)
    else if (delta < 0) return Math.max(-speed, delta * 10)
    else return 0
}