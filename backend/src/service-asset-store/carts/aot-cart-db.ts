import { DataTypes, Model, Sequelize } from "sequelize"
import { Token } from "../models"

export const cartTableName = "asset_store_aot_carts"

export type CreateAOTCart = {
    cartId: string
    buyAddress: string
    AdaDepositTxId: string
    Assets: Token[]
}

export class AOTStoreCart extends Model implements CreateAOTCart{
    declare cartId: string
    declare buyAddress: string
    declare AdaDepositTxId: string
    declare Assets: Token[]
}

export const aotStoreCartTableAttributes = {
    cartId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    buyAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AdaDepositTxId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Assets: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    AOTStoreCart.init(aotStoreCartTableAttributes, {
        sequelize,
        modelName: "AOTStoreCart",
        tableName: cartTableName
    })
}