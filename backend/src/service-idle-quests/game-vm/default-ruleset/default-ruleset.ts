import IQRandom, { RandomSeedIQRandom } from "../iq-random.js"
import { CharacterEntityRuleset, EncounterRuleset, IQRuleset, StakingQuestRuleset } from "../iq-ruleset.js"
import DefaultCharacterRuleset from "./default-ruleset-character-entity.js"
import DefaultEncounterRuleset from "./default-ruleset-encounter.js"
import DefaultQuestRuleset from "./default-ruleset-staking-quest.js"

export default class DefaultRuleset implements IQRuleset {

    readonly name: string = "Default"
    readonly character: CharacterEntityRuleset
    readonly stakingQuest: StakingQuestRuleset
    readonly encounter: EncounterRuleset

    constructor(
       public readonly rand: IQRandom 
    ){
        this.character = new DefaultCharacterRuleset()
        this.stakingQuest = new DefaultQuestRuleset(this.character, rand)
        this.encounter = new DefaultEncounterRuleset()
    }

    static seed(s: string): IQRuleset {
        return new DefaultRuleset(new RandomSeedIQRandom(s))
    }
}
