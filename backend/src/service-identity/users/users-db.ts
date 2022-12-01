import { DataTypes, Model, Sequelize } from "sequelize"

export interface IUser {
    userId: string,
    discordUserName: string,
    email: string,
    claimableDragonSilver: number,
    imageLink: string,
    nickname: string,
    nameIdentifier: string
    discordRefreshToken: string;
}

export class User extends Model implements IUser {
    declare userId: string
    declare discordUserName: string
    declare email: string
    declare claimableDragonSilver: number;
    declare imageLink: string;
    declare nickname: string;
    declare nameIdentifier: string;
    declare discordRefreshToken: string;
}

export const UserTableName = "users"

export interface IUserStakeAdress {
    id: string,
    userId: string,
    stakeAddress: string
}

export class UserStakeAdress extends Model implements IUserStakeAdress {
    declare id: string;
    declare userId: string;
    declare stakeAddress: string;
}

export const UserStakeAddressTableName = "user_stake_addresses"

export const UserStakeAdressTableAttributes = {
    id: {
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
        unique: true,
    },
    stakeAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}

export const UserTableAttributes = {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    discordUserName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    claimableDragonSilver: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imageLink: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: "https://i0.wp.com/nerdarchy.com/wp-content/uploads/2016/11/uxGJvYh.png?resize=300%2C225&ssl=1",
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    nameIdentifier: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    discordRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    UserStakeAdress.init(UserStakeAdressTableAttributes, {
        sequelize,
        modelName: "UserStakeAddress",
        tableName: UserStakeAddressTableName
    })

    User.init(UserTableAttributes, {
        sequelize, 
        modelName: 'User', 
        tableName: UserTableName
    })

    User.hasMany(UserStakeAdress, {
        foreignKey: "userId",
        onDelete: "CASCADE"
    })

    UserStakeAdress.belongsTo(User, {
        foreignKey: "userId"
    })
}
