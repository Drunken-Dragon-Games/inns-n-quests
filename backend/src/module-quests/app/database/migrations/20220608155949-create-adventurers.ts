import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('adventurers', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
  },
  on_chain_ref: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
  },
  experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
  },
  in_quest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
  },
  player_stake_address: {
    type: DataTypes.STRING,
    references: {
      model: {
        tableName: "players"
      },
      key: 'staking_address'
    },
    allowNull: false
  }
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('adventurers')
}

