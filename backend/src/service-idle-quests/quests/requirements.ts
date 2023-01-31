import { AndRequirement, APSRequirement, BonusRequirement, ClassRequirement, Item, OrRequirement, QuestRequirement } from "../models"

export const successRate = (requirement: QuestRequirement, inventory: Item[]): number => {

    const andRequirementSuccessRate = (requirement: AndRequirement, inventory: Item[]): number => {
        const leftSuccessRate = successRate(requirement.left, inventory)
        const rightSuccessRate = successRate(requirement.right, inventory)
        return 1 * leftSuccessRate * rightSuccessRate == 0 ? 0 : Math.min(leftSuccessRate, rightSuccessRate)
    }

    const orRequirementSuccessRate = (requirement: OrRequirement, inventory: Item[]): number => 
        Math.max(successRate(requirement.left, inventory), successRate(requirement.right, inventory))

    const bonusRequirementSuccessRate = (requirement: BonusRequirement, inventory: Item[]): number => {
        const leftSuccessRate = successRate(requirement.left, inventory)
        const rightSuccessRate = successRate(requirement.right, inventory)
        const bonus = leftSuccessRate == 0 ? 0 - requirement.bonus : requirement.bonus
        return Math.min(rightSuccessRate + bonus, 1)
    }

    const apsRequirementSuccessRate = (requirement: APSRequirement, inventory: Item[]): number => {

        const adventurersAPSSum = (inventory: Item[]): { athleticism: number, intellect: number, charisma: number } => {
            return inventory.reduce((acc, item) => {
                if (item.ctype === "adventurer") {
                    return {
                        athleticism: acc.athleticism + item.athleticism,
                        intellect: acc.intellect + item.intellect,
                        charisma: acc.charisma + item.charisma,
                    }
                } else {
                    return acc
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

    const classRequirementSuccessRate = (requirement: ClassRequirement, inventory: Item[]): number =>
        inventory.find(item => item.ctype === "adventurer" && item.class === requirement.class) ? 1 : 0

    if (requirement.ctype === "aps-requirement") 
        return apsRequirementSuccessRate(requirement, inventory)
    else if (requirement.ctype === "class-requirement") 
        return classRequirementSuccessRate(requirement, inventory)
    else if (requirement.ctype === "bonus-requirement") 
        return bonusRequirementSuccessRate(requirement, inventory)
    else if (requirement.ctype === "and-requirement") 
        return andRequirementSuccessRate(requirement, inventory)
    else 
        return orRequirementSuccessRate(requirement, inventory)
}