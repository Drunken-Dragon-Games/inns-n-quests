import { QueryInterface } from 'sequelize'
import { TransactionVerificationStateTableAttributes, TransactionVerificationStateTableName } from '../cardano/signature-verification-db';

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
  try {
    await query.removeColumn(TransactionVerificationStateTableName, 'txId')
    await query.addColumn(TransactionVerificationStateTableName, 'rawTransaction', TransactionVerificationStateTableAttributes.rawTransaction)
    await query.addColumn(TransactionVerificationStateTableName, 'validFromSlot', TransactionVerificationStateTableAttributes.validFromSlot)
    await query.addColumn(TransactionVerificationStateTableName, 'validToSlot', TransactionVerificationStateTableAttributes.validToSlot)
    await query.addColumn(TransactionVerificationStateTableName, 'transferedAmmount', TransactionVerificationStateTableAttributes.transferedAmmount)
  } catch (_) {}
}

export const down: MigrationFun = async ({ context: query }) => {
  //TODO
}