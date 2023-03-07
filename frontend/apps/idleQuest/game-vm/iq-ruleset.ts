import { APS, apsSum, CharacterEntity } from "./character-entity"
import { ConfigurationCharacter, DamageType, EncounterOutcome, EncounterReward, GeneralDamageType, SkillInfo, Strategy, StrategyConfiguration } from "./encounter"
import { WithEV } from "./iq-entity"
import { IQMeatadataObjectBuilder } from "./iq-metadata-object-builder"
import IQRandom from "./iq-random"
import { SatisfiedRequirements, StakingQuestOutcome, StakingQuestRequirement, StakingReward, TakenStakingQuest } from "./staking-quest"

export interface IQRuleset {
    name: string
    rand: IQRandom
    character: CharacterEntityRuleset
    stakingQuest: StakingQuestRuleset
    encounter: EncounterRuleset
}

export interface CharacterEntityRuleset {
    natMaxHitPoints(ivAPS: APS, xpAPS: APS): number
    evAPS(ivAPS: APS, xpAPS: APS): APS
    totalXPRequiredForNextAPSLevel(currentLevel: number): number
    levelUp(party: CharacterEntity[], reward: EncounterReward, bonus: APS): CharacterEntity[]
    takeDamage(party: CharacterEntity, challengeAPS: APS): CharacterEntity
    /** Helper functions */
    apsLevelByXP(xp: number): number
}

export interface StakingQuestRuleset {
    outcome(takenQuest: TakenStakingQuest, party: CharacterEntity[]): StakingQuestOutcome
    satisfied(requirements: StakingQuestRequirement, party: CharacterEntity[]): SatisfiedRequirements
    reward(requirements: StakingQuestRequirement): StakingReward
    duration(requirements: StakingQuestRequirement): number
}

export interface EncounterRuleset {
    outcome(encounter: Strategy, party: ConfigurationCharacter[]): EncounterOutcome
    strategyConfiguration(strategy: Strategy, party: ConfigurationCharacter[]): StrategyConfiguration
    skillGeneralDamageTypes(skill: SkillInfo): GeneralDamageType[] 
    skillPower(skill: SkillInfo | SkillInfo[], character: CharacterEntity & WithEV): number 
    applyDamageModifiers(power: number, modifiers: { damageTypes: DamageType[], resistances: DamageType[], weaknesses: DamageType[] }): number 
}
