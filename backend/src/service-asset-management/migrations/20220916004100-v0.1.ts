import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { AssetClaimTableName, AssetClaimTableAttributes } from '../assets/asset-claim-db.js'
import { OffChainStoreTableName, OffChainStoreTableAttributes } from '../assets/offchain-store-db.js'

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
  await query.createTable(OffChainStoreTableName, addSequelizeColumns(OffChainStoreTableAttributes))
  await query.addIndex(OffChainStoreTableName, ["userId"])
  await query.createTable(AssetClaimTableName, addSequelizeColumns(AssetClaimTableAttributes))
  await query.addIndex(AssetClaimTableName, ["userId"])
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.dropTable(OffChainStoreTableName)
  await query.dropTable(AssetClaimTableName)
}