import { CharacterEntity } from "../character-entity"
import { Reward } from "./quest"
import { QuestRequirement } from "./quests-requirements"

export type QuestRuleset = {
    successRate: (requirements: QuestRequirement, party: CharacterEntity[]) => number
    reward: (requirements: QuestRequirement) => Reward
    duration: (requirements: QuestRequirement) => number
}
