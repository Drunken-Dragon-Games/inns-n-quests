import { TileSet } from "./tile-set-dsl"
import Phaser from "phaser"

export type RMTile<TileId extends string> = TileId | "" | string[] | RMTile<TileId>[]

export class TileRenderMatrix<TileId extends string> {

    constructor(public readonly metadata: {
        tileSet: TileSet<TileId>,
        matrix: RMTile<TileId>[][],
        coordSize: [number, number]
    }) {}

    render(scene: Phaser.Scene, origin: [number, number]): Phaser.GameObjects.Sprite[] {
        const [ xCoordSize, yCoordSize ] = this.metadata.coordSize
        const [ xTileSize, yTileSize ] = this.metadata.tileSet.metadata.tileSize
        const [ xOrigin, yOrigin ] = origin
        const group = [] as Phaser.GameObjects.Sprite[]
        const tilesetName = this.metadata.tileSet.metadata.name
        this.metadata.matrix.forEach((row, y) => {
            const flatRow = row.flat()
            flatRow.forEach((tile, x) => {
                const t = this.metadata.tileSet.getTile(tile as TileId)
                if (tile !== "" && t.collision[0] === 0) {
                    const sprite = scene.add.sprite(
                        x * xCoordSize + xOrigin, 
                        y * yCoordSize + yOrigin, 
                        tilesetName, 
                        this.metadata.tileSet.tileSpriteSheetLocation(tile as TileId)
                    )
                    group.push(sprite)
                } else if (tile !== "") {
                    const sprite = scene.physics.add.staticSprite(
                        x * xCoordSize + xOrigin, 
                        y * yCoordSize + yOrigin, 
                        tilesetName, 
                        this.metadata.tileSet.tileSpriteSheetLocation(tile as TileId)
                    )
                    sprite.setSize(t.collision[0], t.collision[1])
                    sprite.setOffset(t.collision[2], yTileSize - t.collision[1] - t.collision[3]) 
                    group.push(sprite)
                }
            })
        })
        return group
    }
}
