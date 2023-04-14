import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().changeColumn('enrolls', 'taken_quest_id', {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
          model: {
            tableName: "taken_quests"
          },
          key: 'id'
      }
  })
  await sequelize.getQueryInterface().changeColumn('enrolls', 'adventurer_id', {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      unique: true,
      primaryKey: true,
      references: {
          model: {
            tableName: "adventurers"
          },
          key: "id"
      }
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().changeColumn('enrolls', 'taken_quest_id', {
      type: DataTypes.UUID,
      references: {
          model: {
            tableName: "taken_quests"
          },
          key: 'id'
      }
  })
  await sequelize.getQueryInterface().changeColumn('enrolls', 'adventurer_id', {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      references: {
          model: {
            tableName: "adventurers"
          },
          key: "id"
      }
  })
}
