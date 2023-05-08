import Phaser from "phaser"

export type TileData<TileId extends string> = 
    { tileId: TileId, index: [number, number], collision: [number, number, number, number] }

export class TileSet<TileId extends string> { 

    constructor(public readonly metadata: {
        name: string,
        uri: string,
        sheetSize: [number, number],
        tileSize: [number, number]
        set: { [tid in TileId]: TileData<TileId> } 
    }){}

    get tileNames(): TileId[] {
        return Object.keys(this.metadata.set) as TileId[]
    }

    get tiles(): TileData<TileId>[] {
        return Object.values(this.metadata.set)
    }

    getTile(tileId: TileId): TileData<TileId> {
        return this.metadata.set[tileId]
    }

    tileSpriteSheetLocation(tileId: TileId): number {
        return (this.metadata.set[tileId].index[0] * this.metadata.sheetSize[0] / this.metadata.tileSize[0] ) + this.metadata.set[tileId].index[1]
    }

    loadImage(load: Phaser.Loader.LoaderPlugin): void {
        load.spritesheet(this.metadata.name, this.metadata.uri, {
            frameWidth: this.metadata.tileSize[0],
            frameHeight: this.metadata.tileSize[1],
        })
    }
}
