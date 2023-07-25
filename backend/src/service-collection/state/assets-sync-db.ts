import { DataTypes, Model, Sequelize } from "sequelize"
import { CreateSyncedAsset } from "./models"

export const syncedAssetTablename = "collection_assets"

export class SyncedAsset extends Model implements CreateSyncedAsset {
    declare assetId: string
    declare userId: string
    declare assetRef: string
    declare quantity: string
    declare policyName: string
    declare type: "Character" | "Furniture"
}

export const syncedAssetTableAttributes = {
    assetId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    assetRef: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    policyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["Character", "Furniture"]]
        }
    }
}

export const configureSequelizeModel =  (sequelize: Sequelize): void => {
    SyncedAsset.init(syncedAssetTableAttributes, {
        sequelize,
        modelName: "SyncedAsset",
        tableName: syncedAssetTablename
    })
}
