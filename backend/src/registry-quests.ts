import { Quest } from "./service-idle-quests/models";
import { isQuest } from "./service-idle-quests/challenges/quest-validation";
import Random from "./tools-utils/random";
import axios from "axios"
import YAML from "yaml"
import { readFile } from "fs/promises";
import { URL } from "url";
import { parseEasyJsonSyntax } from "./service-idle-quests/challenges/quest-requirement";

export type QuestRegistry = { [questId: string]: Quest }

export async function loadQuestRegistry(location: string | URL, format: "json" | "yaml" = "json"): Promise<QuestRegistry> {
    if (location instanceof URL) return await loadQuestRegistryFromWeb(location.toString(), format)
    else return await loadQuestRegistryFromFs(location, format)
}

export async function loadQuestRegistryFromWeb(location: string, format: "json" | "yaml"): Promise<QuestRegistry> {
    const response = (await axios.get<string>(location)).data
    if (format === "json") return parseJsonQuestRegistry(response)
    else if (format === "yaml") return parseYamlQuestRegistry(response)
    else throw new Error("Unknown format: " + format)
}

export async function loadQuestRegistryFromFs(location: string, format: "json" | "yaml"): Promise<QuestRegistry> {
    const file = await readFile(location, "utf8")
    if (format === "json") return parseJsonQuestRegistry(file)
    else if (format === "yaml") return parseYamlQuestRegistry(file)
    else throw new Error("Unknown format: " + format)
}

export function parseJsonQuestRegistry(json: string): QuestRegistry {
    const response = JSON.parse(json)
    return validateJsonQuestRegistry(response)
}

export function parseYamlQuestRegistry(yaml: string): QuestRegistry {
    const response = YAML.parseAllDocuments(yaml).map(doc => doc.toJSON())
    return validateJsonQuestRegistry(response)
}

export function validateJsonQuestRegistry(json: object): QuestRegistry {

    const parseEasyJson = (quest: any): any => {
        if (typeof quest.requirements !== "undefined") 
            return { ...quest, requirements: parseEasyJsonSyntax(quest.requirements) }
        else 
            return quest
    }

    const validateQuest = (json: any): Quest => {
        const quest = parseEasyJson(json)
        if (isQuest(quest)) return quest
        else throw new Error("The quest registry contains an invalid quest: " + JSON.stringify(quest))
    }

    if (Array.isArray(json)) {
        return json.reduce((acc: QuestRegistry, json: any) => {
            const quest = validateQuest(json)
            return { ...acc, [quest.questId]: quest }
        }, {})
    } else if (typeof json === "object") {
        const quest = validateQuest(json)
        return { [quest.questId]: quest }
    } else 
        throw new Error("The quest registry does not contain an array")
}

export function pickRandomQuestsByLocation(location: string, quantity: number, questRegistry: QuestRegistry, rand: Random): Quest[] {
    const quests = Object.values(questRegistry).filter(quest => quest.location === location)
    return rand.shuffle(quests).slice(0, quantity)
}

export function pickRandomQuests(quantity: number, questRegistry: QuestRegistry, rand: Random): Quest[] {
    return rand.shuffle(Object.values(questRegistry)).slice(0, quantity)
}