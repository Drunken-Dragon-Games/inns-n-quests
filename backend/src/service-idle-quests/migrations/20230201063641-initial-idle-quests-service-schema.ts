import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { DBAdventurerTableAttributes, DBAdventurerTableName } from '../items/adventurer-db'

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
  await query.createTable(DBAdventurerTableName, addSequelizeColumns(DBAdventurerTableAttributes))
  await query.addIndex(DBAdventurerTableName, ["userId"])
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.dropTable(DBAdventurerTableName)
}