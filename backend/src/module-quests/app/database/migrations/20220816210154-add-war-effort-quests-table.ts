import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('war_effort_quests', {
    quest_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: {
          tableName: "quests"
        },
        key: 'id'
      }
    },
    reward_wep: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('war_effort_quests');
}
