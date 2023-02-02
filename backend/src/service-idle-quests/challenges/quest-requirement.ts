import { AssetManagementService } from "../../service-asset-management"
import { Adventurer, AndRequirement, APSRequirement, BonusRequirement, ClassRequirement, SuccessBonusRequirement, OrRequirement, QuestRequirement, Reward } from "../models"
import { apsReward, apsSum, AssetRewards, bestReward, mergeRewards } from "./reward"

export function baseSuccessRate(requirement: QuestRequirement, inventory: Adventurer[]): number {

    const andRequirementSuccessRate = (requirement: AndRequirement): number => {
        const leftSuccessRate = baseSuccessRate(requirement.left, inventory)
        const rightSuccessRate = baseSuccessRate(requirement.right, inventory)
        return 1 * leftSuccessRate * rightSuccessRate == 0 ? 0 : Math.min(leftSuccessRate, rightSuccessRate)
    }

    const orRequirementSuccessRate = (requirement: OrRequirement): number => 
        Math.max(baseSuccessRate(requirement.left, inventory), baseSuccessRate(requirement.right, inventory))

    const bonusRequirementSuccessRate = (requirement: BonusRequirement | SuccessBonusRequirement): number => {
        const leftSuccessRate = baseSuccessRate(requirement.left, inventory)
        const rightSuccessRate = baseSuccessRate(requirement.right, inventory)
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
    else if (requirement.ctype === "success-bonus-requirement")
        return bonusRequirementSuccessRate(requirement)
    else if (requirement.ctype === "and-requirement") 
        return andRequirementSuccessRate(requirement)
    else 
        return orRequirementSuccessRate(requirement)
}

export class RewardCalculator {

    public readonly assetRewards: AssetRewards

    constructor(
        assetManagementService: AssetManagementService, 
        private readonly rewardFactor: number = 1
    ) {
        this.assetRewards = new AssetRewards(assetManagementService)
    }

    baseReward(questRequirement: QuestRequirement): Reward {

        const andRequirementReward = (requirement: AndRequirement | BonusRequirement): Reward => {
            const leftReward = this.baseReward(requirement.left)
            const rightReward = this.baseReward(requirement.right)
            return mergeRewards(leftReward, rightReward)
        }

        const orRequirementReward = (requirement: OrRequirement): Reward => {
            const leftReward = this.baseReward(requirement.left)
            const rightReward = this.baseReward(requirement.right)
            return bestReward(leftReward, rightReward)
        }

        const onlySuccessBonusRequirementReward = (requirement: SuccessBonusRequirement): Reward => 
            this.baseReward(requirement.right)

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
        else if (questRequirement.ctype === "success-bonus-requirement")
            return onlySuccessBonusRequirementReward(questRequirement)
        else if (questRequirement.ctype === "and-requirement")
            return andRequirementReward(questRequirement)
        else
            return orRequirementReward(questRequirement)
    }
}

export class DurationCalculator {

    constructor(private readonly durationFactor: number = 1) {}

    baseDuration(requirement: QuestRequirement): number {
        if (requirement.ctype === "aps-requirement")
            return apsSum({ athleticism: requirement.athleticism, intellect: requirement.intellect, charisma: requirement.charisma }) * 1000 * this.durationFactor
        else if (requirement.ctype === "class-requirement")
            return 0
        else if (requirement.ctype === "bonus-requirement")
            return this.baseDuration(requirement.right)
        else if (requirement.ctype === "success-bonus-requirement")
            return this.baseDuration(requirement.right)
        else if (requirement.ctype === "and-requirement")
            return this.baseDuration(requirement.left) + this.baseDuration(requirement.right)
        else if (requirement.ctype === "or-requirement")
            return Math.max(this.baseDuration(requirement.left), this.baseDuration(requirement.right))
        else
            return 0
    }
}
