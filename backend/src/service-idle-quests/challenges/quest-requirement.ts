import { AssetManagementService } from "../../service-asset-management"
import { Adventurer, adventurerClasses, AndRequirement, APS, APSRequirement, BonusRequirement, ClassRequirement, SuccessBonus, OrRequirement, QuestRequirement, Reward } from "../models"
import { apsReward, apsSum, AssetRewards, bestReward, mergeRewards } from "./reward"

export function isQuestRequirement(obj: any): obj is QuestRequirement {

    function isAndRequirement(obj: any): obj is AndRequirement {
        return obj.ctype === "and-requirement" && isQuestRequirement(obj.left) && isQuestRequirement(obj.right)
    }

    function isOrRequirement(obj: any): obj is OrRequirement {
        return obj.ctype === "or-requirement" && isQuestRequirement(obj.left) && isQuestRequirement(obj.right)
    }

    function isBonusRequirement(obj: any): obj is BonusRequirement {
        return obj.ctype === "bonus-requirement" && isQuestRequirement(obj.left) && isQuestRequirement(obj.right)
    }

    function isAPSRequirement(obj: any): obj is APSRequirement {
        return obj.ctype === "aps-requirement" && typeof obj.athleticism === "number" && typeof obj.intellect === "number" && typeof obj.charisma === "number"
    }

    function isClassRequirement(obj: any): obj is ClassRequirement {
        return obj.ctype === "class-requirement" && typeof obj.class === "string" && adventurerClasses.includes(obj.class)
    }

    return isAndRequirement(obj) || isOrRequirement(obj) || isBonusRequirement(obj) || isAPSRequirement(obj) || isClassRequirement(obj)
}

export function successRate(requirement: QuestRequirement, inventory: Adventurer[]): number {

    const andRequirementSuccessRate = (requirement: AndRequirement): number => {
        const leftSuccessRate = successRate(requirement.left, inventory)
        const rightSuccessRate = successRate(requirement.right, inventory)
        return 1 * leftSuccessRate * rightSuccessRate == 0 ? 0 : Math.min(leftSuccessRate, rightSuccessRate)
    }

    const orRequirementSuccessRate = (requirement: OrRequirement): number => 
        Math.max(successRate(requirement.left, inventory), successRate(requirement.right, inventory))

    const bonusRequirementSuccessRate = (requirement: BonusRequirement | SuccessBonus): number => {
        const leftSuccessRate = successRate(requirement.left, inventory)
        const rightSuccessRate = successRate(requirement.right, inventory)
        const bonus = leftSuccessRate == 0 ? 0 - requirement.bonus : requirement.bonus
        return Math.min(rightSuccessRate + bonus, 1)
    }

    const apsRequirementSuccessRate = (requirement: APSRequirement): number => {

        const adventurersAPSSum = (inventory: Adventurer[]): { athleticism: number, intellect: number, charisma: number } => {
            return inventory.reduce((acc, item) => {
                return {
                    athleticism: acc.athleticism + item.athleticism,
                    intellect: acc.intellect + item.intellect,
                    charisma: acc.charisma + item.charisma,
                }
            }, { athleticism: 0, intellect: 0, charisma: 0 })
        }

        const aAPSSum = adventurersAPSSum(inventory)
        const athDiff = Math.max(requirement.athleticism - aAPSSum.athleticism, 0)
        const intDiff = Math.max(requirement.intellect - aAPSSum.intellect, 0)
        const chaDiff = Math.max(requirement.charisma - aAPSSum.charisma, 0)
        const result = 1 - (athDiff + intDiff + chaDiff) / (requirement.athleticism + requirement.intellect + requirement.charisma)
        return result
    }

    const classRequirementSuccessRate = (requirement: ClassRequirement): number =>
        inventory.find(item => item.class === requirement.class) ? 1 : 0

    if (requirement.ctype === "aps-requirement") 
        return apsRequirementSuccessRate(requirement)
    else if (requirement.ctype === "class-requirement") 
        return classRequirementSuccessRate(requirement)
    else if (requirement.ctype === "bonus-requirement") 
        return bonusRequirementSuccessRate(requirement)
    else if (requirement.ctype === "only-success-bonus-requirement")
        return bonusRequirementSuccessRate(requirement)
    else if (requirement.ctype === "and-requirement") 
        return andRequirementSuccessRate(requirement)
    else if (requirement.ctype === "time-modifier")
        return successRate(requirement.continuation, inventory)
    else if (requirement.ctype === "reward-modifier")
        return successRate(requirement.continuation, inventory)
    else 
        return orRequirementSuccessRate(requirement)
}

