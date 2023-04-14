import { IQEntity } from "../iq-entity.js"
import { APS } from "./aps.js"

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
    = "Human" | "Elf" | "Tiefling" | "Dragonkin" | "Worgenkin" 
    | "Undead" | "Viera" | "Troll" | "Vulkin" | "Orc" | "Tauren" | "Slime"

export const Races: Race[] = 
    [ "Human" , "Elf" , "Tiefling" , "Dragonkin" , "Worgenkin"
    , "Undead" , "Viera" , "Troll" , "Vulkin" , "Orc" , "Tauren" , "Slime"
    ]

export type CharacterCollection 
    = "grandmaster-adventurers" | "adventurers-of-thiolden" | "pixel-tiles"

export const CharacterCollections: CharacterCollection[] = 
    [ "grandmaster-adventurers" , "adventurers-of-thiolden" , "pixel-tiles" ]

/** Adventurer Character */

export type Adventurer = {
    ctype: "adventurer"
    class: AdventurerClass
}

export type AdventurerClass 
    =  "Fighter" | "Paladin" | "Ranger" | "Rogue" | "Bard" 
    | "Mage" | "Warlock" | "Cleric" | "Druid" | "Knight"

export const AdventurerClasses: AdventurerClass[] =
    [ "Fighter" , "Paladin" , "Ranger" , "Rogue" , "Bard"
    , "Mage" , "Warlock" , "Cleric" , "Druid" , "Knight"
    ]

/** Crafter Character */

export type Crafter = {
    ctype: "crafter"
    class: CrafterClass
}

export type CrafterClass 
    = "Blacksmith" | "Alchemist" | "Carpenter" 
    | "Cook" | "Brewer" | "Host" | "Trader"

export const CrafterClasses: CrafterClass[] =
    [ "Blacksmith" , "Alchemist" , "Carpenter"
    , "Cook" , "Brewer" , "Host" , "Trader"
    ]

/** All Classes */

export type CharacterClass = AdventurerClass | CrafterClass

export const CharacterClasses: CharacterClass[] = 
    (AdventurerClasses as CharacterClass[]).concat(CrafterClasses)
