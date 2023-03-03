import { v4 } from "uuid"
import { MetadataRegistry } from "../../../registry-metadata"
import Random from "../../../tools-utils/random"
import { CharacterEntityRuleset } from "./character-entity-ruleset"
import { IQEntity, newIQEntity } from "../iq-entity"
import { APS, newRandAPS, zeroAPS } from "./aps"

export type CharacterEntity = IQEntity<"character-entity"> & {
    characterType: CharacterType
    collection: CharacterCollection
    race: Race
    hp: number
    ivAPS: APS
    xpAPS: APS
}

export type CharacterType 
    = Adventurer | Crafter

export type Race 
    = "human" | "elf" | "tiefling" | "dragonkin" | "worgenkin" 
    | "undead" | "viera" | "troll" | "vulkin" | "orc" | "tauren"

export const Races: Race[] = 
    [ "human" , "elf" , "tiefling" , "dragonkin" , "worgenkin"
    , "undead" , "viera" , "troll" , "vulkin" , "orc" , "tauren" 
    ]

export type CharacterCollection 
    = "grandmaster-adventurers" | "adventurers-of-thiolden" | "pixel-tiles"

export const adventurerCollections: CharacterCollection[] = 
    [ "grandmaster-adventurers" , "adventurers-of-thiolden" , "pixel-tiles" ]

export type NewCharacterEntityProps = {
    assetRef: string
    collection: CharacterCollection
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
            return metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Race"].toLowerCase() as Race
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
            cclass = metadataRegistry.pixelTilesGameMetadata[assetRef].class.toLowerCase()
            break
        case "grandmaster-adventurers": 
            cclass = metadataRegistry.gmasMetadata[assetRef].class.toLowerCase() 
            break
        case "adventurers-of-thiolden":
            const idx = parseInt(assetRef.replace("AdventurerOfThiolden", "")) - 1
            const adventurerName = metadataRegistry.advOfThioldenAppMetadata[idx].adv
            cclass = metadataRegistry.advOfThioldenGameMetadata[adventurerName]["Game Class"].toLowerCase() 
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

/** Adventurer Character */

export type Adventurer = {
    ctype: "adventurer"
    class: AdventurerClass
}

export type AdventurerClass 
    =  "fighter" | "paladin" | "ranger" | "rogue" | "bard" 
    | "mage" | "warlock" | "cleric" | "druid" | "knight"

export const AdventurerClasses: AdventurerClass[] =
    [ "fighter" , "paladin" , "ranger" , "rogue" , "bard"
    , "mage" , "warlock" , "cleric" , "druid" , "knight"
    ]

export type NewAdventurerProps = {
    assetRef: string
    collection: CharacterCollection
}

export const newAdventurer = (metadataRegistry: MetadataRegistry, rules: CharacterEntityRuleset) => (props: NewAdventurerProps): CharacterEntity => 
    newCharacterEntity(metadataRegistry, rules)(characterType(metadataRegistry)(props.assetRef, props.collection), props)

/** Crafter Character */

export type Crafter = {
    ctype: "crafter"
    class: CrafterClass
}

export type CrafterClass 
    = "blacksmith" | "alchemist" | "carpenter" 
    | "cook" | "brewer" | "host" | "trader"
