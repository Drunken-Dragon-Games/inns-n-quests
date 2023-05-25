import { DataTypes, Model, Sequelize } from "sequelize"
import { DeviceType, AuthType } from "../models"
import { User, UserTableName } from "../users/users-db"

export interface IStoredSession {
    sessionId: string, 
    userId: string, 
    signedOn: number, 
    expiration: number,
    refreshToken: string,
    deviceType: DeviceType, 
    authType: AuthType,
}

export class StoredSession extends Model implements IStoredSession {
    declare sessionId: string
    declare userId: string 
    declare signedOn: number
    declare expiration: number
    declare refreshToken: string
    declare deviceType: DeviceType 
    declare authType: AuthType
}

export const StoredSessionTableName = "identity_stored_sessions"

export const StoredSessionTableAttributes = {
    sessionId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    }, 
    userId: {
        type: DataTypes.UUID,
        references: {
            model: {
            tableName: UserTableName
            },
            key: 'userId'
        },
        allowNull: false,
        unique: false,
    }, 
    signedOn: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }, 
    expiration: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    }, 
    deviceType: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    authType: {
        type: DataTypes.STRING,
        allowNull: false
    } 
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    StoredSession.init(StoredSessionTableAttributes, {
        sequelize, 
        modelName: 'StoredSession', 
        tableName: StoredSessionTableName
    })

    User.hasMany(StoredSession, {
        foreignKey: "userId",
        onDelete: "CASCADE"
    })

    StoredSession.belongsTo(User, {
        foreignKey: "userId"
    })
}