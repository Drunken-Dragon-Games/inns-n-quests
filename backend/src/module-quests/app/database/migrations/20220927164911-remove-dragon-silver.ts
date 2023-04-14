import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn('players', 'dragon_silver')
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn('players', 'dragon_silver', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
}

