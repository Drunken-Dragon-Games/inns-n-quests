import { QueryInterface } from 'sequelize'
import { ConfigDBTableAttributes, ConfigDBTableName } from '../config/config-db'

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
  await query.addColumn(ConfigDBTableName, 'leaderboardNotificationChannelId', ConfigDBTableAttributes.leaderboardNotificationChannelId)
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.removeColumn(ConfigDBTableName, 'leaderboardNotificationChannelId')
}