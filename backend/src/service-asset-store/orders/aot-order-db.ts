import { DataTypes, Model, Sequelize } from "sequelize"
import { OrderState, SuportedWallet, Token } from "../models"

export const ordersTableName = "asset_store_aot_orders"

export type CreateAOTOrder = {
    userId: string
    buyerAddress: string
    adaDepositTxId: string
    assets: Token[]
    //contractId: string
    //browserWallet: string
}

export class AOTStoreOrder extends Model implements CreateAOTOrder{
    declare orderId: string
    declare userId: string
    declare buyerAddress: string
    declare adaDepositTxId: string
    declare assets: Token[]
    /* declare contractId: string
    declare browserWallet: SuportedWallet */
    declare orderState: OrderState
}

type OrderStateArray = Array<OrderState>
const orderStates: OrderStateArray = ["created", "transaction_confirmed","order_completed"]

export const aotStoreOrderTableAttributes = {
    orderId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
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
    ,
    browserWallet: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderState: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "created",
        validate: {
            isIn: [orderStates]
        }
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    AOTStoreOrder.init(aotStoreOrderTableAttributes, {
        sequelize,
        modelName: "AOTStoreCart",
        tableName: ordersTableName
    })
}