import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('claimed_dragon_silver')
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('claimed_dragon_silver', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    stake_address: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "players"
          },
          key: 'staking_address'
        }
    },
    dragon_silver: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["created", "submitted", "confirmed", "timed_out"]]
      }
    },
    tx_hash: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    tx_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  })
}