export class RewardCalculator {

    public readonly assetRewards: AssetRewards

    constructor(
        private readonly assetManagementService: AssetManagementService, 
        private readonly rewardFactor: number = 1
    ) {
        this.assetRewards = new AssetRewards(assetManagementService)
    }

    reward(questRequirement: QuestRequirement): Reward {

        const andRequirementReward = (requirement: AndRequirement | BonusRequirement): Reward => {
            const leftReward = this.reward(requirement.left)
            const rightReward = this.reward(requirement.right)
            return mergeRewards(leftReward, rightReward)
        }

        const orRequirementReward = (requirement: OrRequirement): Reward => {
            const leftReward = this.reward(requirement.left)
            const rightReward = this.reward(requirement.right)
            return bestReward(leftReward, rightReward)
        }

        const onlySuccessBonusRequirementReward = (requirement: SuccessBonus): Reward => 
            this.reward(requirement.right)

        const apsRequirementReward = (requirement: APSRequirement): Reward => {
            const dragonSilverReward = this.assetRewards.dragonSilver(
                (apsSum({
                    athleticism: requirement.athleticism,
                    intellect: requirement.intellect,
                    charisma: requirement.charisma,
                }) * this.rewardFactor).toString())
            const experienceReward = apsReward({
                athleticism: requirement.athleticism * 0.1 * this.rewardFactor,
                intellect: requirement.intellect * 0.1 * this.rewardFactor,
                charisma: requirement.charisma * 0.1 * this.rewardFactor,
            })
            return mergeRewards(dragonSilverReward, experienceReward)
        }

        const classRequirementReward = (requirement: ClassRequirement): Reward => {
            return this.assetRewards.dragonSilver("5")
        }

        if (questRequirement.ctype === "aps-requirement")
            return apsRequirementReward(questRequirement)
        else if (questRequirement.ctype === "class-requirement")
            return classRequirementReward(questRequirement)
        else if (questRequirement.ctype === "bonus-requirement")
            return andRequirementReward(questRequirement)
        else if (questRequirement.ctype === "only-success-bonus-requirement")
            return onlySuccessBonusRequirementReward(questRequirement)
        else if (questRequirement.ctype === "and-requirement")
            return andRequirementReward(questRequirement)
        else if (questRequirement.ctype === "time-modifier")
            return this.reward(questRequirement.continuation)
        else if (questRequirement.ctype === "reward-modifier")
            return mergeRewards(this.reward(questRequirement.continuation), questRequirement.modifier)
        else
            return orRequirementReward(questRequirement)
    }
}

export class DurationCalculator {

    constructor(private readonly durationFactor: number = 1) {}

    duration(requirement: QuestRequirement): number {
        if (requirement.ctype === "aps-requirement")
            return apsSum({ athleticism: requirement.athleticism, intellect: requirement.intellect, charisma: requirement.charisma }) * 1000 * this.durationFactor
        else if (requirement.ctype === "class-requirement")
            return 0
        else if (requirement.ctype === "bonus-requirement")
            return this.duration(requirement.right)
        else if (requirement.ctype === "only-success-bonus-requirement")
            return this.duration(requirement.right)
        else if (requirement.ctype === "and-requirement")
            return this.duration(requirement.left) + this.duration(requirement.right)
        else if (requirement.ctype === "or-requirement")
            return Math.max(this.duration(requirement.left), this.duration(requirement.right))
        else if (requirement.ctype === "time-modifier")
            switch (requirement.operator) {
                case "add": return this.duration(requirement.continuation) + requirement.modifier
                case "multiply": return this.duration(requirement.continuation) * requirement.modifier
            }
        else if (requirement.ctype === "reward-modifier")
            return this.duration(requirement.continuation)
        else
            return 0
    }
}