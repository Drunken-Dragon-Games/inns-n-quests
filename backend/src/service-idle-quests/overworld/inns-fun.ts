import { IdleQuestsInventory } from "../models";
import { SectorDB } from "./sector-db";
import { isObjectLocations } from "./sector-validation";

export default class InnsFun {

    static async syncPlayerInn(userId: string, inventory: IdleQuestsInventory): Promise<IdleQuestsInventory> {
        const innState = await SectorDB.findOne({ where: { sectorId: userId } })
        if (innState === null) 
            return inventory
        const parsedLocations = JSON.parse(innState.objectLocations)
        if (!isObjectLocations(parsedLocations)) 
            throw new Error("Invalid inn state, object locations are not valid")
        const toDelete = Object.keys(parsedLocations).filter(objectId => !inventory.adventurers[objectId] && !inventory.furniture[objectId])
        if (toDelete.length == 0) 
            return { ...inventory, innState: { ...innState, objectLocations: parsedLocations } }
        const newLocations = toDelete.reduce((acc, objectId) => { delete acc[objectId]; return acc }, parsedLocations)
        await SectorDB.update({ objectLocations: JSON.stringify(newLocations) }, { where: { sectorId: userId } })
        return { ...inventory, innState: { ...innState, objectLocations: newLocations } }
    }

    static async setPlayerInnState(userId: string, name?: string, objectLocations?: Record<string, [number, number]>): Promise<void> {
        const innState = await SectorDB.findOne({ where: { sectorId: userId } })
        if (!innState) {
            await SectorDB.create({ sectorId: userId, name: name ?? "Inn", objectLocations: objectLocations ? JSON.stringify(objectLocations) : "{}" })
        } else {
            const update: { name?: string, objectLocations?: string } = {}
            if (name !== undefined) update.name = name
            if (objectLocations !== undefined) update.objectLocations = JSON.stringify(objectLocations)
            await SectorDB.update(update, { where: { sectorId: userId } })
        }
    }
}