import { px } from "../../../../common"
import { Proportions, TileSet } from "./tile-sets-dsl"

export type TavernBuildingTileSet 
    = "wooden-floor-1" | "wall-south-1" | "window-south-1" | ""

export const TavernBuildingTileSet: TileSet<TavernBuildingTileSet> = 
    new TileSet<TavernBuildingTileSet>({
        name: "Tavern Building",
        uri: "https://cdn.ddu.gg/sprite-sheets/idle-quests/tavern_building",
        proportions: new Proportions(px(4), 32, 16),
        set: {
            "wooden-floor-1": { tileId: "wooden-floor-1", size: [1, 1], collision: [1, 1] },
            "wall-south-1": { tileId: "wall-south-1", size: [1, 5], collision: [1, 1] },
            "window-south-1": { tileId: "window-south-1", size: [1, 5], collision: [1, 1] },
            "" : { tileId: "", size: [1, 1], collision: [1, 1] }
        }
    })