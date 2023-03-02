import { MigrationFun, addDateReferenceColumns } from '../../tools-database'
import { SectorDBTableAttributes, SectorDBTableName } from '../overworld/sector-db'

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(SectorDBTableName, addDateReferenceColumns(SectorDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(SectorDBTableName, options)
}
