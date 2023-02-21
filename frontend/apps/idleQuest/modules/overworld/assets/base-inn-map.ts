import { RMTile, TileRenderMatrix } from "../dd-tilemaps";
import { innBuildingTileSet, InnBuildingTileSet } from "./inn-building-tile-sets";

const wwwf3: RMTile<InnBuildingTileSet> = ["wooden-floor-1", "wooden-floor-2", "wooden-floor-3"]

export const floor = new TileRenderMatrix<InnBuildingTileSet>({
    tileSet: innBuildingTileSet,
    coordSize: [32, 16],
    matrix: [
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
        [wwwf3, wwwf3, "wooden-floor-1"],
    ]
})

const emptySpace = (x: number): RMTile<InnBuildingTileSet> => 
    Array(x).fill("")

const nDoor2: RMTile<InnBuildingTileSet> = 
    ["n-door-1", "n-door-2"]

const sDoor2: RMTile<InnBuildingTileSet> = 
    ["s-door-1", "s-door-2"]

export const walls = new TileRenderMatrix<InnBuildingTileSet>({
    tileSet: innBuildingTileSet,
    coordSize: [32, 16],
    matrix: [
        ["nw-corner", "n-wall", "n-window", "n-wall", "n-window", "n-wall", "ne-corner"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["w-wall", emptySpace(5), "e-wall"],
        ["sw-corner", "s-window", "s-wall-2", sDoor2, "s-wall-1", "se-corner"],
    ]
})

export const innBuildingRenderMatrix: TileRenderMatrix<InnBuildingTileSet>[] =
    [floor, walls]