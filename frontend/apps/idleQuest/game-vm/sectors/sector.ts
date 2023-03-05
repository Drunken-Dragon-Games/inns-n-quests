
export type Sector = {
    sectorId: string
    name: string
    objectLocations: ObjectsLocations
}

export type ObjectsLocations = Record<string, [number, number]>
