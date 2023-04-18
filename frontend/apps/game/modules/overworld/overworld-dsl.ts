import { Character, Furniture } from "../../../common"

export type SectorConfiguration = 
    Record<string, { obj: Character | Furniture, location: [number, number] }>