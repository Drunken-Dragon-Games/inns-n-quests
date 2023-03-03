import Random from "../../../tools-utils/random"
import { apsSum, newRandAPS } from "./aps"
import { CharacterEntityRuleset } from "./character-entity-ruleset"

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
