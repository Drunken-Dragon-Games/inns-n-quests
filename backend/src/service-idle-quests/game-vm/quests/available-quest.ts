import { IQRuleset } from "../iq-ruleset"
import { Quest, Reward } from "./quest"
import { QuestRequirement } from "./quests-requirements"

export type AvailableQuest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: QuestRequirement,
    reward: Reward,
    duration: number,
    slots: number,
}

export const newAvailableQuest = (rules: IQRuleset) => (quest: Quest): AvailableQuest => ({
    questId: quest.questId,
    name: quest.name,
    location: quest.location,
    description: quest.description,
    requirements: quest.requirements,
    reward: rules.quest.reward(quest.requirements),
    duration: rules.quest.duration(quest.requirements),
    slots: quest.slots ?? 5,
})