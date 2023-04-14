import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('players', {
    staking_address: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    dragon_silver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('players')
}