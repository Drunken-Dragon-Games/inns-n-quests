import { Units } from "../../../common"
import { TilesRenderMatrix, TileSet } from "./tile-sets/tile-sets-dsl"
import { WorldMapName } from "./worlds"

export type MapContents<Tid extends string = string> = PaperMapContents<Tid> | TileMapContents<Tid>

export type PaperMapContents<Tid> = { 
    ctype: "paper-map-contents", 
    baseUri: Tid
}

export type TileMapContents<Tid extends string> = { 
    ctype: "tile-map-contents", 
    tileSet: TileSet<Tid>,
    renderMatrix: TilesRenderMatrix<Tid> 
}

export class WorldMap<Tid extends string = string, Contents extends MapContents<Tid> = MapContents<Tid>> {

    constructor(public readonly metadata: {
        name: WorldMapName,
        size: [number, number],
        sectorSize: [number, number],
        units: Units,
        contents: Contents,
    }){}

    static paperMap(metadata: { name: WorldMapName, size: [number, number], sectorSize: [number, number], units: Units, baseUri: string }): WorldMap {
        return new WorldMap({...metadata, contents: { ctype: "paper-map-contents", baseUri: metadata.baseUri }})
    }

    static tileMap<Tid extends string>(metadata: {name: WorldMapName, tileSet: TileSet<Tid>, renderMatrix: TilesRenderMatrix<Tid>}): WorldMap<Tid> {
        return new WorldMap({ 
            name: metadata.name, 
            size: [metadata.renderMatrix.length, metadata.renderMatrix[0].length], 
            sectorSize: [metadata.tileSet.renderMatrixWidth(metadata.renderMatrix), metadata.tileSet.renderMatrixHeight(metadata.renderMatrix)], 
            units: metadata.tileSet.metadata.proportions.units, 
            contents: { ctype: "tile-map-contents", tileSet: metadata.tileSet, renderMatrix: metadata.renderMatrix } 
        })
    }

    scaleBy = (scale: number): WorldMap<Tid, Contents> =>
        new WorldMap({...this.metadata, units: this.metadata.units.scaleBy(scale)})

    public readonly width: number = this.metadata.size[0] * this.metadata.sectorSize[0]

    public readonly height: number = this.metadata.size[1] * this.metadata.sectorSize[1]

    public readonly uwidth: string = this.metadata.units.u(this.width)

    public readonly uheight: string = this.metadata.units.u(this.height)

    contentMatrixFlat(): Tid[] {
        if (this.metadata.contents.ctype === "paper-map-contents") {
            const baseUri = this.metadata.contents.baseUri
            return this.worldMatrixFlat((x, y) => 
                (baseUri.replace("(0,0)", `(${x},${y})`)) as Tid)
        } else {
            return this.metadata.contents.renderMatrix.flatMap(row => row)
        }
    }

    contentMatrix(): Tid[][] {
        if (this.metadata.contents.ctype === "paper-map-contents") {
            const baseUri = this.metadata.contents.baseUri
            return this.worldMatrix((x, y) =>
                (baseUri.replace("(0,0)", `(${x},${y})`)) as Tid)
        } else {
            return this.metadata.contents.renderMatrix
        }
    }

    worldMatrixFlat<T>(filler: (x: number, y: number) => T): T[] {
        return Array(this.metadata.size[1]).fill(0).flatMap((_, y) =>
            Array(this.metadata.size[0]).fill(0).map((_, x) => {
                const [xCoord, yCoord] = WorldMap.arrayCoordToWorldCoord([x, y], this.metadata.size)
                return filler(xCoord, yCoord)
            }))
    }

    worldMatrix<T>(filler: (x: number, y: number) => T): T[][] {
        return Array(this.metadata.size[1]).fill(0).map((_, y) =>
            Array(this.metadata.size[0]).fill(0).map((_, x) => {
                const [xCoord, yCoord] = WorldMap.arrayCoordToWorldCoord([x, y], this.metadata.size)
                return filler(xCoord, yCoord)
            }))
    }

    /**
     * If you create a matrix of the world, this function will transform the array coords to the map coords
     * Ex. 
     * 
     * (0,0), (0,1), (0,2)
     * (1,0), (1,1), (1,2)
     * (2,0), (2,1), (2,2)
     * 
     * to
     * 
     * (-1, 1), (0, 1), (1, 1)
     * (-1, 0), (0, 0), (1, 0)
     * (-1,-1), (0,-1), (1,-1)
     * 
     * @param x 
     * @param y 
     * @param size 
     * @returns 
     */
    arrayCoordToWorldCoord(coords: [number, number]): [number, number] {
        return WorldMap.arrayCoordToWorldCoord(coords, this.metadata.size)
    }

    /**
     * If you create a matrix of the world, this function will transform the array coords to the map coords
     * Ex. 
     * 
     * (0,0), (0,1), (0,2)
     * (1,0), (1,1), (1,2)
     * (2,0), (2,1), (2,2)
     * 
     * to
     * 
     * (-1, 1), (0, 1), (1, 1)
     * (-1, 0), (0, 0), (1, 0)
     * (-1,-1), (0,-1), (1,-1)
     * 
     * @param x 
     * @param y 
     * @param size 
     * @returns 
     */
    static arrayCoordToWorldCoord(coords: [number, number], size: [number, number]): [number, number] {
        return [coords[0] - Math.floor(size[0] / 2), Math.floor(size[1] / 2) - coords[1] ]
    }

    /**
     * Maps the location to the offset required to center the map
     * Returns scaled units.
     * 
     * @param wm 
     * @param location 
     * @returns 
     */
    ulocationOffset(location: [number, number]): [string, string] {
        const [x, y] = this.locationOffset(location)
        return [this.metadata.units.u(x), this.metadata.units.u(y)]
    }

    /**
     * Maps the location to the offset required to center the map
     * 
     * @param wm 
     * @param location 
     * @returns 
     */
    locationOffset(location: [number, number]): [number, number] { 
        return [ location[0] - this.width / 2 , location[1] - this.height / 2 ]
    }
}
