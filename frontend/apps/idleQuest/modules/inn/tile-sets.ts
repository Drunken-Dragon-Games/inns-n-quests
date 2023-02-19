import { px1 } from "../../utils"
import { TileSet, Proportions } from "./tile-sets-dsl"

export type TavernBuildingTile 
    = "wooden-floor-1" | "wall-south-1" | "window-south-1"

export const TavernBuildingTileSet: TileSet<TavernBuildingTile> = 
    new TileSet<TavernBuildingTile>(
        "Tavern Building",
        "https://cdn.ddu.gg/sprite-sheets/idle-quests/tavern_building",
        new Proportions(px1, 32, 16),
        {
            "wooden-floor-1": { tileId: "wooden-floor-1", size: [1, 1], collision: [1, 1] },
            "wall-south-1": { tileId: "wall-south-1", size: [1, 5], collision: [1, 1] },
            "window-south-1": { tileId: "window-south-1", size: [1, 5], collision: [1, 1] },
        }
    )