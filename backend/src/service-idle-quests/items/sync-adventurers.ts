import { Inventory } from "../../service-asset-management"
import { Adventurer, AdventurerClass, AdventurerCollection, Race } from "../models"
import { DBAdventurer } from "./adventurer-db"

import { MetadataRegistry } from "../../registry-metadata"
import apsRandomizer from "./aps-randomizer"
import Random from "../../tools-utils/random"
import { WellKnownPolicies } from "../../registry-policies"

type PreSyncedAdventurers = {
    adventurerId?: string,
    assetRef: string,
    collection: AdventurerCollection
}

type AssetInventoryAdventurer = {
    assetRef: string,
    collection: AdventurerCollection,
    quantity: number
}

export default class AdventurersSyncer {

    constructor(
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies
    ) { }

    async syncAdventurers(userId: string, assetInventory: Inventory): Promise<void> {
        const preSyncedAdventurers: PreSyncedAdventurers[] = await this.fetchPreSyncedAdventurers(userId)
        const assetInventoryAdventurers: AssetInventoryAdventurer[] = this.fetchAssetInventoryAdventurers(assetInventory)
        const { adventurersToCreate, adventurersToDelete } = this.adventurersToSync(preSyncedAdventurers, assetInventoryAdventurers)
        await this.createAdventurers(userId, adventurersToCreate)
        await this.deleteAdventurers(adventurersToDelete)
    }

    private async fetchPreSyncedAdventurers(userId: string): Promise<PreSyncedAdventurers[]> {
        return await DBAdventurer.findAll({ attributes: ["adventurerId", "assetRef", "collection"], where: { userId } })
    }

    fetchAssetInventoryAdventurers(assetInventory: Inventory): AssetInventoryAdventurer[] {
        const pxs: AssetInventoryAdventurer[] = (assetInventory[this.wellKnownPolicies.pixelTiles.policyId] ?? [])
            .filter(pxt => this.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Adventurer")
            .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
        const gmas: AssetInventoryAdventurer[] = (assetInventory[this.wellKnownPolicies.grandMasterAdventurers.policyId] ?? [])
            .map(gma => ({ assetRef: gma.unit, collection: "grandmaster-adventurers", quantity: parseInt(gma.quantity) }))
        const aots: AssetInventoryAdventurer[] = (assetInventory[this.wellKnownPolicies.adventurersOfThiolden.policyId] ?? [])
            .map(aot => ({ assetRef: aot.unit, collection: "adventurers-of-thiolden", quantity: parseInt(aot.quantity) }))
        return [...pxs, ...gmas, ...aots]
    }

    adventurersToSync(preSyncedAdventurers: PreSyncedAdventurers[], assetInventoryAdventurers: AssetInventoryAdventurer[]): { adventurersToCreate: AssetInventoryAdventurer[], adventurersToDelete: PreSyncedAdventurers[] } {
        const assetDifference = assetInventoryAdventurers
            .map(asset => {
                const allSyncedAdventurersQuantity =
                    preSyncedAdventurers.filter(preSynced => preSynced.assetRef == asset.assetRef).length
                return { ...asset, quantity: asset.quantity - allSyncedAdventurersQuantity }
            })
        const adventurersToCreate = assetDifference.filter(asset => asset.quantity > 0)
        const assetAdventurersToDelete = assetDifference.filter(asset => asset.quantity < 0)
        // Pick the pre-synced adventurers to delete based on the asset difference
        const adventurersToDelete = assetAdventurersToDelete.map(asset => {
            const preSyncedAdventurersToDelete = preSyncedAdventurers
                .filter(preSynced => preSynced.assetRef == asset.assetRef)
                .slice(0, Math.abs(asset.quantity))
            return preSyncedAdventurersToDelete
        }).flat()
        return { adventurersToCreate, adventurersToDelete }
    }

    private async createAdventurers(userId: string, adventurersToCreate: AssetInventoryAdventurer[]): Promise<void> {

        const adventurerClass = (adventurer: AssetInventoryAdventurer): AdventurerClass => {
            switch (adventurer.collection) {
                case "pixel-tiles": return this.metadataRegistry.pixelTilesGameMetadata[adventurer.assetRef].class as AdventurerClass
                case "grandmaster-adventurers": return this.metadataRegistry.gmasMetadata[adventurer.assetRef].class as AdventurerClass
                case "adventurers-of-thiolden":
                    const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                    const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                    return this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"].toLowerCase() as AdventurerClass
            }
        }

        const adventurerRace = (adventurer: AssetInventoryAdventurer): Race => {
            switch (adventurer.collection) {
                case "pixel-tiles": return this.metadataRegistry.pixelTilesGameMetadata[adventurer.assetRef].race as Race
                case "grandmaster-adventurers": return this.metadataRegistry.gmasMetadata[adventurer.assetRef].race as Race
                case "adventurers-of-thiolden":
                    const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                    const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                    return this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Race"].toLowerCase() as Race
            }
        }

        const adventurerAPS = (adventurer: AssetInventoryAdventurer): { athleticism: number, intellect: number, charisma: number } => {
            switch (adventurer.collection) {
                case "pixel-tiles": switch (this.metadataRegistry.pixelTilesMetadata[adventurer.assetRef].rarity) {
                    case "Common": return { athleticism: 2, intellect: 2, charisma: 2 }
                    case "Uncommon": return { athleticism: 4, intellect: 4, charisma: 4 }
                    case "Rare": return { athleticism: 6, intellect: 6, charisma: 6 }
                    case "Epic": return { athleticism: 8, intellect: 8, charisma: 8 }
                    case "Legendary": return { athleticism: 10, intellect: 10, charisma: 10 }
                }
                case "grandmaster-adventurers":
                    const armor = parseInt(this.metadataRegistry.gmasMetadata[adventurer.assetRef].armor)
                    const weapon = parseInt(this.metadataRegistry.gmasMetadata[adventurer.assetRef].weapon)
                    const aps = Math.round((armor + weapon) * 30 / 10)
                    const rand = new Random(adventurer.assetRef)
                    return apsRandomizer(aps, rand)
                case "adventurers-of-thiolden":
                    const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                    const athleticism = this.metadataRegistry.advOfThioldenAppMetadata[idx].ath
                    const intellect = this.metadataRegistry.advOfThioldenAppMetadata[idx].int
                    const charisma = this.metadataRegistry.advOfThioldenAppMetadata[idx].cha
                    return { athleticism, intellect, charisma }
            }
        }

        const adventurers = adventurersToCreate.map(adventurer => {
            const aps = adventurerAPS(adventurer)
            const toCreate: Adventurer[] = []
            for (let i = 0; i < adventurer.quantity; i++) {
                toCreate.push({
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
                })
            }
            return toCreate
        }).flat()
        await DBAdventurer.bulkCreate(adventurers)
    }

    private async deleteAdventurers(adventurersToDelete: PreSyncedAdventurers[]): Promise<void> {
        if (adventurersToDelete.length == 0) return
        await DBAdventurer.destroy({ where: { adventurerId: adventurersToDelete.map(adv => adv.adventurerId) } })
    }

}