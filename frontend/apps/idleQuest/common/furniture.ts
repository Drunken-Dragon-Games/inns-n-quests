
export type Furniture = {
    ctype: "furniture"
    furnitureId: string
    userId: string
    name: string
    collection: FurnitureCollection 
    assetRef: string
    sprite: string
}

export type FurnitureCollection = "pixel-tiles"

export const furnitureCollections = ["pixel-tiles"]

export const tagFurniture = (furniture: any): any =>
    furniture.furnitureId ? ({...furniture, ctype: "furniture" }) : furniture 
