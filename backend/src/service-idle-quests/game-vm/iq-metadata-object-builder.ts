import { v4 } from "uuid"
import { AdventurerClass, AdventurerClasses, APS, CharacterCollection, CharacterEntity, CharacterType, CrafterClass, Race, zeroAPS } from "./character-entity.js"
import { FurnitureCollection } from "./furniture-entity.js"
import { newIQEntity } from "./iq-entity.js"
import { MetadataRegistry, WellKnownPolicies } from "./iq-metadata.js"
import IQRandom from "./iq-random.js"
import { IQRuleset } from "./iq-ruleset.js"

export class IQMeatadataObjectBuilder {

    public readonly rand: IQRandom

    constructor(
        public readonly rules: IQRuleset,
        public readonly metadataRegistry: MetadataRegistry,
        public readonly wellKnownPolicies: WellKnownPolicies,
    ) { 
        this.rand = rules.rand
    }

    newRandAPS(targetAPSSum: number, altRand?: IQRandom): APS {
        // Assign stats as best as possible
        let currentSum = 0, overflow = 0
        const baseStatsOrder = (altRand ?? this.rand).shuffle(
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
                const finalStat = (altRand ?? this.rand).randomNumberBetween(1, maxPossibleStat)
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
                const randomIncrement = (altRand ?? this.rand).randomNumberBetween(1, maxPossibleIncrement)
                const finalStat = randomIncrement + currentStat
                overflow -= randomIncrement
                stats[stat] = finalStat
            })
        }
        const totalStatSum = stats.athleticism + stats.intellect + stats.charisma
        if (totalStatSum != targetAPSSum) throw new Error("Expected " + targetAPSSum + " stats but got " + totalStatSum)
        else return stats
    }

    newCharacterEntity(characterType: CharacterType, props: { assetRef: string, collection: CharacterCollection }): CharacterEntity {
        const ivAPS = this.characterIVAPS(props.assetRef, props.collection)
        const xpAPS = zeroAPS
        return {
            ...newIQEntity("character-entity", {
                name: this.characterDefaultName(props.assetRef, props.collection),
                assetRef: props.assetRef
            }),
            characterType,
            entityId: v4(),
            assetRef: props.assetRef,
            collection: props.collection,
            race: this.characterRace(props.assetRef, props.collection),
            hp: this.rules.character.natMaxHitPoints(ivAPS, xpAPS),
            ivAPS,
            xpAPS,
        }
    }

    characterCollection(assetRef: string): CharacterCollection {
        const matched = assetRef.match(/^([a-zA-Z]+)(\d+)/)
        if (!matched) throw new Error(`Invalid assetRef: ${assetRef}`)
        switch (matched[1]) {
            case "PixelTile": return "pixel-tiles"
            case "GrandmasterAdventurer": return "grandmaster-adventurers"
            case "AdventurerOfThiolden": return "adventurers-of-thiolden"
            default: throw new Error(`Invalid assetRef: ${assetRef}`)
        }
    }

    characterRace(assetRef: string, collection: CharacterCollection): Race {
        switch (collection) {
            case "pixel-tiles": return this.metadataRegistry.pixelTilesGameMetadata[assetRef].race as Race
            case "grandmaster-adventurers": return this.metadataRegistry.gmasMetadata[assetRef].race as Race
            case "adventurers-of-thiolden":
                const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
                const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                return this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Race"] as Race
        }
    }

    characterIVAPS(assetRef: string, collection: CharacterCollection): APS {
        switch (collection) {
            case "pixel-tiles": switch (this.metadataRegistry.pixelTilesMetadata[assetRef].rarity) {
                case "Common": return { athleticism: 2, intellect: 2, charisma: 2 }
                case "Uncommon": return { athleticism: 4, intellect: 4, charisma: 4 }
                case "Rare": return { athleticism: 6, intellect: 6, charisma: 6 }
                case "Epic": return { athleticism: 8, intellect: 8, charisma: 8 }
                default: return { athleticism: 10, intellect: 10, charisma: 10 }
            }
            case "grandmaster-adventurers":
                const armor = parseInt(this.metadataRegistry.gmasMetadata[assetRef].armor)
                const weapon = parseInt(this.metadataRegistry.gmasMetadata[assetRef].weapon)
                const targetAPSSum = Math.round((armor + weapon) * 30 / 10)
                const deterministicRand = this.rand.seed(assetRef)
                return this.newRandAPS(targetAPSSum, deterministicRand)
            case "adventurers-of-thiolden":
                const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
                const athleticism = this.metadataRegistry.advOfThioldenAppMetadata[idx].ath
                const intellect = this.metadataRegistry.advOfThioldenAppMetadata[idx].int
                const charisma = this.metadataRegistry.advOfThioldenAppMetadata[idx].cha
                return { athleticism, intellect, charisma }
        }
    }

    characterDefaultName(assetRef: string, collection: CharacterCollection): string {
        switch (collection) {
            case "pixel-tiles":
                const pName = this.metadataRegistry.pixelTilesMetadata[assetRef].name
                const realName = (pName.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2]
                return realName
            case "grandmaster-adventurers":
                const aclass = this.metadataRegistry.gmasMetadata[assetRef].class
                return `Grand Master ${aclass}`
            case "adventurers-of-thiolden":
                const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
                const name = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                return name.charAt(0).toUpperCase() + name.slice(1)
        }
    }

    characterType(assetRef: string, collection: CharacterCollection): CharacterType {
        let cclass: string
        switch (collection) {
            case "pixel-tiles":
                cclass = this.metadataRegistry.pixelTilesGameMetadata[assetRef].class
                break
            case "grandmaster-adventurers":
                cclass = this.metadataRegistry.gmasMetadata[assetRef].class
                break
            case "adventurers-of-thiolden":
                const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
                const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
                cclass = this.metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"]
                break
        }
        if ((AdventurerClasses as string[]).includes(cclass)) return { ctype: "adventurer", class: cclass as AdventurerClass }
        else return { ctype: "crafter", class: cclass as CrafterClass }
    }

    characterSprite(assetRef: string, collection: CharacterCollection): string {

        const pixeltileSprite = (): string => {
            return `https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_${assetRef.replace("PixelTile", "")}.png`
        }

        const gmaSprite = (): string => {
            return `https://cdn.ddu.gg/gmas/x3/${assetRef}.png`
        }

        const advOfThioldenSprite = (): string => {
            const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
            const adventurerName = this.metadataRegistry.advOfThioldenAppMetadata[idx].adv
            const chromaOrPlain = this.metadataRegistry.advOfThioldenAppMetadata[idx].chr ? "chroma" : "plain"
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

    newAdventurer = (props: { assetRef: string, collection: CharacterCollection }): CharacterEntity =>
        this.newCharacterEntity(this.characterType(props.assetRef, props.collection), props)

    furnitureDefaultName(assetRef: string, collection: FurnitureCollection): string {
        if (collection == "pixel-tiles") {
            const name = this.metadataRegistry.pixelTilesMetadata[assetRef].name
            const realName = (name.match(/(PixelTile #\d\d?)\s(.+)/) ?? ["", "Metadata Error"])[2]
            return realName
        } else {
            return assetRef
        }
    }
}
