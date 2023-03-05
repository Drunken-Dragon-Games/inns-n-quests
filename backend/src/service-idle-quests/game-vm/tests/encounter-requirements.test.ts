import path from "path"
import { loadQuestRegistryFromFs } from "../../../registry-quests"
import { all, and, apsRequirement, bonus, fighter, oneOf, or, paladin, parseEasyJsonSyntax, successBonus, warlock } from "../encounter/encounter-requirements"

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
        .toStrictEqual(apsRequirement(1, 1, 1))
    expect(parseEasyJsonSyntax({ "aps": { "athleticism": 1, "intellect": 1, "charisma": 1 } }))
        .toStrictEqual(apsRequirement(1, 1, 1))
    expect(parseEasyJsonSyntax({ "aps": { "ath": 1, "int": 1, "cha": 1 } }))
        .toStrictEqual(apsRequirement(1, 1, 1))
    expect(() => parseEasyJsonSyntax({ "aps": [1, 1, 1, 1] }))
        .toThrow()
})

test("'or' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "or": [ "fighter", "paladin"] }))
        .toStrictEqual(or(fighter, paladin))
    expect(parseEasyJsonSyntax({ "or": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(or(warlock, apsRequirement(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "or": [ "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'and' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "and": [ "fighter", "paladin"] }))
        .toStrictEqual(and(fighter, paladin))
    expect(parseEasyJsonSyntax({ "and": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(and(warlock, apsRequirement(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "and": [ "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'bonus' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "bonus": [0.1, "warlock", { "aps": [1,1,1] }] }))
        .toStrictEqual(bonus(0.1, warlock, apsRequirement(1, 1, 1)))
    expect(parseEasyJsonSyntax({ "bonus": { "amount": 0.1, "condition": "warlock", "requirement": { "aps": [1,1,1] }} }))
        .toStrictEqual(bonus(0.1, warlock, apsRequirement(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "bonus": [0.1, "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'successBonus' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "successBonus": [0.1, "warlock", { "aps": [1,1,1] }] }))
        .toStrictEqual(successBonus(0.1, warlock, apsRequirement(1, 1, 1)))
    expect(parseEasyJsonSyntax({ "successBonus": { "amount": 0.1, "condition": "warlock", "requirement": { "aps": [1,1,1] }} }))
        .toStrictEqual(successBonus(0.1, warlock, apsRequirement(1, 1, 1)))
    expect(() => parseEasyJsonSyntax({ "successBonus": [0.1, "warlock", "paladin", "fighter"] }))
        .toThrow()
})

test("'all' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "all": [ "fighter", "paladin"] }))
        .toStrictEqual(all([fighter, paladin]))
    expect(parseEasyJsonSyntax({ "all": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(all([warlock, apsRequirement(1, 1, 1)]))
    expect(parseEasyJsonSyntax({ "all": [ "warlock", "paladin", "fighter"] }))
        .toStrictEqual(all([warlock, paladin, fighter]))
})

test("'oneOf' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "oneOf": [ "fighter", "paladin"] }))
        .toStrictEqual(oneOf([fighter, paladin]))
    expect(parseEasyJsonSyntax({ "oneOf": [ "warlock", { "aps": [1,1,1] } ] }))
        .toStrictEqual(oneOf([warlock, apsRequirement(1, 1, 1)]))
    expect(parseEasyJsonSyntax({ "oneOf": [ "warlock", "paladin", "fighter"] }))
        .toStrictEqual(oneOf([warlock, paladin, fighter]))
})
