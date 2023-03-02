import { Adventurer } from "./adventurer"
import { Furniture } from "./furniture"
import { SectorState } from "./sector"

export type InventoryRecord<T> = Record<string, T>

export function makeRecord<T>(objects: T[], id: (o: T) => string): InventoryRecord<T> {
    const record: InventoryRecord<T> = {}
    objects.forEach(o => record[id(o)] = o)
    return record
}

export type IdleQuestsInventory = {
    adventurers: InventoryRecord<Adventurer> 
    furniture: InventoryRecord<Furniture>
    innState?: SectorState
}