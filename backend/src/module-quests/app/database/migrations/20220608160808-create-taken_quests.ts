import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('taken_quests', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
  },
  started_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
  },
  state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "in_progress"
  },
  is_claimed: {
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
  },
  quest_id: {
    type: DataTypes.UUID,
    references: {
        model: {
          tableName: "quests"
        },
        key: "id"
    }
}
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('taken_quests')
}

