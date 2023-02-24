import { Op, Transaction } from "sequelize"
import { MetadataRegistry } from "../../registry-metadata"
import { WellKnownPolicies } from "../../registry-policies"
import { Inventory } from "../../service-asset-management"
import Random from "../../tools-utils/random"
import { Adventurer, AdventurerClass, AdventurerCollection, APS, Race, Reward } from "../models"
import { AdventurerDB } from "./adventurer-db"
import { individualXPReward } from "./adventurer-equations"
import { InventoryAsset, syncData } from "./sync-fun"

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

    /**
     * Returns adventurer data only if they belong to the user.
     * 
     * @param userId 
     * @param adventurerIds 
     * @param transaction 
     * @returns 
     */
    async findAdventurers(adventurerIds: string[], userId?: string, transaction?: Transaction): Promise<Adventurer[]> {
        const adventurers = await AdventurerDB.findAll({ where: { adventurerId: adventurerIds, userId }, transaction })
        return adventurers.map(adventurer => adventurer.dataValues)
    }

    /**
     * Bulk creates adventurers and adds them to the user's inventory.
     * The assetRef and collection must be valid.
     * 
     * @param userId 
     * @param adventurersToCreate 
     * @returns 
     */
    async createAdventurers(userId: string, adventurersToCreate: AdventurerCreationData[]): Promise<Adventurer[]> {

        const adventurerClass = (adventurer: AdventurerCreationData): AdventurerClass => {
            switch (adventurer.collection) {
                case "pixel-tiles": return this.metadataRegistry.pixelTilesGameMetadata[adventurer.assetRef].class.toLowerCase() as AdventurerClass
                case "grandmaster-adventurers": return this.metadataRegistry.gmasMetadata[adventurer.assetRef].class.toLowerCase() as AdventurerClass
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

        const adventurerName = (adventurer: AdventurerCreationData): string => {
            if (adventurer.collection == "pixel-tiles") {
                const name = this.metadataRegistry.pixelTilesMetadata[adventurer.assetRef].name
                const realName = (name.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2] 
                return realName
            } else if (adventurer.collection == "grandmaster-adventurers") {
                const aclass = this.metadataRegistry.gmasMetadata[adventurer.assetRef].class
                return `Grand Master ${aclass}`
            } else if (adventurer.collection == "adventurers-of-thiolden") {
                const idx = parseInt(adventurer.assetRef.replace("AdventurerOfThiolden", "")) - 1
                const name = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                return name.charAt(0).toUpperCase() + name.slice(1)
            } else {
                return adventurer.assetRef
            }
        }

        const createdAdventurers: AdventurerDB[] = await AdventurerDB.bulkCreate(adventurersToCreate.flatMap(adventurer =>
            [...Array(adventurer.quantity)].map(() => {
                const aps = adventurerAPS(adventurer)
                return {
                    userId,
                    assetRef: adventurer.assetRef,
                    collection: adventurer.collection,
                    name: adventurerName(adventurer),
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

        return createdAdventurers.map(adventurer => adventurer.dataValues)
    }

    /**
     * Deletes adventurers from the database without any checks.
     * 
     * @param adventurersIds 
     * @returns 
     */
    async deleteAdventurers(adventurersIds: string[]): Promise<void> {
        if (adventurersIds.length == 0) return
        await AdventurerDB.destroy({ where: { adventurerId: adventurersIds } })
    }

    /**
     * Syncs the user's current inventory adventurers with the asset inventory.
     * The asset inventory comes from querying the Asset Management Service, and is a list of all the assets the user owns, in-chain or off-chain.
     * 
     * @param userId 
     * @param assetInventory 
     * @returns 
     */
    async syncAdventurers(userId: string, assetInventory: Inventory): Promise<Adventurer[]> {
        
        const pickInventoryAdventurers = (assetInventory: Inventory): InventoryAsset<AdventurerCollection>[] => {
            const pxs: InventoryAsset<AdventurerCollection>[] = (assetInventory[this.wellKnownPolicies.pixelTiles.policyId] ?? [])
                .filter(pxt => this.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Adventurer")
                .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
            const gmas: InventoryAsset<AdventurerCollection>[] = (assetInventory[this.wellKnownPolicies.grandMasterAdventurers.policyId] ?? [])
                .map(gma => ({ assetRef: gma.unit, collection: "grandmaster-adventurers", quantity: parseInt(gma.quantity) }))
            const aots: InventoryAsset<AdventurerCollection>[] = (assetInventory[this.wellKnownPolicies.adventurersOfThiolden.policyId] ?? [])
                .map(aot => ({ assetRef: aot.unit, collection: "adventurers-of-thiolden", quantity: parseInt(aot.quantity) }))
            return [...pxs, ...gmas, ...aots]
        }

        /*
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
        */

        const preSyncedAdventurers: Adventurer[] = (await AdventurerDB.findAll({ where: { userId } })).map(adventurer => adventurer.dataValues)
        const assetInventoryAdventurers = pickInventoryAdventurers(assetInventory)
        const { toCreate, toDelete, surviving } = syncData(preSyncedAdventurers, assetInventoryAdventurers, adventurer => adventurer.adventurerId)
        const createdAdventurers = await this.createAdventurers(userId, toCreate)
        await this.deleteAdventurers(toDelete.map(adventurer => adventurer.adventurerId))
        return this.addSpritesToAdventurers(createdAdventurers.concat(surviving))
    }

    /**
     * Sets the inChallenge flag to true for the given adventurers if they are not in a challenge already,
     * if their hp is not 0, and if they belong to the given user.
     * If for a given adventurer the inChallenge flag is already true, or if the other conditions are not met, 
     * the adventurer is not updated, but the other adventurers are.
     * 
     * @param userId 
     * @param adventurerIds 
     * @param transaction 
     * @returns 
     */
    async setInChallenge(userId: string, adventurerIds: string[], transaction?: Transaction): Promise<Adventurer[]> {
        if (adventurerIds.length == 0) return []
        const [_, adventurers] = await AdventurerDB.update({ inChallenge: true }, 
            { where: { userId, adventurerId: adventurerIds, inChallenge: false, hp: { [Op.not]: 0 } }, returning: true, transaction })
        return adventurers.map(adventurer => adventurer.dataValues)
    }

    /**
     * Sets the inChallenge flag to false for the given adventurers if they are in a challenge and belong to the given user.
     * If for a given adventurer the inChallenge flag is already false, or if the other conditions are not met, 
     * the adventurer is not updated, but the other adventurers are.
     * 
     * @param userId 
     * @param adventurerIds 
     * @param transaction 
     * @returns 
     */
    async unsetInChallenge(userId: string, adventurerIds: string[], transaction?: Transaction): Promise<Adventurer[]> { 
        if (adventurerIds.length == 0) return []
        const [_, adventurers] = await AdventurerDB.update({ inChallenge: false }, 
            { where: { userId, adventurerId: adventurerIds }, returning: true, transaction })
        return adventurers.map(adventurer => adventurer.dataValues)
    }

    /**
     * Computes the sprite image url for each adventurer in the given array and adds it to the adventurer object.
     * 
     * @param adventurers 
     * @returns 
     */
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
            const finalName = adventurerName == "avva" ?  (Math.floor(Math.random() * 2) == 0 ? "avva_fire" : "avva_ice") : adventurerName
            return `https://cdn.ddu.gg/adv-of-thiolden/x6/${finalName}-front-${chromaOrPlain}.png`
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

    async levelUpAdventurers(adventurers: Adventurer[], reward: Reward, transaction?: Transaction): Promise<void> {
        if (!reward.apsExperience) return
        const updateData = individualXPReward(adventurers, reward.apsExperience).map(([adventurer, xp]) => ({
            ...adventurer,
            athXP: xp.athleticism + adventurer.athXP, 
            intXP: xp.intellect + adventurer.intXP,
            chaXP: xp.charisma + adventurer.chaXP
        }))
        try {
        await AdventurerDB.bulkCreate(updateData, { updateOnDuplicate: ["athXP", "intXP", "chaXP"], transaction })
        } catch (e) {
            console.log(e)
            throw e }
    }
}