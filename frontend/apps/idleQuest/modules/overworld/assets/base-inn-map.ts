import { RMTile, TileRenderMatrix } from "../dd-tilemaps";
import { innBuildingTileSet, InnBuildingTileSet } from "./inn-building-tile-sets";


/*
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

const emptySpace = <T extends string>(x: number): RMTile<T> => 
    Array(x).fill("")

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
*/

const row = <T extends string>(x: number, tile: RMTile<T>): RMTile<T> =>
    Array(x).fill(Array.isArray(tile) ? tile.flat() : tile)

const matrix = <T extends string>(x: number, y: number, tile: RMTile<T>): RMTile<T> =>
    Array(y).fill(row(x, tile))

const woodenFloor3: RMTile<InnBuildingTileSet> = ["wooden-floor-1", "wooden-floor-2", "wooden-floor-3"]

const nDoor2: RMTile<InnBuildingTileSet> = 
    ["n-door-1", "n-door-2"]

const sDoor2: RMTile<InnBuildingTileSet> = 
    ["s-door-1", "s-door-2"]


/*
const kitchenFloor10x10: RMTile<InnBuildingTileSet> =
    matrix(10, 10, "stone-floor")

const tavernBehindBarFloor6x4: RMTile<InnBuildingTileSet> =
    matrix(2, 4, woodenFloor3)
*/

const floorMatrix: RMTile<InnBuildingTileSet>[][] = [
    ["","","","","","","","","", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1"],
    ["","","","","","","","","", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1"],
    ["","","","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "stone-floor-1" , "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1"],
    ["","","","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "stone-floor-1" , "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "", ""],
    ["","","","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "stone-floor-1" , "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "", ""],
    ["","","","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "stone-floor-1" , "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "", ""],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "stone-floor-1" , "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1"], 
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "stone-floor-1" , "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1", "stone-floor-1"], 
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"wooden-floor-3" , "wooden-floor-1" , "wooden-floor-2" , "wooden-floor-3" ,  "wooden-floor-1" , "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1","wooden-floor-2","wooden-floor-3","wooden-floor-1" ,"wooden-floor-2" ,"" , "" , "" , "" ,  "" , "", "", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
]

const wallsMatrix: RMTile<InnBuildingTileSet>[][] = [
    ["","","","","","","","","", "nw-corner", "n-wall", "n-wall", "n-wall", "n-wall-2", "n-wall", "n-wall", "ne-corner"],
    ["","","","","","","","","", "w-wall", "", "", "", "", "", "", "e-wall"],
    ["","","","nw-corner" ,"n-wall" ,"n-wall" , "n-wall-2" , "n-wall" , "n-wall" ,  "nw-t-intersection" , "", "", "", "", "", "", "e-wall"],
    ["","","","w-wall" ,"" ,"" , "" , "" , "" ,  "w-wall" , "", "", "", "", "", "", "e-wall"],
    ["","","","w-wall" ,"" ,"" , "" , "" , "" ,  "w-wall" , "", "", "", "", "", "", "e-wall"],
    ["","","","w-wall" ,"" ,"" , "" , "" , "" ,  "w-wall" , "", "", "", "", "", "", "e-wall"],
    ["nw-corner", "n-window", "n-wall", "nw-l-intersection","" ,"" , "" , "" , "" , "w-wall", "", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "sw-corner", "s-door-1", "s-door-2", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "nw-corner", "n-wall", "nw-l-intersection", "", "ne-l-intersection", "n-wall", "ne-corner"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "w-wall", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "w-wall", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "w-wall", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "w-wall", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "w-wall", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"" , "" , "" , "" , "", "", "", "w-wall", "", "", "", "", "", "e-wall"],
    ["w-wall", "", "", "","" ,"s-wall-1" , "s-wall-2","s-window" , "s-door-1" , "s-door-2" , "s-window", "s-wall-3", "w-wall", "", "", "", "", "", "e-wall"],
    ["sw-corner", "s-wall-1", "s-window", "s-wall-2", "se-corner" ,"" , "" , "" , "" , "", "", "", "sw-corner", "s-wall-1", "s-window","s-wall-2", "s-window", "s-wall-3", "se-corner"],
]


export const floor = new TileRenderMatrix<InnBuildingTileSet>({
    tileSet: innBuildingTileSet,
    coordSize: [32, 16],
    matrix: floorMatrix,
})

export const walls = new TileRenderMatrix<InnBuildingTileSet>({
    tileSet: innBuildingTileSet,
    coordSize: [32, 16],
    matrix: wallsMatrix,
})

export const innBuildingRenderMatrix: TileRenderMatrix<InnBuildingTileSet>[] =
    [floor, walls]