import { Inventory } from "../../service-asset-management";
import { DBAdventurer } from "./adventurer-db";

export type AdventurersSyncPolicies = {
    aot: string,
    gma: string,
    px: string
}

export async function syncAdventurers(userId: string, amsInventory: Inventory, policies: AdventurersSyncPolicies): Promise<void> {

    const inventoryAdventurers = await DBAdventurer.findAll({ attributes: ["adventurerId", "assetRef", "collection"], where: { userId } })
    /*
    const inventoryItems = await assetManagementServiceInventory.getInventory()
    const inventoryItemIds = inventoryItems.map(i => i.id)
    const inventoryItemIdsSet = new Set(inventoryItemIds)

    const inventoryItemIdsToRemove = inventory.items.filter(i => !inventoryItemIdsSet.has(i.id))
    inventoryItemIdsToRemove.forEach(i => inventory.items.splice(inventory.items.indexOf(i), 1))

    const inventoryItemIdsToAdd = inventoryItemIds.filter(i => !inventory.items.some(i2 => i2.id == i))
    inventoryItemIdsToAdd.forEach(i => inventory.items.push({ id: i, count: 1 }))
    */
}