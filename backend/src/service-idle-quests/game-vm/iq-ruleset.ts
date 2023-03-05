import Random from "../../tools-utils/random"
import { APS, apsSum, CharacterEntity } from "./character-entity"
import { Reward, QuestRequirement, TakenQuest, QuestOutcome, SatisfiedRequirements, Strategy } from "./encounter"
import { newRandAPS } from "./object-creation"

export interface IQRuleset {
    name: string
    character: CharacterEntityRuleset
    quest: QuestRuleset
}

export interface CharacterEntityRuleset {
    natMaxHitPoints(ivAPS: APS, xpAPS: APS): number
    evAPS(ivAPS: APS, xpAPS: APS): APS
    totalXPRequiredForNextAPSLevel(currentLevel: number): number
    levelUp(party: CharacterEntity[], reward: Reward, bonus: APS): CharacterEntity[]
    takeDamage(party: CharacterEntity, challengeAPS: APS): CharacterEntity
    /** Helper functions */
    apsLevelByXP(xp: number): number
}

export interface QuestRuleset {
    outcome(takenQuest: TakenQuest, party: CharacterEntity[], rand: Random): QuestOutcome
    satisfied(requirements: QuestRequirement, party: CharacterEntity[]): SatisfiedRequirements
    reward(requirements: QuestRequirement): Reward
    duration(requirements: QuestRequirement): number

    encounterOutcome(encounter: Strategy, party: CharacterEntity[], rand: Random): QuestOutcome
    encounterXPReward(encounter: Strategy): Reward 
}

export class CharacterEntityRuleSetProperties {

    constructor(
        public readonly rules: CharacterEntityRuleset,
        public readonly rand: Random,
    ) {}

    apsLevelCongruence = (currentLevel: number) =>
        expect(this.rules.apsLevelByXP(this.rules.totalXPRequiredForNextAPSLevel(currentLevel))).toBe(currentLevel + 1)
    
    apsRandomGenerationCongruence = (targetAPSSum: number) =>
        expect(apsSum(newRandAPS(targetAPSSum, this.rand))).toBe(targetAPSSum)
}
