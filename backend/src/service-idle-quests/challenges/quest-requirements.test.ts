import path from "path"
import { Json } from "sequelize/types/utils"
import { loadQuestRegistryFromFs } from "../../registry-quests"
import { Adventurer, AdventurerClass } from "../models"
import { DurationCalculator, RewardCalculator, baseSuccessRate, aps, bonus, fighter, or, paladin, and, cleric, warlock, parseEasyJsonSyntax, all, oneOf, successBonus } from "./quest-requirement"

const policies = { dragonSilver: "cd597b903fb228d7e3fac443f9ddb19b3d91bf6b552f38f074386307" }
const rewardCalculator = new RewardCalculator(policies)
const durationCalculator = new DurationCalculator()

const adventurer = (advClass: AdventurerClass, athleticism: number, intellect: number, charisma: number): Adventurer => ({
    adventurerId: "", userId: "", name: "", class: advClass, race: "human", collection: "pixel-tiles", assetRef: "",
    hp: 1, athleticism, intellect, charisma, athXP: 0, intXP: 0, chaXP: 0
})

test("Basic requirement calculations 1", () => {
    const requirement =
        bonus(0.1, or(fighter, paladin), aps(10, 10, 10))
    const party = [
        adventurer("warlock", 5, 5, 5),
        adventurer("cleric", 5, 5, 5),
    ]
    const reward = rewardCalculator.baseReward(requirement)
    const expectedReward = {
        "currencies": [
            {
                "policyId": "cd597b903fb228d7e3fac443f9ddb19b3d91bf6b552f38f074386307",
                "unit": "DragonSilver",
                "quantity": "35"
            }
        ],
        "apsExperience": {
            "athleticism": 1000,
            "intellect": 1000,
            "charisma": 1000
        }
    }
    expect(reward).toStrictEqual(expectedReward)
    expect(baseSuccessRate(requirement, party)).toBe(0.9)
})

test("Basic requirement calculations 2", () => {
    const requirement = and(
        and(fighter, or(cleric, paladin)),
        and(warlock, aps(200, 350, 20)))
    const party = [
        adventurer("fighter", 40, 50, 5),
        adventurer("druid", 40, 50, 5),
        adventurer("warlock", 40, 85, 5),
        adventurer("paladin", 40, 150, 5),
    ]
    const sRate = baseSuccessRate(requirement, party)
    expect(Math.round(sRate * 100)).toBe(90)
})

test("Quest registry loading yaml", async () => {
    expect(async () => loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "..", "stubs", "test-quest-registry.yaml"), "yaml")).toBeTruthy()
})

test("'classes' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "classes": ["fighter", "paladin", "warlock"] }))
        .toStrictEqual(all([fighter, paladin, warlock]))
    expect(() => parseEasyJsonSyntax({ "classes": ["fighter", "paladin", "warlock", "unknown"] }))
        .toThrow()
})

test("'aps' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "aps": [1, 1, 1] }))
        .toStrictEqual(aps(1, 1, 1))
    expect(parseEasyJsonSyntax({ "aps": { "athleticism": 1, "intellect": 1, "charisma": 1 } }))
        .toStrictEqual(aps(1, 1, 1))
    expect(parseEasyJsonSyntax({ "aps": { "ath": 1, "int": 1, "cha": 1 } }))
        .toStrictEqual(aps(1, 1, 1))
    expect(() => parseEasyJsonSyntax({ "aps": [1, 1, 1, 1] }))
        .toThrow()
})

test("'or' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "or": [ "fighter", "paladin"] }))
        .toStrictEqual(or(fighter, paladin))
    expect(parseEasyJsonSyntax({ "or": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(or(warlock, aps(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "or": [ "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'and' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "and": [ "fighter", "paladin"] }))
        .toStrictEqual(and(fighter, paladin))
    expect(parseEasyJsonSyntax({ "and": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(and(warlock, aps(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "and": [ "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'bonus' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "bonus": [0.1, "warlock", { "aps": [1,1,1] }] }))
        .toStrictEqual(bonus(0.1, warlock, aps(1, 1, 1)))
    expect(parseEasyJsonSyntax({ "bonus": { "amount": 0.1, "condition": "warlock", "requirement": { "aps": [1,1,1] }} }))
        .toStrictEqual(bonus(0.1, warlock, aps(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "bonus": [0.1, "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'successBonus' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "successBonus": [0.1, "warlock", { "aps": [1,1,1] }] }))
        .toStrictEqual(successBonus(0.1, warlock, aps(1, 1, 1)))
    expect(parseEasyJsonSyntax({ "successBonus": { "amount": 0.1, "condition": "warlock", "requirement": { "aps": [1,1,1] }} }))
        .toStrictEqual(successBonus(0.1, warlock, aps(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "successBonus": [0.1, "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'all' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "all": [ "fighter", "paladin"] }))
        .toStrictEqual(all([fighter, paladin]))
    expect(parseEasyJsonSyntax({ "all": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(all([warlock, aps(1, 1, 1)]))
    expect(parseEasyJsonSyntax({ "all": [ "warlock", "paladin", "fighter"] }))
        .toStrictEqual(all([warlock, paladin, fighter]))
})

test("'oneOf' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "oneOf": [ "fighter", "paladin"] }))
        .toStrictEqual(oneOf([fighter, paladin]))
    expect(parseEasyJsonSyntax({ "oneOf": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(oneOf([warlock, aps(1, 1, 1)]))
    expect(parseEasyJsonSyntax({ "oneOf": [ "warlock", "paladin", "fighter"] }))
        .toStrictEqual(oneOf([warlock, paladin, fighter]))
})
