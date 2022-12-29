import { DataTypes } from 'sequelize'
import { Migration } from '../migration_scripts/migrate'

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn('war_effort_quests', 'faction_id', {
    type: DataTypes.UUID,
    references: {
      model: {
        tableName: "war_effort_factions"
      },
      key: 'id'
    },
    allowNull: false
  })
  await sequelize.getQueryInterface().addColumn('war_effort_quests', 'war_effort_id', {
    type: DataTypes.UUID,
    references: {
      model: {
        tableName: "war_efforts"
      },
      key: 'id'
    },
    allowNull: false
  })
}

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('war_effort_quests', 'faction_id');
  await sequelize.getQueryInterface().removeColumn('war_effort_quests', 'war_effort_id');
}