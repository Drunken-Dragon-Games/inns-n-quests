import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { SignatureVerificationStateTableAttributes, SignatureVerificationStateTableName } from '../cardano/signature-verification-db';
import { StoredSessionTableAttributes, StoredSessionTableName } from '../sessions/session-db';
import { UserStakeAddressTableName, UserStakeAdressTableAttributes, UserTableAttributes, UserTableName } from '../users/users-db';

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
  await query.createTable(UserTableName, addSequelizeColumns(UserTableAttributes))
  await query.addIndex(UserTableName, ["nickname"])
  await query.createTable(UserStakeAddressTableName, addSequelizeColumns(UserStakeAdressTableAttributes))
  await query.addIndex(UserStakeAddressTableName, ["userId"])
  await query.addIndex(UserStakeAddressTableName, ["stakeAddress"])
  await query.createTable(StoredSessionTableName, addSequelizeColumns(StoredSessionTableAttributes))
  await query.addIndex(StoredSessionTableName, ["userId"])
  await query.createTable(SignatureVerificationStateTableName, addSequelizeColumns(SignatureVerificationStateTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(UserTableName, options)
  await query.dropTable(UserStakeAddressTableName, options)
  await query.dropTable(StoredSessionTableName, options)
  await query.dropTable(SignatureVerificationStateTableName, options)
}