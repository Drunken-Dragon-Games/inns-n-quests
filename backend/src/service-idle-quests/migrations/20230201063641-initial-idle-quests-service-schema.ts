import { addDateReferenceColumns, MigrationFun } from '../../tools-database'
import { TakenQuestDBTableAttributes, TakenQuestDBTableName } from '../state/taken-quest-state'
import { CharacterDBTableAttributes, CharacterDBTableName } from '../state/character-state'
import { SectorDBTableAttributes, SectorDBTableName } from '../state/sector-state'
import { FurnitureDBTableName, FurnitureDBTableAttributes } from '../state/furniture-state'

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(CharacterDBTableName, addDateReferenceColumns(CharacterDBTableAttributes))
  await query.createTable(TakenQuestDBTableName, addDateReferenceColumns(TakenQuestDBTableAttributes))
  await query.createTable(SectorDBTableName, addDateReferenceColumns(SectorDBTableAttributes))
  await query.createTable(FurnitureDBTableName, addDateReferenceColumns(FurnitureDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(CharacterDBTableName, options)
  await query.dropTable(TakenQuestDBTableName, options)
  await query.dropTable(SectorDBTableName, options)
  await query.dropTable(FurnitureDBTableName, options)
}
