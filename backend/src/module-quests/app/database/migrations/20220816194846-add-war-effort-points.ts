import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn('players', 'war_effort_points', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('players', 'war_effort_points');
}

