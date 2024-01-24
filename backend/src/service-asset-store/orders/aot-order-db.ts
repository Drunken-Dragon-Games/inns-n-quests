import { DataTypes, Model, Sequelize } from "sequelize"
import { OrderState, RefoundState, SuportedWallet, Token } from "../models"
import { CardanoTransactionInfo } from "../../service-blockchain/models"

export const ordersTableName = "asset_store_aot_orders"

export type CreateAOTOrder = {
    buyerAddress: string
}

export class AOTStoreOrder extends Model implements CreateAOTOrder{
    declare orderId: string
    declare buyerAddress: string
    declare adaDepositTx: CardanoTransactionInfo | null
    declare assetsDepositTx: CardanoTransactionInfo | null
    declare refoundTx: CardanoTransactionInfo | null
    declare assets: Token[] | null
    declare orderState: OrderState
    declare createdAt: string
    declare refoundState: RefoundState
}

type OrderStateArray = Array<OrderState>
const orderStates: OrderStateArray = [
    'empty' , 
    'intialized' , 
    'ada_deposit_submited' , 
    'ada_deposit_failed' , 
    'ada_deposit_timedOut' , 
    'assets_deposit_submited' , 
    'assets_deposit_failed' , 
    'assets_deposit_timedOut', 
    'order_completed'
]

const refoundStatesArray: RefoundState[] = [
    'completed' ,
    'failed' ,
    'submited',
    'timedout' ,
    'initialized' ,
    'none'
]

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
    adaDepositTx: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    assetsDepositTx: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    refoundTx: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    assets: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true
    },
    orderState: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "empty",
        validate: {
            isIn: [orderStates]
        }
    }
    ,
    refoundState: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "none",
        validate: {
            isIn: [refoundStatesArray]
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