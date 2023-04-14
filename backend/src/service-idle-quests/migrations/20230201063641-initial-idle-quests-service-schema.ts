import { addDateReferenceColumns, MigrationFun } from '../../tools-database.js'
import { CharacterDBInfo } from '../state/character-state.js'
import { ActiveEncounterDBInfo } from '../state/encounter-state.js'
import { FurnitureDBInfo } from '../state/furniture-state.js'
import { SectorDBInfo } from '../state/sector-state.js'
import { TakenStakingQuestDBInfo } from '../state/taken-staking-quest-state.js'

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(CharacterDBInfo.tableName, addDateReferenceColumns(CharacterDBInfo.tableAttributes))
  await query.createTable(TakenStakingQuestDBInfo.tableName, addDateReferenceColumns(TakenStakingQuestDBInfo.tableAttributes))
  await query.createTable(SectorDBInfo.tableName, addDateReferenceColumns(SectorDBInfo.tableAttributes))
  await query.createTable(FurnitureDBInfo.tableName, addDateReferenceColumns(FurnitureDBInfo.tableAttributes))
  await query.createTable(ActiveEncounterDBInfo.tableName, addDateReferenceColumns(ActiveEncounterDBInfo.tableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(CharacterDBInfo.tableName, options)
  await query.dropTable(TakenStakingQuestDBInfo.tableName, options)
  await query.dropTable(SectorDBInfo.tableName, options)
  await query.dropTable(FurnitureDBInfo.tableName, options)
  await query.dropTable(ActiveEncounterDBInfo.tableName, options)
}
