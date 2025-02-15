import { QueryInterface } from 'sequelize'
import { TransactionVerificationStateTableAttributes, TransactionVerificationStateTableName } from '../cardano/signature-verification-db';

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

// TODO: Remove this migration? We messed up the previous one, so we need to fix it.
export const up: MigrationFun = async ({ context: query }) => {
  try {
    await query.removeColumn(TransactionVerificationStateTableName, 'txId')
    await query.addColumn(TransactionVerificationStateTableName, 'txHash', TransactionVerificationStateTableAttributes.txHash)
    await query.addColumn(TransactionVerificationStateTableName, 'state', TransactionVerificationStateTableAttributes.state)
  } catch (e: any) {
    //console.error(e)
  }
}

export const down: MigrationFun = async ({ context: query }) => {
  //TODO
}