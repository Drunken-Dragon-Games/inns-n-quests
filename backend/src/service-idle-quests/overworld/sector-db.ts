import { DataTypes, Model, Sequelize } from "sequelize"

export interface ISectorDB {
    sectorId: string
    name: string
    objectLocations: string
}

export class SectorDB extends Model implements ISectorDB {
    declare sectorId: string
    declare name: string
    declare objectLocations: string
}

export const SectorDBTableName = "idle_quests_sector"

export const SectorDBTableAttributes = {
    sectorId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    objectLocations: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    SectorDB.init(SectorDBTableAttributes, {
        sequelize, 
        modelName: 'SectorDB', 
        tableName: SectorDBTableName
    })
}
