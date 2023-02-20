import { Units } from "../../../utils"

export type TileData<TileId extends string> = 
    { tileId: TileId, size: [number, number], collision: [number, number] }

export class TileSet<TileId extends string> { 

    constructor(public readonly metadata: {
        name: string,
        uri: string,
        proportions: Proportions,
        set: { [tid in TileId]: TileData<TileId> } 
    }){}

    get srcSet(): { tileId: TileId, uri: string }[] {
        return this.tileNames.map(tileId => ({ tileId, uri: this.tileSrc(tileId)}))
    }

    get tileNames(): TileId[] {
        return Object.keys(this.metadata.set) as TileId[]
    }

    get tiles(): TileData<TileId>[] {
        return Object.values(this.metadata.set)
    }

    scaleBy(scale: number): TileSet<TileId> { 
        return new TileSet<TileId>({...this.metadata, proportions: this.metadata.proportions.scaleBy(scale)})
    }

    renderMatrixWidthUnits(renderMatrix: TilesRenderMatrix<TileId>): string {
        return this.metadata.proportions.width(renderMatrix[0].reduce((acc, tileId) => acc + this.metadata.set[tileId].collision[0], 0))
    }

    renderMatrixHeightUnits(renderMatrix: TilesRenderMatrix<TileId>): string {
        return this.metadata.proportions.height(renderMatrix.length)
    }

    renderMatrixWidth(renderMatrix: TilesRenderMatrix<TileId>): number {
        return this.metadata.proportions.unitWidth * renderMatrix[0].length
    }

    renderMatrixHeight(renderMatrix: TilesRenderMatrix<TileId>): number {
        return this.metadata.proportions.unitHeight * renderMatrix.length
    }

    sizeWidthUnits(tileId: TileId): string { 
        return this.metadata.proportions.width(this.metadata.set[tileId].size[0]) 
    }

    sizeHeightUnits(tileId: TileId): string { 
        return this.metadata.proportions.height(this.metadata.set[tileId].size[1]) 
    }

    sizeWidth(tileId: TileId): number { 
        return this.metadata.proportions.unitWidth * this.metadata.set[tileId].size[0] 
    }

    sizeHeight(tileId: TileId): number {
        return this.metadata.proportions.unitHeight * this.metadata.set[tileId].size[1] 
    }

    collisionWidthUnits(tileId: TileId): string { 
        return this.metadata.proportions.width(this.metadata.set[tileId].collision[0])
    }

    collisionHeightUnits(tileId: TileId): string {
        return this.metadata.proportions.height(this.metadata.set[tileId].collision[1])
    }

    tileSrc(tileId: TileId): string {
        return `${this.metadata.uri}/x4_${tileId}.png`
    }
}

export class Proportions {
    constructor(
        public readonly units: Units,
        public readonly unitWidth: number,
        public readonly unitHeight: number,
    ) {}
    width(w: number) { return this.units.u(w * this.unitWidth) }
    height(h: number) { return this.units.u(h * this.unitHeight) }
    scaleBy(s: number) { return new Proportions(this.units.scaleBy(s), this.unitWidth, this.unitHeight) }
}

export type TilesRenderMatrix<TileId extends string> = TileId[][]

export type TileRender<TileId extends string> = {
    renders?: TileId,
    collides: boolean
}