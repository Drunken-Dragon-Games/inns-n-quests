import { Game } from "phaser"
import { useEffect } from "react"
import OverworldApi from "./overworld-api"
import OverworldTransitions from "./overworld-transitions"

async function loadPhaser(containerId: string, onReady: () => void): Promise<Game> {
    const Phaser = await import("phaser")
    const { Preloader } = await import("./scenes/preloader")
    const { Overworld } = await import("./scenes/overworld")

    const game = new Phaser.Game({
        type: Phaser.AUTO,
        title: "Inns & Quests Overworld",
        //width: window.innerWidth * window.devicePixelRatio / zoom,
        //height: window.innerHeight * window.devicePixelRatio / zoom,
        pixelArt: true,
        scale: { 
            mode: Phaser.Scale.ENVELOP,
            parent: containerId,
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        },
        scene: [Preloader, Overworld]
    })

    OverworldApi.setEventEmitter(game.events)
    game.events.on("loading-complete", onReady)

    return game
}

export const usePhaserRender = (containerId: string, onReady: () => void) => 
    useEffect(() => {
        const game = loadPhaser(containerId, onReady)
        return () => { game.then(g => g.destroy(true)) }
    }, [])
