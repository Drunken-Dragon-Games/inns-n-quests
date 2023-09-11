import { DataTypes, Model, Sequelize } from "sequelize"

export const dailyRecordsTableName = "collection_daily_records"
export const weeklyRecordsTableName = "collection_weekly_records"

export class DailyRecord extends Model {
    declare dailyRecordId: string
    declare rewardTotal: string
}

export const dailyRecordTableAttributes = {
    dailyRecordId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    rewardTotal: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}

export class WeeklyRecord extends Model {
    declare weeklyRecordId: string
    declare rewardTotal: string
}

export const weeklyRecordTableAttributes = {
    weeklyRecordId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    rewardTotal: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    WeeklyRecord.init(weeklyRecordTableAttributes, {
        sequelize, 
        modelName: 'weeklyRecord', 
        tableName: weeklyRecordsTableName,
    })

    DailyRecord.init(dailyRecordTableAttributes, {
        sequelize,
        modelName: "dailyRecord",
        tableName: dailyRecordsTableName,
    })
}