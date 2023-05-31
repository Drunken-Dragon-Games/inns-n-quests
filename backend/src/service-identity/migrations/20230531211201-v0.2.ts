import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { TransactionVerificationStateTableAttributes, TransactionVerificationStateTableName } from '../cardano/signature-verification-db';

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
  await query.createTable(TransactionVerificationStateTableName, addSequelizeColumns(TransactionVerificationStateTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(TransactionVerificationStateTableName, options)
}