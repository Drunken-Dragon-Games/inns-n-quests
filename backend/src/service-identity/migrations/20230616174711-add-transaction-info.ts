import { QueryInterface } from 'sequelize'
import { TransactionVerificationStateTableAttributes, TransactionVerificationStateTableName } from '../cardano/signature-verification-db';

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
  try {
    await query.removeColumn(TransactionVerificationStateTableName, 'txId')
    await query.addColumn(TransactionVerificationStateTableName, 'txHash', TransactionVerificationStateTableAttributes.txHash)
    await query.addColumn(TransactionVerificationStateTableName, 'state', TransactionVerificationStateTableAttributes.state)
  } catch (_) {}
}

export const down: MigrationFun = async ({ context: query }) => {
  //TODO
}