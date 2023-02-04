import Random from "../../tools-utils/random"
import { MetadataRegistry } from "../../registry-metadata"
import { Adventurer, AdventurerClass, AdventurerCollection, APS, Race } from "../models"
import { AdventurerDB } from "./adventurer-db"
import { WellKnownPolicies } from "../../registry-policies"
import { Inventory } from "../../service-asset-management"
import { Op, Transaction } from "sequelize"

export const apsSum = (aps: APS): number =>
    aps.athleticism + aps.intellect + aps.charisma

export const generateRandomAPS = (targetAPS: number, rand: Random): APS => {
    // Assign stats as best as possible
    let currentSum = 0, overflow = 0
    const baseStatsOrder = rand.shuffle(
        ["athleticism", "intellect", "charisma"] as ["athleticism", "intellect", "charisma"])
    const singleStatMax = 10
    const stats = { athleticism: 0, intellect: 0, charisma: 0 }
    baseStatsOrder.forEach((stat, i) => {
        if (i == 2) {
            const semiFinalStat = targetAPS - currentSum
            const finalStat = Math.min(singleStatMax, semiFinalStat)
            overflow = semiFinalStat - finalStat
            stats[stat] = finalStat
        } else {
            const maxPossibleStat = Math.min(Math.min(targetAPS - 2, singleStatMax), targetAPS - 1 - currentSum)
            const finalStat = rand.randomNumberBetween(1, maxPossibleStat)
            currentSum += finalStat
            stats[stat] = finalStat
        }
    })
    // Randomly distribute the rest
    while (overflow > 0) {
        baseStatsOrder.forEach((stat) => {
            const currentStat = stats[stat]
            if (currentStat == singleStatMax || overflow <= 0) return
            const maxPossibleIncrement = Math.min(singleStatMax - currentStat, overflow)
            const randomIncrement = rand.randomNumberBetween(1, maxPossibleIncrement)
            const finalStat = randomIncrement + currentStat
            overflow -= randomIncrement
            stats[stat] = finalStat
        })
    }
    const totalStatSum = stats.athleticism + stats.intellect + stats.charisma
    if (totalStatSum != targetAPS) throw new Error("Expected " + targetAPS + " stats but got " + totalStatSum)
    else return stats
}

export type AdventurerCreationData = {
    assetRef: string,
    collection: AdventurerCollection,
    quantity: number
}

type AssetInventoryAdventurer = {
    assetRef: string,
    collection: AdventurerCollection,
    quantity: number
}

export default class AdventurerFun {

    constructor(
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies
    ) { }

    async findAdventurers(userId: string, adventurerIds: string[], transaction?: Transaction): Promise<Adventurer[]> {
        return AdventurerDB.findAll({ where: { adventurerId: adventurerIds, userId }, transaction })
    }

    async createAdventurers(userId: string, adventurersToCreate: AdventurerCreationData[]): Promise<Adventurer[]> {

        const adventurerClass = (adventurer: AdventurerCreationData): AdventurerClass => {
            switch (adventurer.collection) {
                case "pixel-tiles": return this.metadataRegistry.pixelTilesGameMetadata[adventurer.assetRef].class as AdventurerClass
                case "grandmaster-adventurers": return this.metadataRegistry.gmasMetadata[adventurer.assetRef].class as AdventurerClass
                case "adventurers-of-thiolden":
                    const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                    const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                    return this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"].toLowerCase() as AdventurerClass
            }
        }

        const adventurerRace = (adventurer: AdventurerCreationData): Race => {
            switch (adventurer.collection) {
                case "pixel-tiles": return this.metadataRegistry.pixelTilesGameMetadata[adventurer.assetRef].race as Race
                case "grandmaster-adventurers": return this.metadataRegistry.gmasMetadata[adventurer.assetRef].race as Race
                case "adventurers-of-thiolden":
                    const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                    const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                    return this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Race"].toLowerCase() as Race
            }
        }

        const adventurerAPS = (adventurer: AdventurerCreationData): APS => {
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
                    return generateRandomAPS(aps, rand)
                case "adventurers-of-thiolden":
                    const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                    const athleticism = this.metadataRegistry.advOfThioldenAppMetadata[idx].ath
                    const intellect = this.metadataRegistry.advOfThioldenAppMetadata[idx].int
                    const charisma = this.metadataRegistry.advOfThioldenAppMetadata[idx].cha
                    return { athleticism, intellect, charisma }
            }
        }

        const createdAdventurers = await AdventurerDB.bulkCreate(adventurersToCreate.flatMap(adventurer =>
            [...Array(adventurer.quantity)].map(() => {
                const aps = adventurerAPS(adventurer)
                return {
                    userId,
                    assetRef: adventurer.assetRef,
                    collection: adventurer.collection,
                    name: adventurer.assetRef,
                    class: adventurerClass(adventurer),
                    race: adventurerRace(adventurer),
                    hp: 1,
                    inChallenge: false,
                    athleticism: aps.athleticism,
                    intellect: aps.intellect,
                    charisma: aps.charisma,
                }
            })
        ))

