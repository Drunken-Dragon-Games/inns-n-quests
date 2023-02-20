import { Game } from "phaser"
import { useEffect } from "react"

async function loadPhaser(): Promise<Game> {
    const Phaser = await import("phaser")
    const { Preloader } = await import("./scenes/preloader")
    const { Overworld } = await import("./scenes/overworld")

    const scaleRatio = window.devicePixelRatio / 3;
    const zoom = 3

    const game = new Phaser.Game({
        type: Phaser.AUTO,
        title: "Inns & Quests Overworld",
        parent: "overworld-phaser-container",
        width: window.innerWidth * window.devicePixelRatio / zoom,
        height: window.innerHeight * window.devicePixelRatio / zoom,
        pixelArt: true,
        scale: { zoom },
        physics: {
            default: "arcade",
            arcade: {
                debug: true
            }
        },
        scene: [Preloader, Overworld]
    })

    game.events.on("progress", (progress: number) => {
        console.log(progress)
    })

    return game
}

export const usePhaserRender = () => 
    useEffect(() => {
        console.log("Loding Phaser")
        const game = loadPhaser()
        return () => { game.then(g => g.destroy(true)) }
    }, [])
