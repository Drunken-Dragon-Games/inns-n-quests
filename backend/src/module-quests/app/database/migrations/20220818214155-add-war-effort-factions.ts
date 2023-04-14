import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate.js'

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('war_effort_factions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    war_effort_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: "war_efforts"
        },
        key: 'id'
      },
      allowNull: false
    },
  });
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('war_effort_factions');
}