import { DataTypes, Model, Sequelize } from "sequelize"
import { CreateSyncedAsset } from "./models"
import { relevantPolicies } from "./dsl"

export const syncedAssetTablename = "collection_assets"

export class SyncedAsset extends Model implements CreateSyncedAsset {
    declare asset_id: string
    declare userId: string
    declare assetRef: string
    declare quantity: string
    declare policyName: typeof relevantPolicies[number]
    declare type: "Character" | "Furniture"
}

export const syncedAssetTableAttributes = {
    asset_id: {
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

export const syncedMortalAssetTablename = "collection_mortal_assets"

export class SyncedMortalAsset extends Model implements CreateSyncedAsset {
    declare asset_id: string
    declare userId: string
    declare assetRef: string
    declare quantity: string
    declare policyName: typeof relevantPolicies[number]
    declare type: "Character" | "Furniture"
}

export const syncedMortalAssetTableAttributes = {
    asset_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
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
        modelName: "syncedAsset",
        tableName: syncedAssetTablename
    })

    SyncedMortalAsset.init(syncedMortalAssetTableAttributes, {
        sequelize,
        modelName: "syncedMortalAsset",
        tableName: syncedMortalAssetTablename
    })
}
