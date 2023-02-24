import { addDateReferenceColumns, MigrationFun } from '../../tools-database'
import { TakenQuestDBTableAttributes, TakenQuestDBTableName } from '../challenges/taken-quest-db'
import { AdventurerDBTableAttributes, AdventurerDBTableName } from '../items/adventurer-db'

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(AdventurerDBTableName, addDateReferenceColumns(AdventurerDBTableAttributes))
  await query.createTable(TakenQuestDBTableName, addDateReferenceColumns(TakenQuestDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(AdventurerDBTableName, options)
  await query.dropTable(TakenQuestDBTableName, options)
}