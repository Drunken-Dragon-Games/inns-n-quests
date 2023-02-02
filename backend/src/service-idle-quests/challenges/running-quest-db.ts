import { DataTypes, Model, Sequelize } from "sequelize"

export type IRunningQuestDB = {
    questId: string,
    userId: string,
    name: string,
    description: string,
    requirements: string,
    adventurerIds: string[],
}

export class RunningQuestDB extends Model implements IRunningQuestDB {
    declare questId: string
    declare userId: string
    declare name: string
    declare description: string
    declare requirements: string
    declare adventurerIds: string[]
}

export const RunningQuestDBTableName = "idle_quests_running_quests"

export const RunningQuestDBTableAttributes = {
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
    RunningQuestDB.init(RunningQuestDBTableAttributes, {
        sequelize,
        tableName: RunningQuestDBTableName
    })
}