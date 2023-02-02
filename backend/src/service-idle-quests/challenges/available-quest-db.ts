import { DataTypes, Model, Sequelize } from "sequelize"

export type IAvailableQuestDB = {
    questId: string,
    userId: string,
    name: string,
    description: string,
    requirements: string,
    adventurerSlots: number,
}

export class AvailableQuestDB extends Model implements IAvailableQuestDB {
    declare questId: string
    declare userId: string
    declare name: string
    declare description: string
    declare requirements: string
    declare adventurerSlots: number
}

export const AvailableQuestDBTableName = "idle_quests_available_quests"

export const AvailableQuestDBTableAttributes = {
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
    adventurerSlots: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}

export function configureSequelizeModel(sequelize: Sequelize): void {
    AvailableQuestDB.init(AvailableQuestDBTableAttributes, {
        sequelize,
        tableName: AvailableQuestDBTableName
    })
}
