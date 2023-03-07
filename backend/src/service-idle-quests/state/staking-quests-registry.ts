import axios from "axios"
import YAML from "yaml"
import { readFile } from "fs/promises";
import { URL } from "url";
import { IQRandom, isQuest, parseEasyJsonSyntax, StakingQuest } from "../game-vm";

export type StakingQuestRegistry = { [questId: string]: StakingQuest }

export async function loadQuestRegistry(location: string | URL, format: "json" | "yaml" = "json"): Promise<StakingQuestRegistry> {
    if (location instanceof URL) return await loadQuestRegistryFromWeb(location.toString(), format)
    else return await loadQuestRegistryFromFs(location, format)
}

export async function loadQuestRegistryFromWeb(location: string, format: "json" | "yaml"): Promise<StakingQuestRegistry> {
    const response = (await axios.get<string>(location)).data
    if (format === "json") return parseJsonQuestRegistry(response)
    else if (format === "yaml") return parseYamlQuestRegistry(response)
    else throw new Error("Unknown format: " + format)
}

export async function loadQuestRegistryFromFs(location: string, format: "json" | "yaml"): Promise<StakingQuestRegistry> {
    const file = await readFile(location, "utf8")
    if (format === "json") return parseJsonQuestRegistry(file)
    else if (format === "yaml") return parseYamlQuestRegistry(file)
    else throw new Error("Unknown format: " + format)
}

export function parseJsonQuestRegistry(json: string): StakingQuestRegistry {
    const response = JSON.parse(json)
    return validateJsonQuestRegistry(response)
}

export function parseYamlQuestRegistry(yaml: string): StakingQuestRegistry {
    const response = YAML.parseAllDocuments(yaml).map(doc => doc.toJSON())
    return validateJsonQuestRegistry(response)
}

export function validateJsonQuestRegistry(json: object): StakingQuestRegistry {

    const parseEasyJson = (quest: any): any => {
        if (typeof quest.requirements !== "undefined") 
            return { ...quest, requirements: parseEasyJsonSyntax(quest.requirements) }
        else 
            return quest
    }

    const validateQuest = (json: any): StakingQuest => {
        const quest = parseEasyJson(json)
        if (isQuest(quest)) return quest
        else throw new Error("The quest registry contains an invalid quest: " + JSON.stringify(quest))
    }

    if (Array.isArray(json)) {
        return json.reduce((acc: StakingQuestRegistry, json: any) => {
            const quest = validateQuest(json)
            return { ...acc, [quest.questId]: quest }
        }, {})
    } else if (typeof json === "object") {
        const quest = validateQuest(json)
        return { [quest.questId]: quest }
    } else 
        throw new Error("The quest registry does not contain an array")
}

export function pickRandomQuestsByLocation(location: string, quantity: number, questRegistry: StakingQuestRegistry, rand: IQRandom): StakingQuest[] {
    const quests = Object.values(questRegistry).filter(quest => quest.location === location)
    return rand.shuffle(quests).slice(0, quantity)
}

export function pickRandomQuests(quantity: number, questRegistry: StakingQuestRegistry, rand: IQRandom): StakingQuest[] {
    return rand.shuffle(Object.values(questRegistry)).slice(0, quantity)
}