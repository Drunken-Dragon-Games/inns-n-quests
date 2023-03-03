import { MetadataRegistry } from "../../registry-metadata"
import { IQEntity } from "./iq-entity"

export type FurnitureEntity = IQEntity<"furniture-entity"> & {
    collection: FurnitureCollection 
}

export type FurnitureCollection 
    = "pixel-tiles"

export const FurnitureCollections: FurnitureCollection[] = 
    [ "pixel-tiles" ]

export const furnitureDefaultName = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: FurnitureCollection): string => {
    if (collection == "pixel-tiles") {
        const name = metadataRegistry.pixelTilesMetadata[assetRef].name
        const realName = (name.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2]
        return realName
    } else {
        return assetRef
    }
}

/**
 * Computes the sprite image url for each adventurer in the given array and adds it to the adventurer object.
 * 
 * @param furniture 
 * @returns 
 */
export const furnitureSprite = (assetRef: string, collection: FurnitureCollection): string => {

    const pixeltileSprite = (): string => {
        const name = assetRef === "PixelTile8" ? "PixelTile4" : assetRef
        return `https://cdn.ddu.gg/pixeltiles/x4/${name}.png`
    }

    switch (collection) {
        case "pixel-tiles": return pixeltileSprite()
    }
}