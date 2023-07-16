import { TileSet } from "../dd-tilemaps";

export type InnBuildingTileSet
    = "nw-corner" | "n-wall" | "ne-corner" | "w-wall" | "e-wall" | "sw-corner"
    | "s-wall-1" | "s-wall-2" | "s-wall-3" | "se-corner" | "n-door-1" | "n-door-2" | "s-door-1" | "s-door-2"
    | "n-window" | "s-window" | "wooden-floor-1" | "wooden-floor-2" | "wooden-floor-3" | "stone-floor-1"
    | "nw-t-intersection" | "ne-t-intersection" | "n-wall-2" | "nw-l-intersection" | "ne-l-intersection"

export const innBuildingTileSet = new TileSet<InnBuildingTileSet>({
    name: "inn-building",
    uri: "/maps/inn-building.png",
    sheetSize: [480, 160],
    tileSize: [32, 16*5],
    set: {
        "nw-corner": { tileId: "nw-corner", index: [0, 0], collision: [10, 16+8, 0, 0] },
        "n-wall": { tileId: "n-wall", index: [0, 1], collision: [32, 16, 0, 8] }, 
        "n-door-1": { tileId: "n-door-1", index: [0, 2], collision: [32, 16, 0, 8] },
        "n-door-2": { tileId: "n-door-2", index: [0, 3], collision: [32, 16, 0, 8] },
        "n-window": { tileId: "n-window", index: [0, 4], collision: [32, 16, 0, 8] },
        "ne-corner": { tileId: "ne-corner", index: [0, 5], collision: [10, 16+8, 16+6, 0] },
        "w-wall": { tileId: "w-wall", index: [0, 6], collision: [10, 16*5, 0, 0] },
        "wooden-floor-1": { tileId: "wooden-floor-1", index: [0, 7], collision: [0, 0, 0, 0] },
        "wooden-floor-2": { tileId: "wooden-floor-2", index: [0, 8], collision: [0, 0, 0, 0] },
        "wooden-floor-3": { tileId: "wooden-floor-3", index: [0, 9], collision: [0, 0, 0, 0] },
        "stone-floor-1": { tileId: "stone-floor-1", index: [0, 10], collision: [0, 0, 0, 0] },
        "n-wall-2": { tileId: "n-wall-2", index: [0, 11], collision: [32, 16, 0, 8] }, 
        "sw-corner": { tileId: "sw-corner", index: [1, 0], collision: [10, 16+8, 0, 0] },
        "s-wall-1": { tileId: "s-wall-1", index: [1, 1], collision: [32, 16, 0, 0] },
        "s-wall-2": { tileId: "s-wall-2", index: [1, 2], collision: [32, 16, 0, 0] },
        "s-wall-3": { tileId: "s-wall-3", index: [1, 3], collision: [32, 16, 0, 0] },
        "s-window": { tileId: "s-window", index: [1, 4], collision: [32, 16, 0, 0] },
        "se-corner": { tileId: "se-corner", index: [1, 5], collision: [10, 16+8, 16+6, 0] },
        "e-wall": { tileId: "e-wall", index: [1, 6], collision: [10, 16*5, 16+6, 0] },
        "s-door-1": { tileId: "s-door-1", index: [1, 7], collision: [32, 16, 0, 0] },
        "s-door-2": { tileId: "s-door-2", index: [1, 8], collision: [32, 16, 0, 0] },
        "nw-t-intersection": { tileId: "nw-t-intersection", index: [1, 9], collision: [10, 16*5, 0, 0] },
        "ne-t-intersection": { tileId: "ne-t-intersection", index: [1, 10], collision: [10, 16*5, 16+6, 0] },
        "nw-l-intersection": { tileId: "nw-l-intersection", index: [1, 11], collision: [10, 16*5, 0, 8] },
        "ne-l-intersection": { tileId: "ne-l-intersection", index: [1, 12], collision: [10, 16*5, 16+6, 8] },
    }
})
