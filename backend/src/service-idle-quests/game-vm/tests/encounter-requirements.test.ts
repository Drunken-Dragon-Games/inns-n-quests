import path from "path"
import { loadQuestRegistryFromFs } from "../../state/staking-quests-registry.js"
import { all, and, apsRequirement, assetRefReq, rewardBonus, collectionReq, fighter, oneOf, or, paladin, parseEasyJsonSyntax, successBonus, warlock } from "../staking-quest/staking-quest-requirements.js"

test("Quest registry loading yaml", async () => {
    expect(async () => loadQuestRegistryFromFs(path.join(__dirname, "..", "..", "..", "stubs", "test-quest-registry.yaml"), "yaml")).toBeTruthy()
})

test("'collections' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "collections": ["pixel-tiles", "grandmaster-adventurers", "adventurers-of-thiolden"] }))
        .toStrictEqual(all([collectionReq("pixel-tiles"), collectionReq("grandmaster-adventurers"), collectionReq("adventurers-of-thiolden")]))
    expect(() => parseEasyJsonSyntax({ "collections": ["unknown"] }))
        .toThrow()
})

test("'classes' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "classes": ["Fighter", "Paladin", "Warlock"] }))
        .toStrictEqual(all([fighter, paladin, warlock]))
    expect(() => parseEasyJsonSyntax({ "classes": ["fighter", "paladin", "warlock", "unknown"] }))
        .toThrow()
})

test("'assets' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "assets": ["PixelTile1", "AdventurerOfThiolden23", "GrandmasterAdventurer1023"] }))
        .toStrictEqual(all([assetRefReq("PixelTile1"), assetRefReq("AdventurerOfThiolden23"), assetRefReq("GrandmasterAdventurer1023")]))
    expect(() => parseEasyJsonSyntax({ "classes": ["PixelTile1", "AdvOfThiolden23"] }))
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

test("'rewardBonus' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "rewardBonus": 0.1 }))
        .toStrictEqual(rewardBonus(0.1))
})

test("'successBonus' easy json syntax", () => {
    expect(parseEasyJsonSyntax({ "successBonus": 0.1 }))
        .toStrictEqual(successBonus(0.1))
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
