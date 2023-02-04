import { apsSum } from "../items/adventurer-fun"
import { Adventurer, AndRequirement, APSRequirement, BonusRequirement, ClassRequirement, SuccessBonusRequirement, OrRequirement, QuestRequirement, Reward, EmptyRequirement, NotRequirement } from "../models"
import { apsReward, AssetRewards, bestReward, mergeRewards } from "./quest-reward"

export const aps = (athleticism: number, intellect: number, charisma: number): APSRequirement => ({
    ctype: "aps-requirement",
    athleticism: athleticism,
    intellect: intellect,
    charisma: charisma,
})

export const bonus = (bonus: number, left: QuestRequirement, right: QuestRequirement): BonusRequirement => ({
    ctype: "bonus-requirement",
    bonus, left, right,
})

export const all = (requirements: QuestRequirement[]): QuestRequirement => 
    requirements.reduce((left, right) => and(left, right), empty)

export const one = (requirements: QuestRequirement[]): QuestRequirement =>
    requirements.reduce((left, right) => or(left, right), empty)

export const none = (requirements: QuestRequirement[]): QuestRequirement =>
    not(all(requirements))

export const successBonus = (bonus: number, left: QuestRequirement, right: QuestRequirement): SuccessBonusRequirement => ({
    ctype: "success-bonus-requirement",
    bonus, left, right,
})

export const and = (left: QuestRequirement, right: QuestRequirement): AndRequirement => ({
    ctype: "and-requirement",
    left, right,
})

export const or = (left: QuestRequirement, right: QuestRequirement): OrRequirement => ({
    ctype: "or-requirement",
    left, right,
})

export const not = (continuation: QuestRequirement): NotRequirement => ({
    ctype: "not-requirement",
    continuation,
})

export const empty: EmptyRequirement = 
    { ctype: "empty-requirement" }

export const fighter: ClassRequirement = {
    ctype: "class-requirement",
    class: "fighter",
}

export const paladin: ClassRequirement = {
    ctype: "class-requirement",
    class: "paladin",
}

export const knight: ClassRequirement = {
    ctype: "class-requirement",
    class: "knight",
}

export const cleric: ClassRequirement = {
    ctype: "class-requirement",
    class: "cleric",
}

export const druid: ClassRequirement = {
    ctype: "class-requirement",
    class: "druid",
}

export const warlock: ClassRequirement = {
    ctype: "class-requirement",
    class: "warlock",
}

export const mage: ClassRequirement = {
    ctype: "class-requirement",
    class: "mage",
}

export const bard: ClassRequirement = {
    ctype: "class-requirement",
    class: "bard",
}

export const rogue: ClassRequirement = {
    ctype: "class-requirement",
    class: "rogue",
}

export const ranger: ClassRequirement = {
    ctype: "class-requirement",
    class: "ranger",
}

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
    else if (requirement.ctype === "or-requirement")
        return orRequirementSuccessRate(requirement)
    else 
        return 1
}

export class RewardCalculator {

    public readonly assetRewards: AssetRewards

    constructor(
        policies: { dragonSilver: string },
        private readonly rewardFactor: number = 1
    ) {
        this.assetRewards = new AssetRewards(policies)
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
        else if (questRequirement.ctype === "or-requirement")
            return orRequirementReward(questRequirement)
        else
            return {}
    }
}

export class DurationCalculator {

    constructor(private readonly durationFactor: number = 1) {}

    baseDuration(requirement: QuestRequirement): number {
        if (requirement.ctype === "aps-requirement")
            return apsSum({ athleticism: requirement.athleticism, intellect: requirement.intellect, charisma: requirement.charisma }) * 1000 * this.durationFactor
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
