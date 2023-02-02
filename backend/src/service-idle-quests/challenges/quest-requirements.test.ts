import { AssetManagementService } from "../../service-asset-management"
import { wellKnownPolicies } from "../../service-asset-management/registry/registry-testnet"
import { QuestRequirement, Adventurer, AdventurerClass, APS } from "../models"
import { RewardCalculator, successRate } from "./quest-requirement"

const assetManagementServiceMock = (): AssetManagementService => {
    const mocked = {
        loadDatabaseModels: jest.fn(),
        unloadDatabaseModels: jest.fn(),
        health: jest.fn(),
        registry: jest.fn(),
        wellKnownPolicies: jest.fn(),
        list: jest.fn(),
        grant: jest.fn(),
        claim: jest.fn(),
        submitClaimSignature: jest.fn(),
        claimStatus: jest.fn(),
        revertStaledClaims: jest.fn(),
    }
    jest.spyOn(mocked, "wellKnownPolicies")
        .mockReturnValue(wellKnownPolicies)
    return mocked
}

const assetManagementService = assetManagementServiceMock()

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

test("Basic requirement calculations", () => {
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
    const rewardCalculator = new RewardCalculator(assetManagementService)
    const reward = rewardCalculator.reward(requirement)
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
    expect(successRate(requirement, party)).toBe(0.9)
})

test("Playground", () => {

    const requirement: QuestRequirement = {
        ctype: "and-requirement",
        left: {
            ctype: "and-requirement",
            left: {
                ctype: "class-requirement",
                class: "fighter",
            },
            right: {
                ctype: "or-requirement",
                left: {
                    ctype: "class-requirement",
                    class: "paladin",
                },
                right: {
                    ctype: "class-requirement",
                    class: "cleric",
                },
            },
        },
        right: {
            ctype: "and-requirement",
            left: {
                ctype: "class-requirement",
                class: "fighter",
            },
            right: {
                ctype: "and-requirement",
                left: {
                    ctype: "class-requirement",
                    class: "warlock",
                },
                right: {
                    ctype: "aps-requirement",
                    athleticism: 200,
                    intellect: 350,
                    charisma: 20,
                },
            },
        }
    }
    const party: Adventurer[] = [
        genAdventurer("fighter", { athleticism: 40, intellect: 50, charisma: 5 }),
        genAdventurer("druid", { athleticism: 40, intellect: 50, charisma: 5 }),
        genAdventurer("warlock", { athleticism: 40, intellect: 85, charisma: 5 }),
        genAdventurer("paladin", { athleticism: 40, intellect: 150, charisma: 5 }),
    ]
    const sRate = successRate(requirement, party)
    const rewardCalculator = new RewardCalculator(assetManagementService)
    expect(Math.round(sRate * 100)).toBe(90)
})