import { CharacterEntityRuleset } from "./character-entity"
import { QuestRuleset } from "./quests/quest-ruleset"

export type IQRuleset = {
    name: string
    character: CharacterEntityRuleset
    quest: QuestRuleset
}