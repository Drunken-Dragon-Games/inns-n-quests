import { px1, Units } from "../../utils"

export type TileData<TileId extends string> = 
    { tileId: TileId, size: [number, number], collision: [number, number] }

export interface  ITileSet<TileId extends string> { 
    name: string,
    uri: string,
    proportions: Proportions,
    set: { [tid in TileId]: TileData<TileId> } 
}

export class TileSet<TileId extends string> implements ITileSet<TileId> { 

    constructor(
        public readonly name: string,
        public readonly uri: string,
        public readonly proportions: Proportions,
        public readonly set: { [tid in TileId]: TileData<TileId> } 
    ){}

    scaleBy(scale: number): TileSet<TileId> { 
        return new TileSet<TileId>(this.name, this.uri, this.proportions.scaleBy(scale), this.set) 
    }

    renderMatrixWidthUnits(renderMatrix: RenderMatrix<TileId>): string {
        return this.proportions.width(renderMatrix[0].length)
    }

    renderMatrixHeightUnits(renderMatrix: RenderMatrix<TileId>): string {
        return this.proportions.height(renderMatrix.length)
    }

    sizeWidthUnits(tileId: TileId): string { 
        return this.proportions.width(this.set[tileId].size[0]) 
    }

    sizeHeightUnits(tileId: TileId): string { 
        return this.proportions.height(this.set[tileId].size[1]) 
    }

    sizeWidth(tileId: TileId): number { 
        return this.proportions.unitWidth * this.set[tileId].size[0] 
    }

    sizeHeight(tileId: TileId): number {
        return this.proportions.unitHeight * this.set[tileId].size[1] 
    }

    tileSrc(tileId: TileId): string {
        return `${this.uri}/x4_${tileId}.png`
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

export type RenderMatrix<TileId extends string> = TileId[][]
