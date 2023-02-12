import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { ConfigDBTableAttributes, ConfigDBTableName } from '../config/config-db'

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
  await query.createTable(ConfigDBTableName, addSequelizeColumns(ConfigDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.dropTable(ConfigDBTableName)
}