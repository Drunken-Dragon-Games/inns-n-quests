import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
import * as vm from "../game-vm.js"
import { IdleQuestsInventory } from "../models.js"

export type ISectorDB = {
    sectorId: string
    name: string
    objectLocations: string
}

export class SectorDB extends Model implements ISectorDB {
    declare sectorId: string
    declare name: string
    declare objectLocations: string
}

export const SectorDBInfo = {

    tableName: "idle_quests_sector",

    tableAttributes: {
        sectorId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        objectLocations: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    },

    configureSequelizeModel(sequelize: Sequelize): void {
        SectorDB.init(this.tableAttributes, {
            sequelize,
            modelName: 'SectorDB',
            tableName: this.tableName
        })
    }
}

export class SectorState {

    constructor(
    ) { }

    static async syncPlayerInn(userId: string, inventory: IdleQuestsInventory, transaction?: Transaction): Promise<IdleQuestsInventory> {
        const innState = await SectorDB.findOne({ where: { sectorId: userId }, transaction })
        if (innState === null) 
            return inventory
        const parsedLocations = JSON.parse(innState.objectLocations)
        if (!vm.isObjectLocations(parsedLocations)) 
            throw new Error("Invalid inn state, object locations are not valid")
        const toDelete = Object.keys(parsedLocations).filter(objectId => !inventory.characters[objectId] && !inventory.furniture[objectId])
        if (toDelete.length == 0) 
            return { ...inventory, innState: { ...innState, objectLocations: parsedLocations, ctype: "sector" } }
        const newLocations = toDelete.reduce((acc, objectId) => { delete acc[objectId]; return acc }, parsedLocations)
        await SectorDB.update({ objectLocations: JSON.stringify(newLocations) }, { where: { sectorId: userId }, transaction })
        return { ...inventory, innState: { ...innState, objectLocations: newLocations, ctype: "sector" } }
    }

    static async setPlayerInnState(userId: string, name?: string, objectLocations?: vm.ObjectsLocations, transaction?: Transaction): Promise<void> {
        if (!name && !objectLocations) return
        const innState = await SectorDB.findOne({ where: { sectorId: userId } })
        if (!innState) {
            await SectorDB.create({ sectorId: userId, name: name ?? "Player Inn", objectLocations: objectLocations ? JSON.stringify(objectLocations) : "{}", transaction })
        } else {
            const update: { name?: string, objectLocations?: string } = {}
            if (name !== undefined) update.name = name
            if (objectLocations !== undefined) update.objectLocations = JSON.stringify(objectLocations)
            await SectorDB.update(update, { where: { sectorId: userId }, transaction})
        }
    }
}