import { DataTypes, Model, Sequelize } from "sequelize"
import { Adventurer, AdventurerClass, adventurerClasses, AdventurerCollection, adventurerCollections, Race, races } from "../models"

export class DBAdventurer extends Model implements Adventurer {
    declare adventurerId?: string
    declare userId: string
    declare name: string
    declare class: AdventurerClass
    declare race: Race
    declare collection: AdventurerCollection
    declare assetRef: string
    declare inChallenge?: boolean
    declare athleticism: number
    declare intellect: number
    declare charisma: number
}

export const DBAdventurerTableName = "idle_quests_adventurers"

export const DBAdventurerTableAttributes = {
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
    DBAdventurer.init(DBAdventurerTableAttributes, {
        sequelize, 
        modelName: 'DBAdventurer', 
        tableName: DBAdventurerTableName
    })
}
