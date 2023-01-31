import { Item, QuestRequirement, Adventurer } from "../models"
import { successRate } from "./requirements"

type APS = { athleticism: number, intellect: number, charisma: number }

const genAdventurer = (advClass: string, aps: APS): Adventurer => {
    return {
        ctype: "adventurer",
        adventurerId: "",
        name: "",
        class: advClass,
        race: "human",
        collection: "gma",
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
    const party: Item[] = [
        genAdventurer("warlock", { athleticism: 5, intellect: 5, charisma: 5 }),
        genAdventurer("cleric", { athleticism: 5, intellect: 5, charisma: 5 }),
    ]
    expect(successRate(requirement, party)).toBe(0.9)
})