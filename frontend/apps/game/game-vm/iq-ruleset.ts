import { APS, CharacterEntity } from "./character-entity"
import { ConfigurationCharacter, DamageType, EncounterOutcome, EncounterReward, GeneralDamageType, SkillInfo, Strategy, StrategyConfiguration } from "./encounter"
import { WithEV } from "./iq-entity"
import IQRandom from "./iq-random"
import { StakingQuest, StakingQuestConfiguration, StakingQuestOutcome, StakingQuestRequirement, StakingQuestRequirementInfo, StakingQuestSatisfactionInfo } from "./staking-quest"

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
    outcome(quest: StakingQuest, party: CharacterEntity[]): StakingQuestOutcome
    questConfiguration(quest: StakingQuest, party: CharacterEntity[]): StakingQuestConfiguration 
    satisfaction(requirement: StakingQuestRequirement, party: CharacterEntity[]): StakingQuestSatisfactionInfo
    requirementInfo(requirement: StakingQuestRequirement): StakingQuestRequirementInfo
}

export interface EncounterRuleset {
    outcome(encounter: Strategy, party: ConfigurationCharacter[]): EncounterOutcome
    strategyConfiguration(strategy: Strategy, party: ConfigurationCharacter[]): StrategyConfiguration
    skillGeneralDamageTypes(skill: SkillInfo): GeneralDamageType[] 
    skillPower(skill: SkillInfo | SkillInfo[], character: CharacterEntity & WithEV): number 
    applyDamageModifiers(power: number, modifiers: { damageTypes: DamageType[], resistances: DamageType[], weaknesses: DamageType[] }): number 
}
