import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn('adventurers', 'level')
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn('adventurers', 'level', {
    type: DataTypes.STRING
  })
}

