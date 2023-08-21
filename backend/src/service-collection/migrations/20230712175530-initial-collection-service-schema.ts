import { DataTypes, ModelAttributes, QueryInterface } from 'sequelize'
import { dailyRecordsTableName, dailyRecordTableAttributes, weeklyRecordsTableName, weeklyRecordTableAttributes } from '../staking-rewards/records-db'
import { dailyRewardsTableName, dailyRewardTableAttributes, weeklyRewardsTableName, weeklyRewardTableAttributes } from '../staking-rewards/rewards-db'
import { syncedAssetTableAttributes, syncedAssetTablename, syncedMortalAssetTableAttributes, syncedMortalAssetTablename } from '../state/assets-sync-db'

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
  await query.createTable(weeklyRecordsTableName, addSequelizeColumns(weeklyRecordTableAttributes))
  await query.createTable(weeklyRewardsTableName, addSequelizeColumns(weeklyRewardTableAttributes))
  await query.createTable(dailyRecordsTableName, addSequelizeColumns(dailyRecordTableAttributes))
  await query.createTable(dailyRewardsTableName, addSequelizeColumns(dailyRewardTableAttributes))
  await query.createTable(syncedAssetTablename, addSequelizeColumns(syncedAssetTableAttributes))
  await query.createTable(syncedMortalAssetTablename, addSequelizeColumns(syncedMortalAssetTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(dailyRecordsTableName, options)
  await query.dropTable(weeklyRecordsTableName, options)
  await query.dropTable(dailyRewardsTableName, options)
  await query.dropTable(weeklyRewardsTableName, options)
  await query.dropTable(syncedAssetTablename, options)
  await query.dropTable(syncedMortalAssetTablename, options)
}