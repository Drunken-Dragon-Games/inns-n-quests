
export type SectorState = {
    sectorId: string
    name: string
    objectLocations: ObjectsLocations
}

export type ObjectsLocations = Record<string, [number, number]>
