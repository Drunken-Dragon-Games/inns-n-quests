import { Adventurer, TakenQuest } from "../../dsl"
import { Furniture } from "../../dsl/furniture"

export type InventoryItem = Adventurer | TakenQuest | Furniture

export const itemId = (item: InventoryItem): string => {
    if (item.ctype === "adventurer")
        return item.adventurerId
    else if (item.ctype === "furniture")
        return item.furnitureId
    else //if (item.ctype === "taken-quest")
        return item.takenQuestId
}