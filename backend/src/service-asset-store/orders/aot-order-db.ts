import { DataTypes, Model, Sequelize } from "sequelize"
import { OrderState, SuportedWallet, Token } from "../models"

export const ordersTableName = "asset_store_aot_orders"

export type CreateAOTOrder = {
    buyerAddress: string
    adaDepositTxId: string
    assets: Token[]
    //contractId: string
    //browserWallet: string
}

export class AOTStoreOrder extends Model implements CreateAOTOrder{
    declare orderId: string
    declare buyerAddress: string
    declare adaDepositTxId: string
    declare assets: Token[]
    /* declare contractId: string
    declare browserWallet: SuportedWallet */
    declare orderState: OrderState
    declare createdAt: string
}

type OrderStateArray = Array<OrderState>
const orderStates: OrderStateArray = ["created", "order_completed", "order_submition_failed", "order_timed_out", "transaction_submited"]

export const aotStoreOrderTableAttributes = {
    orderId: {
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
        modelName: "AOTStoreOrder",
        tableName: ordersTableName
    })
}