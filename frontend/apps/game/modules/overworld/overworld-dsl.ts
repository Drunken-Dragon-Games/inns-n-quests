import { Character, Furniture } from "../../../common"

export type PositionedObject = {obj: Character | Furniture, location: [number, number], flipped: boolean}

export type SectorConfiguration = 
    Record<string, PositionedObject>