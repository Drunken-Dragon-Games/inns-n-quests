import { DataTypes, Model, Sequelize } from "sequelize"

export interface ILeaderboardDB {
    userId: string
    questsSucceeded: number
}

export class LeaderboardDB extends Model implements ILeaderboardDB {
    declare userId: string
    declare questsSucceeded: number
}

export const LeaderboardDBTableName = "evenstats_leaderboard"

export const LeaderboardDBTableAttributes = {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    questsSucceeded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    LeaderboardDB.init(LeaderboardDBTableAttributes, {
        sequelize, 
        modelName: 'LeaderBoardDB', 
        tableName: LeaderboardDBTableName
    })
}


