import { MigrationFun, addDateReferenceColumns } from '../../tools-database'
import { FurnitureDBTableAttributes, FurnitureDBTableName } from '../items/furniture-db'

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(FurnitureDBTableName, addDateReferenceColumns(FurnitureDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(FurnitureDBTableName, options)
}