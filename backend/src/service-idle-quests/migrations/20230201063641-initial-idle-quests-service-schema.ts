import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { TakenQuestDBTableName, TakenQuestDBTableAttributes } from '../challenges/taken-quest-db'
import { AdventurerDBTableAttributes, AdventurerDBTableName } from '../items/adventurer-db'

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
  await query.createTable(AdventurerDBTableName, addSequelizeColumns(AdventurerDBTableAttributes))
  await query.createTable(TakenQuestDBTableName, addSequelizeColumns(TakenQuestDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(AdventurerDBTableName, options)
  await query.dropTable(TakenQuestDBTableName, options)
}