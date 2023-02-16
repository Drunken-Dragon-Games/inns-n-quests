import { Adventurer } from "./adventurer";
import { TakenQuest } from "./quest";

export type InventoryItem = Adventurer | TakenQuest

export const itemId = (item: InventoryItem): string => {
    if (item.ctype === "adventurer")
        return item.adventurerId
    else //if (item.ctype === "taken-quest")
        return item.takenQuestId
}