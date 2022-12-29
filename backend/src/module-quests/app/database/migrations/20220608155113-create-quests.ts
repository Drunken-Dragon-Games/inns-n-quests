import { DataTypes, QueryInterface } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'
import generateQuests from '../migration_scripts/quest_generation'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('quests', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reward_ds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reward_xp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rarity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}

export const down: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().dropTable('quests');
}
