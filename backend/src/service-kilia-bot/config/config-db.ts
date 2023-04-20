import { DataTypes, Model, Sequelize } from "sequelize"

export interface IConfigDB {
    serverId: string
    questsNotificationChannelId?: string
    leaderboardNotificationChannelId?: string
    governanceAdminChannelId?: string
}

export class ConfigDB extends Model implements IConfigDB {
    declare serverId: string
    declare questsNotificationChannelId?: string
    declare leaderboardNotificationChannelId?: string
    declare governanceAdminChannelId?: string
}

export const ConfigDBTableName = "kilia_bot_config"

export const ConfigDBTableAttributes = {
    serverId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    questsNotificationChannelId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    leaderboardNotificationChannelId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    governanceAdminChannelId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    ConfigDB.init(ConfigDBTableAttributes, {
        sequelize, 
        modelName: 'ConfigDB', 
        tableName: ConfigDBTableName
    })
}

