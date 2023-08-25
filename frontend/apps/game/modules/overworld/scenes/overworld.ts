import Phaser from "phaser"
import { Character, Furniture } from "../../../../common"
import { innBuildingRenderMatrix } from "../assets"
import OverworldCharacter from "../objects/overworld-character"
import OverworldFurniture from "../objects/overworld-furniture"
import { overworldStore } from "../overworld-state"
import OverworldTransitions from "../overworld-transitions"
import { any } from "underscore"

type KInputs = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    Space: Phaser.Input.Keyboard.Key,
}

export class Overworld extends Phaser.Scene {
    
    /** Objects */
    walls!: Phaser.GameObjects.Sprite[]
    adventurers: OverworldCharacter[] = []
    furniture: OverworldFurniture[]= []
    draggingItem?: OverworldCharacter | OverworldFurniture
    
    /** Controls */
    inputs!: KInputs
    cameraControls!: Phaser.Cameras.Controls.SmoothedKeyControl
    origDragPoint?: Phaser.Math.Vector2

    /**Animation */
    //BGSspriteSheet: any
    charsTime:0 | undefined
    tree1: Phaser.GameObjects.Sprite | undefined
    nenufar1 : Phaser.GameObjects.Image | undefined
    nenufar2 : Phaser.GameObjects.Image | undefined
    nenufar3 : Phaser.GameObjects.Image | undefined
    nenufar4 : Phaser.GameObjects.Image | undefined
    nenufar5 : Phaser.GameObjects.Image | undefined

    constructor() { super("Overworld")

        this.tree1 = undefined
    }

    subscribeDraggingItemFromInventory() {
        this.game.events.on("dragging-item-from-inventory", (item: Character | Furniture, position?: [number, number]) => {
            const camera = this.cameras.main
            if (!position) {
                this.draggingItem?.updateLocationState()
                this.draggingItem = undefined
                return 
            }
            const overworldPosition = new Phaser.Math.Vector2(
                (position[0] * camera.scaleManager.displayScale.x / camera.zoom + camera.worldView.left), 
                (position[1] * camera.scaleManager.displayScale.y / camera.zoom + camera.worldView.top)
            )
            if (this.draggingItem) {
                this.draggingItem.x = overworldPosition.x
                this.draggingItem.y = overworldPosition.y
            }
            else {
                if (item.ctype === "character")
                    this.draggingItem = 
                        this.adventurers.filter(adventurer => adventurer.character.entityId === item.entityId)[0] ||
                        OverworldCharacter.init(item, this, overworldPosition, false)
                else if (item.ctype === "furniture")
                    this.draggingItem = 
                        this.furniture.filter(furniture => furniture.furniture.entityId === item.entityId)[0] ||
                        OverworldFurniture.init(item, this, overworldPosition, false)
            }
        })
    }

    subscribeCancelDraggingItemFromInventory() {
        this.game.events.on("cancel-dragging-item-from-inventory", () => {
            if (this.draggingItem) {
                this.draggingItem.destroy()
                this.draggingItem = undefined
                
            }
        })
    }

    setInitialInnState() {
        const state = overworldStore.getState()
        const innConfiguration = state.innConfiguration
        if (innConfiguration) {
            this.adventurers.forEach(adventurer => adventurer.destroy())
            this.furniture.forEach(furniture => furniture.destroy())
            Object.values(innConfiguration).forEach(({ obj, location, flipped }) => {
                // It seems that the OverworldCharacter.init method already adds the entity to the respective array internally.
                // Is there a reason for pushing the result to the adventurers array again here?
                if (obj.ctype === "character")
                    OverworldCharacter.init(obj, this, new Phaser.Math.Vector2(location[0], location[1]), flipped)
                else if (obj.ctype === "furniture")
                    OverworldFurniture.init(obj, this, new Phaser.Math.Vector2(location[0], location[1]), flipped)
            })
        }
        OverworldTransitions.trackOverworldState()
    }

    preload() {
        
        this.subscribeDraggingItemFromInventory()
        this.subscribeCancelDraggingItemFromInventory()
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
            acceleration: 5,
            drag: 1,
            zoomSpeed: 1,
            maxSpeed: 0.35,
            minZoom: 1,
            maxZoom: 2.0
            
        })
        this.cameras.main.setBounds(0, 0, 1577, 1300, true)
        this.cameras.main.scrollX = this.cameras.main.scrollX - 190
    }

    create() {
        this.add.image(0, 0, "inn-bg").setOrigin(0, 0)
        
        
        const innOrigin: [number, number] = [350, 485]
        const [floor, walls] = innBuildingRenderMatrix
        floor.render(this, innOrigin)
        this.walls = walls.render(this, innOrigin)

        //Animations

        this.anims.create({
            key: "tree-sprite-anim",
            frames : this.anims.generateFrameNumbers("tree-sprite-sheet", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
         })
        this.anims.create({
            key: "BGSpritesheet_anim",
            frames : this.anims.generateFrameNumbers("BGSpritesheet", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
         })
        const BGSspriteSheet = this.add.sprite(789, 650, "BGSpritesheet");
        BGSspriteSheet.play("BGSpritesheet_anim");
        this.tree1 = this.add.sprite(830,240,"tree-sprite-sheet")
        this.tree1?.play("tree-sprite-anim")
        const tree2 = this.add.sprite(215,835,"tree-sprite-sheet" )
        const tree3 = this.add.sprite(0,635,"tree-sprite-sheet" )
        const tree4 = this.add.sprite(390,150,"tree-sprite-sheet" )
        tree2.play("tree-sprite-anim")
        tree3.play("tree-sprite-anim")
        tree4.play("tree-sprite-anim")


        //Inn-Roof
        const innRoof = this.add.sprite(789, 650, 'inn-roof')
        innRoof.setDepth(9999)
        innRoof.setPosition(634, 530)
        innRoof.setVisible(false)

        this.nenufar1 = this.add.image(633,1030, "lake-assets","layer_2")
        this.nenufar2 = this.add.image(633,1030, "lake-assets","layer_1")
        this.nenufar3 = this.add.image(738,1030, "lake-assets","layer_3")
        this.nenufar4 = this.add.image(819,1030, "lake-assets","layer_4")
        this.nenufar5 = this.add.image(660,1030, "lake-assets","layer_5")
        
        

        // @ts-ignore
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.cameras.main.setZoom(deltaY > 0 ? Math.max(this.cameras.main.zoom - 1, .75) :  Math.min(this.cameras.main.zoom + 1, 2) )
            if(this.cameras.main.zoom > 1){
                console.log("zoomed in")
                
                innRoof.setVisible(false)
            }else{
                innRoof.setVisible(true)
            }
    })
        // Timer
        const timer = this.time.addEvent({
            delay: 500,
            callback: any,
            callbackScope: this,
            loop : true
        })

        
        this.setInitialInnState()
    }

    update(time: number, delta: number): void {
        this.adventurers.forEach(adventurer => adventurer.setDepth())
        this.furniture.forEach(furniture => furniture.setDepth())
        //this.walls.forEach(wall => wall.depth = wall.y + 10)
        this.cameraControls.update(delta)

        // Use math sin function to create a wave
        const valY = Math.sin(time / 200) * 0.5
        const valY2 = Math.cos(time / 200) * 0.5
        //move nenufar up and down
        this.nenufar1!.y = valY + 1008
        this.nenufar2!.y = valY2 + 1041
        this.nenufar3!.y = valY + 1033
        this.nenufar4!.y = valY2 + 919
        this.nenufar5!.y = valY2 + 963
        

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
