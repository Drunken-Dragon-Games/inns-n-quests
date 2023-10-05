import Phaser from "phaser";

export class npcs_Statemachine extends Phaser.Scene {
    npcs: Phaser.Physics.Arcade.Sprite[] = []

    constructor() {
        super({ key: "npcs_Statemachine" })
    }

    preload() {
        this.load.image("npc", "\maps\Enemy_Paladin.png")
    }

    create() {
        // Create an array to hold your NPCs
        this.npcs = [];

        // Create NPCs and add them to the array
        for (let i = 0; i < 5; i++) {
            const npc = this.physics.add.sprite(
                Phaser.Math.Between(100, 700),
                Phaser.Math.Between(100, 500),
                "npc"
            )
            npc.setCollideWorldBounds(true);
            this.npcs.push(npc)
        }

        // Enable physics collisions
        this.physics.world.setBounds(0, 0, 800, 600)

        // Initialize the NPCs' state and timer
        this.npcs.forEach((npc) => {
            npc.setData("state", "idle") // Initial state is idle
            npc.setData(
                "stateTimer",
                this.time.addEvent({
                    delay: Phaser.Math.Between(1000, 3000),
                    loop: true,
                })
            )
        })
    }

    update() {
        // Loop through each NPC and update its state
        this.npcs.forEach((npc) => {
            const state: string = npc.getData("state");
            const stateTimer: Phaser.Time.TimerEvent = npc.getData("stateTimer")

            switch (state) {
                case "idle":
                    if (stateTimer.getProgress() === 1) {
                        npc.setVelocity(0); // Stop moving
                        npc.setData("state", "move");
                        stateTimer.reset({
                            delay: Phaser.Math.Between(1000, 3000),
                            loop: true,
                        });
                    }
                    break;
                case "move":
                    if (stateTimer.getProgress() === 1) {
                        const randomDirection = Phaser.Math.Between(0, 3)
                        switch (randomDirection) {
                            case 0:
                                npc.setVelocity(0, -100); // Move up
                                break
                            case 1:
                                npc.setVelocity(100, 0); // Move right
                                break
                            case 2:
                                npc.setVelocity(0, 100); // Move down
                                break
                            case 3:
                                npc.setVelocity(-100, 0); // Move left
                                break
                        }
                        npc.setData("state", "idle")
                        stateTimer.reset({
                            delay: Phaser.Math.Between(1000, 3000),
                            loop: true,
                        })
                    }
                    break
            }
        });
    }
}
