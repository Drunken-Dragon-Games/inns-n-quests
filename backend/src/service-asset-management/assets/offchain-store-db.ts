import { DataTypes, Model, Sequelize } from "sequelize"

export interface IOffChainStore {
    offChainStoreId: string,
    userId: string,
    policyId: string,
    unit: string,
    quantity: string 
}

export class OffChainStore extends Model implements IOffChainStore {
    declare offChainStoreId: string
    declare userId: string
    declare policyId: string
    declare unit: string
    declare quantity: string 
}

export const OffChainStoreTableName = "asset_management_offchain_store"

export const OffChainStoreTableAttributes = {
    OffChainStoreId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    }, 
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
    }, 
    policyId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    }, 
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    }, 
    quantity: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: false,
    }, 
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    OffChainStore.init(OffChainStoreTableAttributes, {
        sequelize, 
        modelName: 'OffChainStore', 
        tableName: OffChainStoreTableName
    })
}
