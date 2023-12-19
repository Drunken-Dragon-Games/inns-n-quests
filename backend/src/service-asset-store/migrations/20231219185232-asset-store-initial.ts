import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { ordersTableName, aotStoreOrderTableAttributes } from '../orders/aot-order-db'
import { storeAOTTableAttributes, invenotryTableName } from '../inventory/aot-invenotry-db'

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

const addSequelizeColumns = (tableAttributes: ModelAttributes<any, any>): ModelAttributes<any, any> => {
  return { 
    ...tableAttributes, 
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }
}

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(ordersTableName, addSequelizeColumns(aotStoreOrderTableAttributes))
  await query.createTable(invenotryTableName, addSequelizeColumns(storeAOTTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.dropTable(ordersTableName)
  await query.dropTable(invenotryTableName)
}