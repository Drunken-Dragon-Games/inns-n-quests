import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { LeaderboardDBTableAttributes, LeaderboardDBTableName } from '../leaderboard/leaderboard-db'

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

const addSequelizeColumns = (tableAttributes: ModelAttributes<any, any>): ModelAttributes<any, any> => {
  return { 
    ...tableAttributes, 
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }
}

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(LeaderboardDBTableName, addSequelizeColumns(LeaderboardDBTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  await query.dropTable(LeaderboardDBTableName)
}