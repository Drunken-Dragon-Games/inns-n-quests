import { Game } from "phaser"
import { useEffect } from "react"
import OverworldApi from "./overworld-api"
import { OverworldParams } from "./overworld-state"

async function loadPhaser(containerId: string, params: OverworldParams, onReady: () => void): Promise<Game> {
    const Phaser = await import("phaser")
    const { Preloader } = await import("./scenes/preloader")
    const { Overworld } = await import("./scenes/overworld")

    const game = new Phaser.Game({
        type: Phaser.AUTO,
        title: "Inns & Quests Overworld",
        pixelArt: true,
        scale: { 
            mode: Phaser.Scale.ENVELOP,
            parent: containerId,
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [Preloader, Overworld]
    })

    OverworldApi.setParams(params)
    OverworldApi.setEventEmitter(game.events)
    game.events.on("loading-complete", onReady)

    return game
}

export const usePhaserRender = (containerId: string, params: OverworldParams, onReady: () => void) => 
    useEffect(() => {
        const game = loadPhaser(containerId, params, onReady)
        return () => { game.then(g => g.destroy(true)) }
    }, [])
