import { v4 } from "uuid"
import { MetadataRegistry } from "../../registry-metadata"
import Random from "../../tools-utils/random"
import { AdventurerClass, AdventurerClasses, APS, CharacterCollection, CharacterEntity, CharacterType, CrafterClass, Race, zeroAPS } from "./character-entity"
import { Quest, AvailableQuest } from "./encounter"
import { FurnitureCollection } from "./furniture-entity"
import { IQEntity, IQEntityType } from "./iq-entity"
import { CharacterEntityRuleset, IQRuleset } from "./iq-ruleset"

export type NewIQEntityProps = {
    assetRef: string
    name: string
}

export type NewCharacterEntityProps = {
    assetRef: string
    collection: CharacterCollection
}

export const newIQEntity = <EType extends IQEntityType>(entityType: EType, props: NewIQEntityProps): IQEntity<EType> => 
    ({ entityId: v4(), entityType, ...props })

export const newRandAPS = (targetAPSSum: number, rand: Random): APS => {
    // Assign stats as best as possible
    let currentSum = 0, overflow = 0
    const baseStatsOrder = rand.shuffle(
        ["athleticism", "intellect", "charisma"] as ["athleticism", "intellect", "charisma"])
    const singleStatMax = 10
    const stats = { athleticism: 0, intellect: 0, charisma: 0 }
    baseStatsOrder.forEach((stat, i) => {
        if (i == 2) {
            const semiFinalStat = targetAPSSum - currentSum
            const finalStat = Math.min(singleStatMax, semiFinalStat)
            overflow = semiFinalStat - finalStat
            stats[stat] = finalStat
        } else {
            const maxPossibleStat = Math.min(Math.min(targetAPSSum - 2, singleStatMax), targetAPSSum - 1 - currentSum)
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
    if (totalStatSum != targetAPSSum) throw new Error("Expected " + targetAPSSum + " stats but got " + totalStatSum)
    else return stats
}

export const newCharacterEntity = (metadataRegistry: MetadataRegistry, rules: CharacterEntityRuleset) => (characterType: CharacterType, props: NewCharacterEntityProps): CharacterEntity => {
    const ivAPS = characterIVAPS(metadataRegistry)(props.assetRef, props.collection)
    const xpAPS = zeroAPS
    return {
        ...newIQEntity("character-entity", { 
            name: characterDefaultName(metadataRegistry)(props.assetRef, props.collection),
            assetRef: props.assetRef 
        }),
        characterType,
        entityId: v4(),
        assetRef: props.assetRef,
        collection: props.collection,
        race: characterRace(metadataRegistry)(props.assetRef, props.collection),
        hp: rules.natMaxHitPoints(ivAPS, xpAPS),
        ivAPS,
        xpAPS,
    }
}

export const characterCollection = (assetRef: string): CharacterCollection => {
    const matched = assetRef.match(/^([a-zA-Z]+)(\d+)/)
    if (!matched) throw new Error(`Invalid assetRef: ${assetRef}`)
    switch (matched[1]) {
        case "PixelTile": return "pixel-tiles"
        case "GrandmasterAdventurer": return "grandmaster-adventurers"
        case "AdventurerOfThiolden": return "adventurers-of-thiolden"
        default: throw new Error(`Invalid assetRef: ${assetRef}`)
    }
}

export const characterRace = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: CharacterCollection): Race => {
    switch (collection) {
        case "pixel-tiles": return metadataRegistry.pixelTilesGameMetadata[assetRef].race as Race
        case "grandmaster-adventurers": return metadataRegistry.gmasMetadata[assetRef].race as Race
        case "adventurers-of-thiolden":
            const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
            const adventurerName = metadataRegistry.advOfThioldenAppMetadata[idx].adv
            return metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Race"] as Race
    }
}

export const characterIVAPS = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: CharacterCollection): APS => {
    switch (collection) {
        case "pixel-tiles": switch (metadataRegistry.pixelTilesMetadata[assetRef].rarity) {
            case "Common": return { athleticism: 2, intellect: 2, charisma: 2 }
            case "Uncommon": return { athleticism: 4, intellect: 4, charisma: 4 }
            case "Rare": return { athleticism: 6, intellect: 6, charisma: 6 }
            case "Epic": return { athleticism: 8, intellect: 8, charisma: 8 }
            default: return { athleticism: 10, intellect: 10, charisma: 10 }
        }
        case "grandmaster-adventurers":
            const armor = parseInt(metadataRegistry.gmasMetadata[assetRef].armor)
            const weapon = parseInt(metadataRegistry.gmasMetadata[assetRef].weapon)
            const targetAPSSum = Math.round((armor + weapon) * 30 / 10)
            const rand = new Random(assetRef)
            return newRandAPS(targetAPSSum, rand)
        case "adventurers-of-thiolden":
            const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
            const athleticism = metadataRegistry.advOfThioldenAppMetadata[idx].ath
            const intellect = metadataRegistry.advOfThioldenAppMetadata[idx].int
            const charisma = metadataRegistry.advOfThioldenAppMetadata[idx].cha
            return { athleticism, intellect, charisma }
    }
}

export const characterDefaultName = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: CharacterCollection): string => {
    switch (collection) {
        case "pixel-tiles":
            const pName = metadataRegistry.pixelTilesMetadata[assetRef].name
            const realName = (pName.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2]
            return realName
        case "grandmaster-adventurers":
            const aclass = metadataRegistry.gmasMetadata[assetRef].class
            return `Grand Master ${aclass}`
        case "adventurers-of-thiolden":
            const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
            const name = metadataRegistry.advOfThioldenAppMetadata[idx].adv
            return name.charAt(0).toUpperCase() + name.slice(1)
    }
}

