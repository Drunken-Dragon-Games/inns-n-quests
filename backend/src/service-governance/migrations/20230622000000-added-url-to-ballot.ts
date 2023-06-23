import { QueryInterface } from 'sequelize'
import { BallotTableAttributes, BallotTableName } from '../ballots/ballots-db'

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
    try { await query.addColumn(BallotTableName, 'url', BallotTableAttributes.url) } catch (_) { }
}

export const down: MigrationFun = async ({ context: query }) => {
    await query.removeColumn(BallotTableName, 'url')
}
