import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('players_to_verify', {
    stake_address: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
  },
  nonce: {
      type: DataTypes.STRING,
      allowNull: false
  }
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('players_to_verify')
}


