import { QuestRequirement, Adventurer, AdventurerClass } from "../models"
import { successRate } from "./quest-requirement"

type APS = { athleticism: number, intellect: number, charisma: number }

const genAdventurer = (advClass: AdventurerClass, aps: APS): Adventurer => {
    return {
        adventurerId: "",
        userId: "",
        name: "",
        class: advClass,
        race: "human",
        collection: "pixel-tiles",
        assetRef: "",
        athleticism: aps.athleticism,
        intellect: aps.intellect,
        charisma: aps.charisma,
    }
}

test("Basic requirement success rate calculation", () => {
    const requirement: QuestRequirement = {
        ctype: "bonus-requirement",
        bonus: 0.1,
        left: {
            ctype: "or-requirement",
            right: {
                ctype: "class-requirement",
                class: "fighter",
            },
            left: {
                ctype: "class-requirement",
                class: "paladin",
            },
        },
        right: {
            ctype: "aps-requirement",
            athleticism: 10,
            intellect: 10,
            charisma: 10,
        },
    }
    const party: Adventurer[] = [
        genAdventurer("warlock", { athleticism: 5, intellect: 5, charisma: 5 }),
        genAdventurer("cleric", { athleticism: 5, intellect: 5, charisma: 5 }),
    ]
    expect(successRate(requirement, party)).toBe(0.9)
})