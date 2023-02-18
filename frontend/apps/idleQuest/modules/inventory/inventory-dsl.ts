import { Adventurer, TakenQuest } from "../../dsl"

export type InventoryItem = Adventurer | TakenQuest

export const itemId = (item: InventoryItem): string => {
    if (item.ctype === "adventurer")
        return item.adventurerId
    else //if (item.ctype === "taken-quest")
        return item.takenQuestId
}