import { QuestRequirement } from "./encounter-requirements"
import { Reward } from "./reward"

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
