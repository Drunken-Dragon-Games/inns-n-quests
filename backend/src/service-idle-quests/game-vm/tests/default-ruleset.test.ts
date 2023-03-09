import { CharacterEntityRuleSetProperties } from '../iq-ruleset'
import DefaultRuleset from '../default-ruleset/default-ruleset'
import IQRandom from '../iq-random'
import { IQMeatadataObjectBuilder } from '../iq-metadata-object-builder'
import { emptyMetadataRegistry, emptyWellKnownPolicies } from '../iq-metadata'
import { loadQuestRegistryFromFs } from '../../state/staking-quests-registry'
import path from 'path'

class UnsafeIQRandom extends IQRandom {
    constructor() { super() }
    genrand(): number { return Math.random() }
    seed(s: string): IQRandom { return this }
}

const random = new UnsafeIQRandom()
const rules = new DefaultRuleset(random)
const objectBuilder = new IQMeatadataObjectBuilder(rules, emptyMetadataRegistry, emptyWellKnownPolicies)
const characterProperties = new CharacterEntityRuleSetProperties(rules.character, objectBuilder)

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

test("Load quest registry", async () => {
    const questsRegistry = await loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "..", "..", "stubs", "test-quest-registry.yaml"), "yaml")
    console.log(JSON.stringify(questsRegistry, null, 2))
    expect(true).toBe(true)
})
