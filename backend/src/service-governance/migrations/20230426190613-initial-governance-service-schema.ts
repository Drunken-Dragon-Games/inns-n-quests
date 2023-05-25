import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { BallotVotesTableName, BallotVoteTableAttributes, BallotTableAttributes, BallotTableName } from '../ballots/ballots-db';

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
  await query.createTable(BallotTableName, addSequelizeColumns(BallotTableAttributes))
  await query.createTable(BallotVotesTableName, addSequelizeColumns(BallotVoteTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(BallotTableName, options)
  await query.dropTable(BallotVotesTableName, options)
}