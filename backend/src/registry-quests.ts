import { Quest } from "./service-idle-quests/models";
import axios from "axios"
import { isQuest } from "./service-idle-quests/challenges/quest-validation";
import Random from "./tools-utils/random";

export type QuestRegistry = { [questId: string]: Quest }

export async function loadQuestRegistry(location: string): Promise<QuestRegistry> {
    const response = (await axios.get(location)).data
    if (Array.isArray(response)) {
        return response.reduce((acc: QuestRegistry, quest: any) => {
            if (isQuest(quest)) return { ...acc, [quest.questId]: quest } 
            else throw new Error("The quest registry contains an invalid quest: " + JSON.stringify(quest))
        }, {})
    }
    else throw new Error("The quest registry does not contain an array")
}

export function pickRandomQuestsByLocation(location: string, quantity: number, questRegistry: QuestRegistry, rand: Random): Quest[] {
    const quests = Object.values(questRegistry).filter(quest => quest.location === location)
    return rand.shuffle(quests).slice(0, quantity)
}

export function pickRandomQuests(quantity: number, questRegistry: QuestRegistry, rand: Random): Quest[] {
    return rand.shuffle(Object.values(questRegistry)).slice(0, quantity)
}