        return this.addSpritesToAdventurers(createdAdventurers)
    }

    async deleteAdventurers(adventurersIds: string[]): Promise<void> {
        if (adventurersIds.length == 0) return
        await AdventurerDB.destroy({ where: { adventurerId: adventurersIds } })
    }

    async syncAdventurers(userId: string, assetInventory: Inventory): Promise<Adventurer[]> {
        
        const pickInventoryAdventurers = (assetInventory: Inventory): AssetInventoryAdventurer[] => {
            const pxs: AssetInventoryAdventurer[] = (assetInventory[this.wellKnownPolicies.pixelTiles.policyId] ?? [])
                .filter(pxt => this.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Adventurer")
                .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
            const gmas: AssetInventoryAdventurer[] = (assetInventory[this.wellKnownPolicies.grandMasterAdventurers.policyId] ?? [])
                .map(gma => ({ assetRef: gma.unit, collection: "grandmaster-adventurers", quantity: parseInt(gma.quantity) }))
            const aots: AssetInventoryAdventurer[] = (assetInventory[this.wellKnownPolicies.adventurersOfThiolden.policyId] ?? [])
                .map(aot => ({ assetRef: aot.unit, collection: "adventurers-of-thiolden", quantity: parseInt(aot.quantity) }))
            return [...pxs, ...gmas, ...aots]
        }

        const adventurersToSync = (preSyncedAdventurers: Adventurer[], assetInventoryAdventurers: AssetInventoryAdventurer[]): { adventurersToCreate: AssetInventoryAdventurer[], adventurersToDelete: Adventurer[], survivingAdventurers: Adventurer[] } => {
            const assetDifference = assetInventoryAdventurers
                .map(asset => {
                    const allSyncedAdventurersQuantity =
                        preSyncedAdventurers.filter(preSynced => preSynced.assetRef == asset.assetRef).length
                    return { ...asset, quantity: asset.quantity - allSyncedAdventurersQuantity }
                })
            const adventurersToCreate = assetDifference.filter(asset => asset.quantity > 0)
            const assetAdventurersToDelete = assetDifference.filter(asset => asset.quantity < 0)
            // Pick the pre-synced adventurers to delete based on the asset difference
            const adventurersToDelete = assetAdventurersToDelete.flatMap(asset => {
                const preSyncedAdventurersToDelete = preSyncedAdventurers
                    .filter(preSynced => preSynced.assetRef == asset.assetRef)
                    .slice(0, Math.abs(asset.quantity))
                return preSyncedAdventurersToDelete
            })
            // Pick the pre-synced adventurers that are not going to be deleted
            const survivingAdventurers = preSyncedAdventurers.filter(preSynced => 
                !adventurersToDelete.map(adventurer => adventurer.adventurerId).includes(preSynced.adventurerId))
            return { adventurersToCreate, adventurersToDelete, survivingAdventurers }
        }

        const preSyncedAdventurers = await AdventurerDB.findAll({ where: { userId } })
        const assetInventoryAdventurers = pickInventoryAdventurers(assetInventory)
        const { adventurersToCreate, adventurersToDelete, survivingAdventurers } = adventurersToSync(preSyncedAdventurers, assetInventoryAdventurers)
        const createdAdventurers = await this.createAdventurers(userId, adventurersToCreate)
        await this.deleteAdventurers(adventurersToDelete.map(adventurer => adventurer.adventurerId!))
        return createdAdventurers.concat(survivingAdventurers)
    }

    async setInChallenge(userId: string, adventurerIds: string[], transaction?: Transaction): Promise<Adventurer[]> {
        if (adventurerIds.length == 0) return []
        const [_, adventurers] = await AdventurerDB.update({ inChallenge: true }, 
            { where: { userId, adventurerIds, inChallenge: false, hp: { [Op.not]: 0 } }, returning: true, transaction })
        return adventurers
    }

    async unsetInChallenge(userId: string, adventurerIds: string[], transaction?: Transaction): Promise<Adventurer[]> { 
        if (adventurerIds.length == 0) return []
        const [_, adventurers] = await AdventurerDB.update({ inChallenge: false }, 
            { where: { userId, adventurerId: adventurerIds }, returning: true, transaction })
        return adventurers
    }

    private addSpritesToAdventurers(adventurers: Adventurer[]): Adventurer[] {

        const pixeltileSprite = (adventurer: Adventurer): string => {
            return `https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_${adventurer.assetRef.replace("PixelTile", "")}.png`
        }

        const gmaSprite = (adventurer: Adventurer): string => {
            return `https://cdn.ddu.gg/gmas/x3/${adventurer.assetRef}.png`
        }

        const advOfThioldenSprite = (adventurer: Adventurer): string => {
            const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
            const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
            const chromaOrPlain = this.metadataRegistry.advOfThioldenAppMetadata[idx].chr ? "chroma" : "plain"
            return `https://cdn.ddu.gg/adv-of-thiolden/x6/${adventurerName}-front-${chromaOrPlain}.png`
        }

        const withSprites: Adventurer[] = adventurers.map(adventurer => {
            switch (adventurer.collection) {
                case "pixel-tiles": return { ...adventurer, sprite: pixeltileSprite(adventurer) }
                case "grandmaster-adventurers": return { ...adventurer, sprite: gmaSprite(adventurer) }
                case "adventurers-of-thiolden": return { ...adventurer, sprite: advOfThioldenSprite(adventurer) }
            }
        })

        return withSprites
    }

}