import Random from '../../../tools-utils/random'
import { CharacterEntityRuleSetProperties } from '../iq-ruleset'
import DefaultRuleset from '../default-ruleset/default-ruleset'

const rules = new DefaultRuleset()//wellKnownPoliciesMainnet)
const rand = new Random("test")
const characterProperties = new CharacterEntityRuleSetProperties(rules.character, rand)

test("Leveling Equations", () => {
    characterProperties.apsLevelCongruence(1)
    characterProperties.apsLevelCongruence(20)
    characterProperties.apsLevelCongruence(76)
    characterProperties.apsLevelCongruence(123)
})

test("APS Generation", () => {
    characterProperties.apsRandomGenerationCongruence(3)
    characterProperties.apsRandomGenerationCongruence(12)
    characterProperties.apsRandomGenerationCongruence(30)
    characterProperties.apsRandomGenerationCongruence(28)
})

test("playground", () => {
    expect(true).toBe(true)
})
