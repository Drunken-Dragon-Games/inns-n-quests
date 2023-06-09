import { QueryInterface } from 'sequelize'
import { UserTableAttributes, UserTableName } from '../users/users-db';

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
  try {
  await query.addColumn(UserTableName, 'discordUserId', UserTableAttributes.discordUserId)
  } catch (_) {}
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.removeColumn(UserTableName, 'discordUserId')
}