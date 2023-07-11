import { DataTypes, Model, Sequelize } from "sequelize"

export const dailyRecordsTableName = "collection_daily_records"
export const weeklyRecordsTableName = "collection_weekly_records"

export class DailyRecord extends Model {
    declare dailyRecordId: string
    declare rewardTotal: string
    declare createdAt: string
    declare weeklyRecordId? : string
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
    },
    weeklyRecordId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: weeklyRecordsTableName,
            key: 'weeklyRecordId',
        },
    },
}

export class WeeklyRecord extends Model {
    declare weeklyRecordId: string
    declare rewardTotal: string
    declare addDailyRecords: (xs: DailyRecord[]) => Promise<void>
}

export const weeklyRecordTableAttributes = {
    weeklyRecordId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    rewardTotal: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    DailyRecord.init(dailyRecordTableAttributes, {
        sequelize,
        modelName: "dailyRecord",
        tableName: dailyRecordsTableName
    })

    WeeklyRecord.init(weeklyRecordTableAttributes, {
        sequelize, 
        modelName: 'weeklyRecord', 
        tableName: weeklyRecordsTableName
    })

    WeeklyRecord.hasMany(DailyRecord, {
        foreignKey: "weeklyRecordId",
        onDelete: "CASCADE"
    })

    DailyRecord.belongsTo(WeeklyRecord, {
        foreignKey: "weeklyRecordId"
    })
}