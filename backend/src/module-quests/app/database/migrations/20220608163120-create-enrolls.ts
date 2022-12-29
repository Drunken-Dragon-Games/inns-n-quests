import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('enrolls', {
    taken_quest_id: {
      type: DataTypes.UUID,
      references: {
          model: {
            tableName: "taken_quests"
          },
          key: 'id'
      }
  },
  adventurer_id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      references: {
          model: {
            tableName: "adventurers"
          },
          key: "id"
      }
  }
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('enrolls')
}
