import { DataTypes, Model, Sequelize } from "sequelize"
import { Token } from "../models"

export const cartTableName = "asset_store_aot_carts"

export type CreateAOTCart = {
    buyerAddress: string
    adaDepositTxId: string
    assets: Token[]
    contractId: string
}

export class AOTStoreCart extends Model implements CreateAOTCart{
    declare cartId: string
    declare buyerAddress: string
    declare adaDepositTxId: string
    declare assets: Token[]
    declare contractId: string
}

export const aotStoreCartTableAttributes = {
    cartId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    buyerAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adaDepositTxId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assets: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false
    },
    contractId: {
        type: DataTypes.STRING,
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