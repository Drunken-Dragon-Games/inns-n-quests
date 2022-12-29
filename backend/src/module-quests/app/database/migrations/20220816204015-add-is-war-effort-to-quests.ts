import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'
import generateQuests from '../migration_scripts/quest_generation'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn('quests', 'is_war_effort', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('quests', 'is_war_effort');
}