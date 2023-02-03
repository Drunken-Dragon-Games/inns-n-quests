import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { TakenQuestDBTableName, TakenQuestDBTableAttributes } from '../challenges/taken-quest-db'
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
  await query.createTable(TakenQuestDBTableName, addSequelizeColumns(TakenQuestDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.dropTable(DBAdventurerTableName)
  await query.dropTable(TakenQuestDBTableName)
}