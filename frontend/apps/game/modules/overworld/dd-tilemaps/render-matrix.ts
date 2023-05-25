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
                const tileData = this.metadata.tileSet.getTile(tile as TileId)
                const position = [x * xCoordSize + xOrigin, y * yCoordSize + yOrigin]
                if (tile !== "" && tileData.collision[0] === 0) {
                    const sprite = scene.add.sprite(
                        position[0], 
                        position[1], 
                        tilesetName, 
                        this.metadata.tileSet.tileSpriteSheetLocation(tile as TileId)
                    )
                    sprite.depth = 10
                    //sprite.depth = position[1] + sprite.y / 2 
                    group.push(sprite)
                } else if (tile !== "") {
                    const sprite = scene.physics.add.staticSprite(
                        position[0], 
                        position[1], 
                        tilesetName, 
                        this.metadata.tileSet.tileSpriteSheetLocation(tile as TileId)
                    )
                    sprite.depth = position[1] + sprite.height / 2
                    sprite.setSize(tileData.collision[0], tileData.collision[1])
                    sprite.setOffset(tileData.collision[2], yTileSize - tileData.collision[1] - tileData.collision[3]) 
                    group.push(sprite)
                }
            })
        })
        return group
    }
}
