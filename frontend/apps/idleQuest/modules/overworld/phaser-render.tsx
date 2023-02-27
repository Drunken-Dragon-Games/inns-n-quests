import { Game } from "phaser"
import { useEffect } from "react"
import { IdleQuestsTransitions } from "../../idle-quests-transitions"

async function loadPhaser(transitions: IdleQuestsTransitions): Promise<Game> {
    const Phaser = await import("phaser")
    const { Preloader } = await import("./scenes/preloader")
    const { Overworld } = await import("./scenes/overworld")

    const scaleRatio = window.devicePixelRatio / 3;
    const zoom = 3

    const game = new Phaser.Game({
        type: Phaser.AUTO,
        title: "Inns & Quests Overworld",
        //width: window.innerWidth * window.devicePixelRatio / zoom,
        //height: window.innerHeight * window.devicePixelRatio / zoom,
        pixelArt: true,
        scale: { 
            mode: Phaser.Scale.ENVELOP,
            parent: "overworld-phaser-container",
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        },
        scene: [Preloader, Overworld]
    })

    game.events.on("loading-complete", () => {
        transitions.inventory.onFinishLoadingModule(1)
    })

    return game
}

export const usePhaserRender = (transitions: IdleQuestsTransitions) => 
    useEffect(() => {
        const game = loadPhaser(transitions)
        return () => { game.then(g => g.destroy(true)) }
    }, [])
