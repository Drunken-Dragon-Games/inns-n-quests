import { APS, apsSum, CharacterEntity } from "./character-entity"
import { EncounterReward, EncounterOutcome, Strategy } from "./encounter"
import { IQMeatadataObjectBuilder } from "./iq-metadata-object-builder"
import IQRandom from "./iq-random"
import { TakenStakingQuest, StakingQuestRequirement, SatisfiedRequirements, StakingReward, StakingQuestOutcome } from "./staking-quest"

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
    outcome(encounter: Strategy, party: CharacterEntity[]): EncounterOutcome
}

export class CharacterEntityRuleSetProperties {

    constructor(
        private readonly rules: CharacterEntityRuleset,
        private readonly create: IQMeatadataObjectBuilder
    ) {}

    apsLevelCongruence = (currentLevel: number) =>
        expect(this.rules.apsLevelByXP(this.rules.totalXPRequiredForNextAPSLevel(currentLevel))).toBe(currentLevel + 1)
    
    apsRandomGenerationCongruence = (targetAPSSum: number) =>
        expect(apsSum(this.create.newRandAPS(targetAPSSum, this.create.rand))).toBe(targetAPSSum)
}
