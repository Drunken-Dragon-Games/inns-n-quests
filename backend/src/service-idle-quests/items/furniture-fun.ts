import { MetadataRegistry } from "../../registry-metadata"
import { WellKnownPolicies } from "../../registry-policies"
import { Inventory } from "../../service-asset-management"
import { Furniture, FurnitureCollection } from "../models"
import { FurnitureDB } from "./furniture-db"
import { InventoryAsset, syncData } from "./sync-fun"

export default class FurnitureFun {

    constructor(
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies
    ) { }

    /**
     * Syncs the user's current inventory furniture with the asset inventory.
     * The asset inventory comes from querying the Asset Management Service, and is a list of all the assets the user owns, in-chain or off-chain.
     * 
     * @param userId 
     * @param assetInventory 
     * @returns 
     */
    async syncFurniture(userId: string, assetInventory: Inventory): Promise<Furniture[]> {
        
        const pickInventoryFurniture = (assetInventory: Inventory): InventoryAsset<FurnitureCollection>[] => {
            const pxs: InventoryAsset<FurnitureCollection>[] = (assetInventory[this.wellKnownPolicies.pixelTiles.policyId] ?? [])
                .filter( pxt => 
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type !== "Adventurer" &&
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type !== "Monster" &&
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type !== "Townsfolk" 
                )
                .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
            // This is coded like this for when extended for other furniture. See the adventurers sync for reference.
            return [...pxs]
        }

        const preSyncedFurniture: Furniture[] = (await FurnitureDB.findAll({ where: { userId } })).map(data => data.dataValues)
        //const preSyncedFurniture: Furniture[] = preSyncedDBFurniture.map(adventurer => adventurer.dataValues)
        const assetInventoryFurniture = pickInventoryFurniture(assetInventory)
        const { toCreate, toDelete, surviving } = syncData(preSyncedFurniture, assetInventoryFurniture, furniture => furniture.assetRef)
        const createdFurniture = await this.createFurniture(userId, toCreate)
        await this.deleteFurniture(toDelete.map(furniture => furniture.furnitureId))
        return this.addSpritesToFurniture(createdFurniture.concat(surviving))
    }

    /**
     * Creates furniture in the database without any checks. 
     * 
     * @param userId 
     * @param furnitureToCreate 
     */
    async createFurniture(userId: string, furnitureToCreate: InventoryAsset<FurnitureCollection>[]): Promise<Furniture[]> {
        if (furnitureToCreate.length == 0) return []

        const furnitureName = (furniture: InventoryAsset<FurnitureCollection>): string => {
            if (furniture.collection == "pixel-tiles") {
                const name = this.metadataRegistry.pixelTilesMetadata[furniture.assetRef].name
                const realName = (name.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2] 
                return realName
            } else {
                return furniture.assetRef
            }
        }

        const furniture = furnitureToCreate.flatMap(furniture => 
            [...Array(furniture.quantity)].map(() =>
                ({ ...furniture, userId, name: furnitureName(furniture) })))
        const createdFurniture = await FurnitureDB.bulkCreate(furniture)
        return createdFurniture.map(furniture => furniture.dataValues)
    }

    /**
     * Deletes furniture from the database without any checks.
     * 
     * @param furnitureIds 
     * @returns 
     */
    async deleteFurniture(furnitureIds: string[]): Promise<void> {
        if (furnitureIds.length == 0) return
        await FurnitureDB.destroy({ where: { furnitureId: furnitureIds } })
    }

    /**
     * Computes the sprite image url for each adventurer in the given array and adds it to the adventurer object.
     * 
     * @param furniture 
     * @returns 
     */
    private addSpritesToFurniture(furniture: Furniture[]): Furniture[] {

        const pixeltileSprite = (furniture: Furniture): string => {
            return `https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_${furniture.assetRef.replace("PixelTile", "")}.png`
        }

        const withSprites: Furniture[] = furniture.map(furniture => {
            switch (furniture.collection) {
                case "pixel-tiles": return { ...furniture, sprite: pixeltileSprite(furniture) }
            }
        })

        return withSprites
    }

}
