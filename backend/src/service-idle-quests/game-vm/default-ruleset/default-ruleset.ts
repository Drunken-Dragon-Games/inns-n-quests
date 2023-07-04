import IQRandom, { RandomSeedIQRandom } from "../iq-random"
import { CharacterEntityRuleset, EncounterRuleset, IQRuleset, StakingQuestRuleset } from "../iq-ruleset"
import DefaultCharacterRuleset from "./default-ruleset-character-entity"
import DefaultEncounterRuleset from "./default-ruleset-encounter"
import DefaultQuestRuleset from "./default-ruleset-staking-quest"

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
