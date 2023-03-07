import { AdventurerClass, APS, CharacterEntity, CrafterClass, newAPS, zeroAPS } from "../character-entity";
import { SkillName } from "../skills";
import { EncounterReward } from "./encounter-reward";

export type Encounter = {
    encounterId: string,
    name: string,
    location: string,
    description: string,
    reward: EncounterReward,
    duration: number,
    strategies: Strategy[],
}

export type ActiveEncounter = {
    activeEncounterId: string,
    encounter: Encounter,
    chosenStrategyIndex: number,
    party: string[],
    claimedAt?: Date,
    createdAt: Date,
    outcome?: EncounterOutcome,
}

export type EncounterOutcome = EncounterSuccessOutcome | EncounterFailureOutcome

export type EncounterSuccessOutcome = {
    ctype: "success-outcome",
    party: CharacterEntity[]
    reward: EncounterReward
}

export type EncounterFailureOutcome = {
    ctype: "failure-outcome",
    party: CharacterEntity[]
}


export type Strategy = {
    name: string,
    description: string,
    challenges: Challenge[],
    combat?: Combat,
}

export type Challenge = {
    name: string,
    description: string,
    difficulty: number,
    solvedBy: (Condition | SkillName)[]
}

export type Combat = {
    willHitPoints: number,
    magicHitPoints: number,
    physicalHitPoints: number,
    resistances: DamageType[],
    weaknesses: DamageType[],
}

export type SkillInfo = {
    name: string,
    description: string,
    benefits: APS,
    requires: {
        aps: APS,
        classes?: (AdventurerClass | CrafterClass)[],
        skills?: string[],
    },
    damage?: DamageType[],
    provokes?: Condition[],
}

export type GeneralDamageType 
    = "Will" | "Magic" | "Physical"

export type DamageType
    = WillDamageType | MagicDamageType | PhysicalDamageType

export type WillDamageType 
    = "Fear" 
    | "Seduction"
    | "Sadness"

export const willDamageTypes = ["Fear", "Seduction", "Sadness"]

export type MagicDamageType
    = "Fire"
    | "Frost"
    | "Shadow"
    | "Nature"
    | "Arcane"

export const magicDamageTypes = ["Fire", "Frost", "Shadow", "Nature", "Arcane"]

export type PhysicalDamageType
    = "Blunt"
    | "Pierce"
    | "Slash"

export const physicalDamageTypes = ["Blunt", "Pierce", "Slash"]

export type Condition
    = "Poisoned"
    | "Bleeding"
    | "Stunned"
    | "Blinded"
    | "Silenced"
    | "Disarmed"
    | "Rooted"
    | "Slowed"
    | "Feared"
    | "Confused"
    | "Asleep"
    | "Charmed" 
    | "Aflame"
    | "Frozen"
    | "Electrified"
    | "Cursed"
    | "Grounded"
    | "Entertained"
