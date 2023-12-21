import { DataTypes, Model, Sequelize } from "sequelize"
import { AssetState } from "../models"

//TODO: review table name
export const invenotryTableName = "asset_store_AOT_invenotry"

export class AOTStoreAsset extends Model {
    declare assetId: string
    declare state: AssetState
    declare contract: string | null
    declare tokenName: string
}

type AssetStateArray = Array<AssetState>
const assetStates: AssetStateArray = ["idle", "reserved", "sold"]

export const storeAOTTableAttributes = {
    assetId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "idle",
        validate: {
            isIn: [assetStates]
        }
    },
    contract: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tokenName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    AOTStoreAsset.init(storeAOTTableAttributes, {
        sequelize,
        modelName: "Store-AOTs",
        tableName: invenotryTableName
    })
}