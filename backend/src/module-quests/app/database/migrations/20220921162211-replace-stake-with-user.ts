import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().renameColumn('players', 'staking_address', 'user_id')
  await sequelize.getQueryInterface().renameColumn('adventurers', 'player_stake_address', 'user_id')
  await sequelize.getQueryInterface().renameColumn('taken_quests', 'player_stake_address', 'user_id')
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().renameColumn('players', 'user_id', 'staking_address')
  await sequelize.getQueryInterface().renameColumn('adventurers', 'user_id', 'player_stake_address')
  await sequelize.getQueryInterface().renameColumn('taken_quests', 'user_id', 'player_stake_address')
}

