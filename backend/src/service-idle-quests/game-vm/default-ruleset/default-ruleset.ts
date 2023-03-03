import { WellKnownPolicies } from "../../../registry-policies"
import { CharacterEntityRuleset } from "../character-entity"
import { IQRuleset } from "../iq-ruleset"
import { AssetRewards, QuestRuleset } from "../quests"
import DefaultCharacterRuleset from "./character-entity"
import DefaultQuestRuleset from "./quest"

export default class DefaultRuleset implements IQRuleset {

    readonly name: string = "Default"
    readonly character: CharacterEntityRuleset
    readonly quest: QuestRuleset

    constructor(
        wellKnownPolicies: WellKnownPolicies,
    ){
        const assetRewards = new AssetRewards(wellKnownPolicies)
        this.character = DefaultCharacterRuleset
        this.quest = new DefaultQuestRuleset(DefaultCharacterRuleset, assetRewards)
    }
}
