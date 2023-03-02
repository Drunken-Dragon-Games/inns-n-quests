import { Adventurer, Furniture } from "../../common"

export type SectorConfiguration = 
    Record<string, { obj: Adventurer | Furniture, location: [number, number] }>