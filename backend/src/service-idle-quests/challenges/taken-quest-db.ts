import { DataTypes, Model, Sequelize } from "sequelize"

export type ITakenQuestDB = {
    takenQuestId: string,
    questId: string,
    userId: string,
    adventurerIds: string[],
    createdAt: Date,
}

export class TakenQuestDB extends Model implements ITakenQuestDB {
    declare takenQuestId: string
    declare questId: string
    declare userId: string
    declare adventurerIds: string[]
    declare createdAt: Date
}

export const TakenQuestDBTableName = "idle_quests_taken_quests"

export const TakenQuestDBTableAttributes = {
    takenQuestId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    questId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    adventurerIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
}

export function configureSequelizeModel(sequelize: Sequelize): void {
    TakenQuestDB.init(TakenQuestDBTableAttributes, {
        sequelize,
        tableName: TakenQuestDBTableName
    })
}