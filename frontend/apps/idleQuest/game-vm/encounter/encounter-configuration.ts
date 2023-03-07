import { CharacterEntity } from "../character-entity"
import { WithEV, WithSkills } from "../iq-entity"
import { Challenge, Combat, SkillInfo, Strategy } from "./encounter"

export type ConfigurationCharacter 
    = CharacterEntity 
    & WithSkills
    & WithEV 

export type StrategyConfiguration = {
    successChance: number,
    strategy: Strategy,
    challenges: ChallengeConfiguration[],
    combat?: CombatConfiguration
}

export type ConfigurationContributor = {
    character: ConfigurationCharacter,
    power: number,
    skills: SkillInfo[]
}

export type ChallengeConfiguration = {
    challenge: Challenge,
    power: number,
    contributors: ConfigurationContributor[]
}

export type CombatConfiguration = {
    combat: Combat,
    damage: {
        will: number,
        magic: number,
        physical: number
    },
    contributors: ConfigurationContributor[]
}
