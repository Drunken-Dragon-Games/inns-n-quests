import { Inventory, WellKnownPolicies } from "../../service-asset-management"
import { AdventurerCollection } from "../models"
import { DBAdventurer } from "./adventurer-db"
import genrand from "random-seed"

import metadataCache from "./metadata-cache"
import apsRandomizer from "./aps-randomizer"

type PreSyncedAdventurers = {
    adventurerId: string,
    assetRef: string,
    collection: AdventurerCollection
}

type AssetInventoryAdventurer = {
    assetRef: string,
    collection: AdventurerCollection,
    quantity: number
}

export async function syncAdventurers(userId: string, assetInventory: Inventory, wellKnownPolicies: WellKnownPolicies): Promise<void> {

    const preSyncedAdventurers: PreSyncedAdventurers[] = await fetchPreSyncedAdventurers(userId)
    const assetInventoryAdventurers: AssetInventoryAdventurer[] = fetchAssetInventoryAdventurers(assetInventory, wellKnownPolicies)
    const { adventurersToCreate, adventurersToDelete } = adventurersToSync(preSyncedAdventurers, assetInventoryAdventurers)
    await createAdventurers(userId, adventurersToCreate)
}

async function fetchPreSyncedAdventurers(userId: string): Promise<PreSyncedAdventurers[]> {
    return await DBAdventurer.findAll({ attributes: ["adventurerId", "assetRef", "collection"], where: { userId } })
}

function fetchAssetInventoryAdventurers(assetInventory: Inventory, wellKnownPolicies: WellKnownPolicies): AssetInventoryAdventurer[] {
    const pxs: AssetInventoryAdventurer[] = (assetInventory[wellKnownPolicies.pixelTiles.policyId] ?? [])
        .filter(pxt => metadataCache.pixelTilesMetadata[pxt.unit].type == "Adventurer")
        .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
    const gmas: AssetInventoryAdventurer[] = (assetInventory[wellKnownPolicies.grandMasterAdventurers.policyId] ?? [])
        .map(gma => ({ assetRef: gma.unit, collection: "grandmaster-adventurers", quantity: parseInt(gma.quantity) }))
    const aots: AssetInventoryAdventurer[] = (assetInventory[wellKnownPolicies.adventurersOfThiolden.policyId] ?? [])
        .map(aot => ({ assetRef: aot.unit, collection: "adventurers-of-thiolden", quantity: parseInt(aot.quantity) }))
    return [...pxs, ...gmas, ...aots]
}

function adventurersToSync(preSyncedAdventurers: PreSyncedAdventurers[], assetInventoryAdventurers: AssetInventoryAdventurer[]): { adventurersToCreate: AssetInventoryAdventurer[], adventurersToDelete: AssetInventoryAdventurer[] } {
   const assetDifference = assetInventoryAdventurers
        .map(asset => {
            const allSyncedAdventurersQuantity = 
                preSyncedAdventurers.filter(preSynced => preSynced.assetRef == asset.assetRef).length
            return { ...asset, quantity: asset.quantity - allSyncedAdventurersQuantity }
        })
    return { 
        adventurersToCreate: assetDifference.filter(asset => asset.quantity > 0), 
        adventurersToDelete: assetDifference.filter(asset => asset.quantity < 0) 
    }
}

async function createAdventurers(userId: string, adventurersToCreate: AssetInventoryAdventurer[]): Promise<void> {

    function adventurerClass(adventurer: AssetInventoryAdventurer): string {
        switch (adventurer.collection) {
            case "pixel-tiles": return metadataCache.pixelTilesGameMetadata[adventurer.assetRef].class
            case "grandmaster-adventurers": return metadataCache.gmasMetadata[adventurer.assetRef].class
            case "adventurers-of-thiolden": 
                const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                const adventurerName = metadataCache.advOfThioldenAppMetadata[idx].adv
                return metadataCache.advOfThioldenGameMetadata[adventurerName]["Game Class"].toLowerCase()
        }
    }

    function adventurerRace(adventurer: AssetInventoryAdventurer): string {
        switch (adventurer.collection) {
            case "pixel-tiles": return metadataCache.pixelTilesGameMetadata[adventurer.assetRef].race
            case "grandmaster-adventurers": return metadataCache.gmasMetadata[adventurer.assetRef].race
            case "adventurers-of-thiolden": 
                const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                const adventurerName = metadataCache.advOfThioldenAppMetadata[idx].adv
                return metadataCache.advOfThioldenGameMetadata[adventurerName]["Race"].toLowerCase()
        }
    }

    function adventurerAPS(adventurer: AssetInventoryAdventurer): { athleticism: number, intellect: number, charisma: number } {
        switch (adventurer.collection) {
            case "pixel-tiles": switch (metadataCache.pixelTilesMetadata[adventurer.assetRef].rarity) {
                case "Common": return { athleticism: 2, intellect: 2, charisma: 2 }    
                case "Uncommon": return { athleticism: 4, intellect: 4, charisma: 4 }    
                case "Rare": return { athleticism: 6, intellect: 6, charisma: 6 }    
                case "Epic": return { athleticism: 8, intellect: 8, charisma: 8 }    
                case "Legendary": return { athleticism: 10, intellect: 10, charisma: 10 }    
            }
            case "grandmaster-adventurers": 
                const armor = parseInt(metadataCache.gmasMetadata[adventurer.assetRef].armor)
                const weapon = parseInt(metadataCache.gmasMetadata[adventurer.assetRef].weapon)
                const aps = Math.round((armor + weapon) * 30 / 10)
                const rand = genrand.create(adventurer.assetRef)
                return apsRandomizer(aps, rand)
            case "adventurers-of-thiolden": 
                const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                const athleticism = metadataCache.advOfThioldenAppMetadata[idx].ath
                const intellect = metadataCache.advOfThioldenAppMetadata[idx].int
                const charisma = metadataCache.advOfThioldenAppMetadata[idx].cha
                return { athleticism, intellect, charisma }
        }
    }

    const adventurers = adventurersToCreate.map(adventurer => {
        const aps = adventurerAPS(adventurer)
        return {
            userId,
            assetRef: adventurer.assetRef,
            collection: adventurer.collection,
            name: adventurer.assetRef,
            class: adventurerClass(adventurer),
            race: adventurerRace(adventurer),
            inChallenge: false,
            athleticism: aps.athleticism,
            intellect: aps.intellect,
            charisma: aps.charisma,
        }
    })
    await DBAdventurer.bulkCreate(adventurers)
}
