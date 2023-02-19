import { px1 } from "../../utils"
import { TavernBuildingTileSet } from "./tile-sets/tile-sets"
import { WorldMap } from "./world-dsl"

export type WorldMapName = "Northwest Thiolden" | "Base Inn"

export const worldNames: WorldMapName[] = [ "Northwest Thiolden", "Base Inn" ]

export const NorthWestThioldenPaperMap: WorldMap = 
    WorldMap.paperMap({
        name: "Northwest Thiolden",
        size: [3, 3],
        sectorSize: [819, 614],
        units: px1,
        baseUri: "https://cdn.ddu.gg/maps/idle-quests-wm/nw-thiolden_(0,0).gif"
    })

export const BaseInn: WorldMap<TavernBuildingTileSet> =
    WorldMap.tileMap({
        name: "Base Inn",
        tileSet: TavernBuildingTileSet,
        renderMatrix: [
            ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
            ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
            ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
            ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
        ],
    })