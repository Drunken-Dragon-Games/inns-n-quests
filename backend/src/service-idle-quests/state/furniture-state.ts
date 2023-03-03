import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
import { Furniture } from "../models"
import * as am from "../../service-asset-management"
import * as vm from "../game-vm"
import { MetadataRegistry } from "../../registry-metadata"
import { WellKnownPolicies } from "../../registry-policies"
import { syncData } from "./sync-util"

export type IFurnitureDB = Omit<
    vm.FurnitureEntity &
    vm.WithOwner,
    "entityType" |
    "collection"
>

export class FurnitureDB extends Model implements IFurnitureDB {
    declare entityId: string
    declare userId: string
    declare name: string
    declare assetRef: string
}

export const FurnitureDBTableName = "idle_quests_furniture"

export const FurnitureDBTableAttributes = {
    entityId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assetRef: {
        type: DataTypes.STRING,
        allowNull: false
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    FurnitureDB.init(FurnitureDBTableAttributes, {
        sequelize, 
        modelName: 'FurnitureDB', 
        tableName: FurnitureDBTableName
    })
}

interface InventoryFurniture {
    assetRef: string
    collection: vm.FurnitureCollection
    quantity: number
}

export default class FurnitureState {

    constructor(
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ) { }

    /**
     * Syncs the user's current inventory furniture with the asset inventory.
     * The asset inventory comes from querying the Asset Management Service, and is a list of all the assets the user owns, in-chain or off-chain.
     * 
     * @param userId 
     * @param assetInventory 
     * @returns 
     */
    async syncFurniture(userId: string, assetInventory: am.Inventory, transaction?: Transaction): Promise<Furniture[]> {
        
        const pickInventoryFurniture = (assetInventory: am.Inventory): InventoryFurniture[] => {
            const pxs: InventoryFurniture[] = (assetInventory[this.wellKnownPolicies.pixelTiles.policyId] ?? [])
                .filter( pxt => 
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type !== "Adventurer" &&
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type !== "Monster" &&
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type !== "Townsfolk" 
                )
                .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
            // This is coded like this for when extended for other furniture. See the adventurers sync for reference.
            return [...pxs]
        }

        const preSyncedFurniture: IFurnitureDB[] = (await FurnitureDB.findAll({ where: { userId } })).map(data => data.dataValues)
        //const preSyncedFurniture: Furniture[] = preSyncedDBFurniture.map(adventurer => adventurer.dataValues)
        const assetInventoryFurniture = pickInventoryFurniture(assetInventory)
        const { toCreate, toDelete, surviving } = syncData(preSyncedFurniture, assetInventoryFurniture)
        const createdFurniture = await this.bulkCreate(userId, toCreate, transaction)
        await this.bulkDelete(toDelete.map(f => f.entityId), transaction)
        return createdFurniture.concat(surviving.map(this.makeFurniture))
    }

    /**
     * Creates furniture in the database without any checks. 
     * 
     * @param userId 
     * @param toCreate 
     */
    async bulkCreate(userId: string, toCreate: InventoryFurniture[], transaction?: Transaction): Promise<Furniture[]> {
        if (toCreate.length == 0) return []
        const created = await FurnitureDB.bulkCreate(toCreate.flatMap(furniture => 
            [...Array(furniture.quantity)].map(() => this.makeFurnitureDB(userId, furniture))
        ), { transaction })
        return created.map(this.makeFurniture)
    }

    /**
     * Deletes furniture from the database without any checks.
     * 
     * @param furnitureIds 
     * @returns 
     */
    async bulkDelete(entityIds: string[], transaction?: Transaction): Promise<void> {
        if (entityIds.length == 0) return
        await FurnitureDB.destroy({ where: { entityId: entityIds }, transaction })
    }

    private makeFurniture(furniture: IFurnitureDB): Furniture {
        const collection = "pixel-tiles"
        return {
            entityType: "furniture-entity",
            entityId: furniture.entityId,
            userId: furniture.userId,
            name: furniture.name,
            assetRef: furniture.assetRef,
            collection,
            sprite: vm.furnitureSprite(furniture.assetRef, collection)
        }
    }

    private makeFurnitureDB(userId: string, furniture: InventoryFurniture): Omit<IFurnitureDB, "entityId"> {
        return {
            userId,
            name: vm.furnitureDefaultName(this.metadataRegistry)(furniture.assetRef, furniture.collection),
            assetRef: furniture.assetRef
        }
    }
}