export const characterType = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: CharacterCollection): CharacterType => {
    let cclass: string
    switch (collection) {
        case "pixel-tiles": 
            cclass = metadataRegistry.pixelTilesGameMetadata[assetRef].class
            break
        case "grandmaster-adventurers": 
            cclass = metadataRegistry.gmasMetadata[assetRef].class 
            break
        case "adventurers-of-thiolden":
            const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
            const adventurerName = metadataRegistry.advOfThioldenAppMetadata[idx].adv
            cclass = metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"] 
            break
    }
    if ((AdventurerClasses as string[]).includes(cclass)) return { ctype: "adventurer", class: cclass as AdventurerClass } 
    else return { ctype: "crafter", class: cclass as CrafterClass }
}

export const characterSprite = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: CharacterCollection): string => {

    const pixeltileSprite = (): string => {
        return `https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_${assetRef.replace("PixelTile", "")}.png`
    }

    const gmaSprite = (): string => {
        return `https://cdn.ddu.gg/gmas/x3/${assetRef}.png`
    }

    const advOfThioldenSprite = (): string => {
        const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
        const adventurerName = metadataRegistry.advOfThioldenAppMetadata[idx].adv
        const chromaOrPlain = metadataRegistry.advOfThioldenAppMetadata[idx].chr ? "chroma" : "plain"
        const finalName = (adventurerName == "avva" ? (Math.floor(Math.random() * 2) == 0 ? "avva_fire" : "avva_ice") : adventurerName)
            .replace("'", "")
        return `https://cdn.ddu.gg/adv-of-thiolden/x6/${finalName}-front-${chromaOrPlain}.png`
    }

    switch (collection) {
        case "pixel-tiles": return pixeltileSprite() 
        case "grandmaster-adventurers": return gmaSprite() 
        case "adventurers-of-thiolden": return advOfThioldenSprite() 
    }
}

export const newAdventurer = (metadataRegistry: MetadataRegistry, rules: CharacterEntityRuleset) => (props: NewCharacterEntityProps): CharacterEntity => 
    newCharacterEntity(metadataRegistry, rules)(characterType(metadataRegistry)(props.assetRef, props.collection), props)

export const furnitureDefaultName = (metadataRegistry: MetadataRegistry) => (assetRef: string, collection: FurnitureCollection): string => {
    if (collection == "pixel-tiles") {
        const name = metadataRegistry.pixelTilesMetadata[assetRef].name
        const realName = (name.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2]
        return realName
    } else {
        return assetRef
    }
}

export const newAvailableQuest = (rules: IQRuleset) => (quest: Quest): AvailableQuest => ({
    questId: quest.questId,
    name: quest.name,
    location: quest.location,
    description: quest.description,
    requirements: quest.requirements,
    reward: rules.quest.reward(quest.requirements),
    duration: rules.quest.duration(quest.requirements),
    slots: quest.slots ?? 5,
})