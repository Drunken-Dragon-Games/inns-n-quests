import { DataTypes, Model, Sequelize } from "sequelize"
import { FurnitureCollection, furnitureCollections } from "../models"

export interface IFurnitureDB {
    furnitureId?: string
    userId: string
    name: string
    collection: FurnitureCollection 
    assetRef: string
}

export class FurnitureDB extends Model implements IFurnitureDB {
    declare furnitureId?: string
    declare userId: string
    declare name: string
    declare collection: FurnitureCollection 
    declare assetRef: string
}

export const FurnitureDBTableName = "idle_quests_furniture"

export const FurnitureDBTableAttributes = {
    furnitureId: {
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
    collection: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [furnitureCollections]
        }
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

