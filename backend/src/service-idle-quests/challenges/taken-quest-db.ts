import { DataTypes, Model, Sequelize } from "sequelize"

export type ITakenQuestDB = {
    questId: string,
    userId: string,
    name: string,
    description: string,
    requirements: string,
    adventurerIds: string[],
}

export class TakenQuestDB extends Model implements ITakenQuestDB {
    declare questId: string
    declare userId: string
    declare name: string
    declare description: string
    declare requirements: string
    declare adventurerIds: string[]
}

export const TakenQuestDBTableName = "idle_quests_taken_quests"

export const TakenQuestDBTableAttributes = {
    questId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requirements: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adventurerIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false
    }
}

export function configureSequelizeModel(sequelize: Sequelize): void {
    TakenQuestDB.init(TakenQuestDBTableAttributes, {
        sequelize,
        tableName: TakenQuestDBTableName
    })
}