import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn('adventurers', 'type', {
    type: DataTypes.STRING
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('adventurers', 'type');
}
