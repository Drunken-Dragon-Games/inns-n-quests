import { WellKnownPolicies } from "../../../registry-policies"
import { CharacterEntityRuleset, IQRuleset, QuestRuleset } from "../iq-ruleset"
//import { ItemRewards } from "../encounter"
import DefaultCharacterRuleset from "./default-ruleset-character-entity"
import DefaultQuestRuleset from "./default-ruleset-quest"

export default class DefaultRuleset implements IQRuleset {

    readonly name: string = "Default"
    readonly character: CharacterEntityRuleset
    readonly quest: QuestRuleset

    constructor(
        //assetRewards: ItemRewards,
    ){
        this.character = new DefaultCharacterRuleset()
        this.quest = new DefaultQuestRuleset(this.character)//, assetRewards)
    }
}
