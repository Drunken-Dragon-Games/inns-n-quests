import { DataTypes, Model, Sequelize } from "sequelize"
import { CreateSyncedAsset } from "./models"
import { relevantPolicies } from "./dsl"
import { AssetClass } from "../models"

export const syncedAssetTablename = "collection_assets"

export class SyncedAsset extends Model implements CreateSyncedAsset {
    declare asset_id: string
    declare userId: string
    declare assetRef: string
    declare quantity: string
    declare policyName: typeof relevantPolicies[number]
    declare type: "Character" | "Furniture"
    declare class: AssetClass
    declare ath: number
    declare int: number
    declare cha: number
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
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ath: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    int: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cha: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}

export const syncedMortalAssetTablename = "collection_mortal_assets"

export class SyncedMortalAsset extends Model implements CreateSyncedAsset {
    declare asset_id: string
    declare userId: string
    declare assetRef: string
    declare quantity: string
    declare policyName: typeof relevantPolicies[number]
    declare type: "Character" | "Furniture"
    declare class: AssetClass
    declare ath: number
    declare int: number
    declare cha: number
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
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ath: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    int: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cha: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
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
