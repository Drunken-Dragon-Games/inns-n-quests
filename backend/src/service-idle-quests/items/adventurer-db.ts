import { DataTypes, Model, Sequelize } from "sequelize"
import { Adventurer, AdventurerClass, adventurerClasses, AdventurerCollection, adventurerCollections, Race, races } from "../models"

export class AdventurerDB extends Model implements Adventurer {
    declare adventurerId?: string
    declare userId: string
    declare name: string
    declare class: AdventurerClass
    declare race: Race
    declare collection: AdventurerCollection
    declare assetRef: string
    declare hp: number
    declare inChallenge?: boolean
    declare athleticism: number
    declare intellect: number
    declare charisma: number
}

export const AdventurerDBTableName = "idle_quests_adventurers"

export const AdventurerDBTableAttributes = {
    adventurerId: {
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
    class: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [adventurerClasses]
        }
    },
    race: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [races]
        }
    },
    collection: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [adventurerCollections]
        }
    },
    assetRef: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inChallenge: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    athleticism: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    intellect: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    charisma: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    AdventurerDB.init(AdventurerDBTableAttributes, {
        sequelize, 
        modelName: 'AdventurerDB', 
        tableName: AdventurerDBTableName
    })
}
