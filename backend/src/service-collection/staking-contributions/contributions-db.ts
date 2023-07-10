import { DataTypes, Model, Sequelize } from "sequelize"

export const dailyContributionsTableName = "collection_daily_contributions"
export const weeklyContributionsTableName = "collection_weekly_contributions"

export class DailyContribution extends Model {
    declare dailyContributionId: string
    declare contribution: string
    declare userId: string
    declare weeklyContributionId? : string
}

export const dailyContributionTableAttributes = {
    dailyContributionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    contribution: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    weeklyContributionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: weeklyContributionsTableName,
            key: 'weeklyContributionId',
        },
    },
}

export class WeeklyContribution extends Model {
    declare weeklyContributionId: string
    declare contribution: string
    declare userId: string
    declare addDailyContributions: (xs: DailyContribution[]) => Promise<void>
}

export const weeklyContributionTableAttributes = {
    weeklyContributionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    contribution: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    DailyContribution.init(dailyContributionTableAttributes, {
        sequelize,
        modelName: "dailyContribution",
        tableName: dailyContributionsTableName
    })

    WeeklyContribution.init(weeklyContributionTableAttributes, {
        sequelize, 
        modelName: 'weeklyContribution', 
        tableName: weeklyContributionsTableName
    })

    WeeklyContribution.hasMany(DailyContribution, {
        foreignKey: "weeklyContributionId",
        onDelete: "CASCADE"
    })

    DailyContribution.belongsTo(WeeklyContribution, {
        foreignKey: "weeklyContributionId"
    })
}