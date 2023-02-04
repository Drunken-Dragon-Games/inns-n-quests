import { Adventurer, AdventurerClass } from "../models"
import { DurationCalculator, RewardCalculator, baseSuccessRate, aps, bonus, fighter, or, paladin, and, cleric, warlock } from "./quest-requirement"

const policies = { dragonSilver: "cd597b903fb228d7e3fac443f9ddb19b3d91bf6b552f38f074386307" }
const rewardCalculator = new RewardCalculator(policies)
const durationCalculator = new DurationCalculator()

const adventurer = (advClass: AdventurerClass, athleticism: number, intellect: number, charisma: number): Adventurer => ({
    adventurerId: "", userId: "", name: "", class: advClass, race: "human", collection: "pixel-tiles", assetRef: "",
    hp: 1, athleticism, intellect, charisma,
})

test("Basic requirement calculations", () => {
    const requirement = 
        bonus(0.1, or(fighter, paladin), aps(10, 10, 10))
    const party = [
        adventurer("warlock", 5,5,5),
        adventurer("cleric", 5,5,5),
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
        "athleticism": 1,
        "intellect": 1,
        "charisma": 1
      }
    }
    expect(reward).toStrictEqual(expectedReward)
    expect(baseSuccessRate(requirement, party)).toBe(0.9)
})

test("Playground", () => {
    const requirement = and(
        and(fighter, or(cleric, paladin)), 
        and(warlock, aps(200, 350, 20)))
    const party = [
        adventurer("fighter", 40,50,5),
        adventurer("druid", 40,50,5),
        adventurer("warlock", 40,85,5),
        adventurer("paladin", 40,150,5),
    ]
    const sRate = baseSuccessRate(requirement, party)
    expect(Math.round(sRate * 100)).toBe(90)
})