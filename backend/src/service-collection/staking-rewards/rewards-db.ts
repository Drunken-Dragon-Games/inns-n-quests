import { DataTypes, Model, Sequelize } from "sequelize"

export const dailyRewardsTableName = "collection_daily_rewards"
export const weeklyRewardsTableName = "collection_weekly_rewards"

export class DailyReward extends Model {
    declare dailyRewardId: string
    declare reward: string
    declare userId: string
}

export const dailyRewardTableAttributes = {
    dailyRewardId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    reward: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    created: {
        allowNull: false,
        type: DataTypes.DATE
      },
}

export class WeeklyReward extends Model {
    declare weeklyRewardId: string
    declare reward: string
    declare userId: string
}

export const weeklyRewardTableAttributes = {
    weeklyRewardId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    reward: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    WeeklyReward.init(weeklyRewardTableAttributes, {
        sequelize, 
        modelName: 'weeklyReward', 
        tableName: weeklyRewardsTableName,
    })

    DailyReward.init(dailyRewardTableAttributes, {
        sequelize,
        modelName: "dailyReward",
        tableName: dailyRewardsTableName,
    })
}