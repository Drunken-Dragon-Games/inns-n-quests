import Phaser from "phaser"
import { Character, Furniture } from "../../../../common"
import { innBuildingRenderMatrix } from "../assets"
import OverworldCharacter from "../objects/overworld-character"
import OverworldFurniture from "../objects/overworld-furniture"
import { overworldStore } from "../overworld-state"
import OverworldTransitions from "../overworld-transitions"
import OverworldObject from "../objects/overworld-object"

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
    draggingObject?: OverworldObject<any>
    
    /** Controls */
    inputs!: KInputs
    cameraControls!: Phaser.Cameras.Controls.SmoothedKeyControl
    origDragPoint?: Phaser.Math.Vector2

    /**Animation */
    //BGSspriteSheet: any
    charsTime:0 | undefined
    hearth: Phaser.GameObjects.Sprite | undefined
    tree1: Phaser.GameObjects.Sprite | undefined
    nenufar1 : Phaser.GameObjects.Image | undefined
    nenufar2 : Phaser.GameObjects.Image | undefined
    nenufar3 : Phaser.GameObjects.Image | undefined
    nenufar4 : Phaser.GameObjects.Image | undefined
    nenufar5 : Phaser.GameObjects.Image | undefined
    bgBlue: Phaser.GameObjects.Sprite | undefined
    cloud1: Phaser.GameObjects.Sprite | undefined
    cloud2: Phaser.GameObjects.Sprite | undefined
    cloud3: Phaser.GameObjects.Sprite | undefined
    bridgeSide1 : Phaser.GameObjects.Sprite | undefined
    bridgeSide2 : Phaser.GameObjects.Sprite | undefined
    statueDummie : Phaser.GameObjects.Sprite | undefined
    treeTrunk : Phaser.GameObjects.Sprite | undefined
    treeYellow : Phaser.GameObjects.Sprite | undefined
    wall: Phaser.Types.Physics.Arcade.ImageWithDynamicBody|undefined
    statedirection : number | undefined
    //NPC's

    npcs: Phaser.Physics.Arcade.Sprite[] = []
   
     
    timerstate: number = 0
    
    constructor() { super("Overworld")

        this.tree1 = undefined
        this.hearth = undefined
        this.bgBlue = undefined
        this.cloud1 = undefined
        this.cloud2 = undefined
        this.cloud3 = undefined
        this.bridgeSide1 = undefined
        this.bridgeSide2 = undefined
        this.statueDummie = undefined
        this.treeTrunk = undefined
        this.treeYellow = undefined
        
    }

    subscribeDraggingItemFromInventory() {
        this.game.events.on("dragging-item-from-inventory", (item: Character | Furniture, position?: [number, number]) => {
            const camera = this.cameras.main
            if (!position) {
                this.draggingObject?.updateLocationState()
                this.draggingObject = undefined
                return 
            }
            const overworldPosition = new Phaser.Math.Vector2(
                (position[0] * camera.scaleManager.displayScale.x / camera.zoom + camera.worldView.left), 
                (position[1] * camera.scaleManager.displayScale.y / camera.zoom + camera.worldView.top)
            )
            if (this.draggingObject) {
                this.draggingObject.x = overworldPosition.x
                this.draggingObject.y = overworldPosition.y
            }
            else {
                if (item.ctype === "character")
                    this.draggingObject = 
                        this.adventurers.filter(adventurer => adventurer.character.entityId === item.entityId)[0] ||
                        OverworldCharacter.init(item, this, overworldPosition, false)
                else if (item.ctype === "furniture")
                    this.draggingObject = 
                        this.furniture.filter(furniture => furniture.furniture.entityId === item.entityId)[0] ||
                        OverworldFurniture.init(item, this, overworldPosition, false)
            }
        })
    }

    subscribeCancelDraggingItemFromInventory() {
        this.game.events.on("cancel-dragging-item-from-inventory", () => {
            if (this.draggingObject) {
                this.draggingObject.destroy()
                this.draggingObject = undefined
                
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

        // BG ANIMATION
        this.anims.create({
            key: "BGSpritesheet_anim",
            
            frames : [
                { key :"layer0"},
                { key :"layer1"},
                { key :"layer2"},
                { key :"layer3"},
                { key :"layer4"},
                { key :"layer5"},
                { key: "layer6"},
                { key: "layer7"},                
            ],
            frameRate: 10,
            repeat: -1
         })
        
    }

    create(time: number, delta: number) {
      
        // Sound

        var ambientSound = this.sound.add("ambient-sound") 
        ambientSound.play()

        //Physics
        
        this.physics.world.setBounds(0, 0, 1500, 1300)
        this.physics.world.setBoundsCollision(true, true, true, true)

        this.npcs.forEach((npc) => {
            npc.setData("state", "idle")// Initial state is idle
            npc.setData("lifeTime",0)
            
            this.time.addEvent({
                delay: 1000, 
                loop: true,
                callback: () => {
                    const newLifeTime = npc.getData("lifeTime") +1
                    npc.setData("lifeTime", newLifeTime)
                }
            })
        })
        
        
    
        
        const innOrigin: [number, number] = [350, 485]
        const [floor, walls] = innBuildingRenderMatrix
        floor.render(this, innOrigin)
        this.walls = walls.render(this, innOrigin)

        //Animations

        // this.anims.create({
        //     key: "tree-sprite-anim",
        //     frames : this.anims.generateFrameNumbers("tree-sprite-sheet", {start: 0, end: 7}),
        //     frameRate: 10,
        //     repeat: -1
        //  })
         
        this.add.sprite(769, 650,"layer0").play("BGSpritesheet_anim")
       
        // this.tree1 = this.add.sprite(830,240,"tree-sprite-sheet")
        // this.tree1?.play("tree-sprite-anim")
        
        
        // const tree2 = this.add.sprite(215,835,"tree-sprite-sheet" )
        // const tree3 = this.add.sprite(0,635,"tree-sprite-sheet" )
        // const tree4 = this.add.sprite(390,150,"tree-sprite-sheet" )
        // tree2.play("tree-sprite-anim")
        // tree3.play("tree-sprite-anim")
        // tree4.play("tree-sprite-anim")
        this.bgBlue = this.add.sprite(910,650,"blue-bg")
        this.bgBlue.setDepth(-1)
        this.cloud1 = this.add.sprite(1400,850,"cloud1")
        this.cloud2 = this.add.sprite(1800,250,"cloud2")
        this.cloud3 = this.add.sprite(1000,400,"cloud2")

        this.cloud1.alpha = 0.6
        this.cloud2.alpha = 0.6
        this.cloud3.alpha = 0.6
        this.cloud1.setDepth(-1)
        this.cloud2.setDepth(-1)
        this.cloud3.setDepth(-1)
        this.bridgeSide1 = this.add.sprite(880,650,"bridge-side1")
        this.bridgeSide2 = this.add.sprite(880,650,"bridge-side2")
        this.statueDummie = this.add.sprite(880,650,"statue-dummie")
        this.treeYellow = this.add.sprite(880,650,"tree-yellow")
        this.treeTrunk = this.add.sprite(880,650,"tree-trunk")
        
        
        
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
        
        // Walls
        this.wall = this.physics.add.image(790,650, "no_zone")
        this.wall.setImmovable(true)
        this.physics.add.collider(this.npcs, this.wall, (npc, wall) => {
            
            const randomDirection = Phaser.Math.Between(0, 3);
            switch (randomDirection) {
                case 0:
                    npc.body.gameObject.setVelocity(Phaser.Math.Between(-30, 30), -20); // Move up
                    break;
                case 1:
                    npc.body.gameObject.setVelocity(20, Phaser.Math.Between(-30, 30)); // Move right
                    break;
                case 2:
                    npc.body.gameObject.setVelocity(Phaser.Math.Between(-30, 30), 20); // Move down
                    break;
                case 3:
                    npc.body.gameObject.setVelocity(-20, Phaser.Math.Between(-30, 30)); // Move left
                    break;
                    
            }
            

         })

        // @ts-ignore
        // this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        //     this.cameras.main.setZoom(deltaY > 0 ? Math.max(this.cameras.main.zoom - 1, .75) :  Math.min(this.cameras.main.zoom + 1, 2) )
        //     if(this.cameras.main.zoom > 1){
        //         innRoof.setVisible(false)
        //     }else{
        //         innRoof.setVisible(true)
        //     }
            
        // }
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.cameras.main.setZoom(deltaY > 0 ? Math.max(this.cameras.main.zoom - .5, .75) :  Math.min(this.cameras.main.zoom + .5, 2) )
            if(this.cameras.main.zoom > 1){
                innRoof.setVisible(false)
            }else{
                innRoof.setVisible(true)
            }
        })
         // Select Adveturer
         this.input.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
            // Check if the left mouse button was clicked
            if (pointer.leftButtonDown()) {
                const selectedAdventurer = this.adventurers[0]; 
    
                // Check if an adventurer is selected
                if (selectedAdventurer) {
                    // Get the target position based on the mouse click
                    const targetX = pointer.worldX;
                    const targetY = pointer.worldY;
    
                    // Set the target position for the adventurer
                    selectedAdventurer.sprites[0].setData("targetX", targetX);
                    selectedAdventurer.sprites[0].setData("targetY", targetY);
    
                    // Change the adventurer's state to moveToTarget
                    selectedAdventurer.sprites[0].setData("state", "moveToTarget");
                }
            }
        });
        
        this.setInitialInnState()
        
        this.adventurers.forEach((adventurer) => {
            const state : string = adventurer.sprites[0].getData("state")
            const randNum : number = Phaser.Math.Between(0, 100)
            
            if(state==undefined){
                adventurer.sprites[0].setData("state","transitionState")
            }
         })
        }

    update(time: number, delta: number): void {
       
        // Timer
        this.timerstate = this.timerstate + delta 
        if(this.timerstate > 2000){
            this.timerstate = 0
        }
        
        // Adventurer's steps
        const stepY = Math.sin(time/60)*0.5

        this.adventurers.forEach(adventurer => {
            // TODO: Mover al update de character
            adventurer.setDepth()
            adventurer.update(time, delta)
            const state : string = adventurer.sprites[0].getData("state")
            const randomDirection = Phaser.Math.Between(0, 3)

            // Set adventurer State
            
            var randomState = Phaser.Math.Between(0, 2)
            if(state === "transitionState"){
                switch(randomState){
                    case 0:
                        //console.log("Idle State")
                        adventurer.sprites[0].setData("state","idle")
                        
                    break
                    case 1:
                        //console.log("Move State")
                        adventurer.sprites[0].setData("state","move")
                        
                    break
                    case 2:
                        //console.log("Transition State")
                        this.timerstate = 0
                        this.statedirection = randomDirection
                        adventurer.sprites[0].setData("state","transitionState")
                    break
                }

            }else if(state === "idle"){
                //Idle behavior
                adventurer.sprites[0].setVelocity(0); // Not move
                if(this.timerstate > 1900){
                    adventurer.sprites[0].setData("state","transitionState")
                }
            }else if(state === "move"){
                //Move Behavior
            
                 switch (this.statedirection) {
                    case 0:
                         adventurer.sprites[0].setVelocity(0, -20-200*stepY); // Move up
                         break
                    case 1:
                        adventurer.sprites[0].setVelocity(20, 200*stepY); // Move right
                         break
                    case 2:
                         adventurer.sprites[0].setVelocity(0, 20+200*stepY); // Move down
                        break
                    case 3:
                        adventurer.sprites[0].setVelocity(-20,200*stepY); // Move left
                        break
                        }
                 if(this.timerstate > 1900){
                    adventurer.sprites[0].setData("state","transitionState")
                }
            }else if(state == "moveToTarget"){
                //Move to target behavior
                 const targetX = adventurer.sprites[0].getData("targetX");
            const targetY = adventurer.sprites[0].getData("targetY");
            const velocityX = targetX - adventurer.sprites[0].x;
            const velocityY = targetY - adventurer.sprites[0].y;
            adventurer.sprites[0].setVelocity(velocityX, velocityY);
            
            // Check if the adventurer has reached the target
            if (Phaser.Math.Distance.Between(adventurer.sprites[0].x, adventurer.sprites[0].y, targetX, targetY) < 10) {
                adventurer.sprites[0].setData("state", "idle");
            }

            }
            
        })
        this.furniture.forEach(furniture => furniture.setDepth())
        //this.walls.forEach(wall => wall.depth = wall.y + 10)
        this.cameraControls.update(delta)

        
        //Nenufar wave
        const valY = Math.sin(time / 200) * 0.5
        const valY2 = Math.cos(time / 200) * 0.5
        //move nenufar up and down
        this.nenufar1!.y = valY + 1008
        this.nenufar2!.y = valY2 + 1041
        this.nenufar3!.y = valY + 1033
        this.nenufar4!.y = valY2 + 919
        this.nenufar5!.y = valY2 + 963
        

        if (this.game.input.activePointer.isDown && !this.draggingObject) {
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


        //Props Animation
         
        this.cloud1!.x -= 0.5  
        this.cloud2!.x -= 0.5
        this.cloud3!.x -= 0.5
        if(this.cloud1!.x < 100){
            this.cloud1!.x = 1800
        }
        if(this.cloud2!.x < 100){  
            this.cloud2!.x = 2000
        }
        if(this.cloud3!.x < 100){
            this.cloud3!.x = 1800
        }
        
    }
}
