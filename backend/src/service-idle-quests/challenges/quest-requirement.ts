import { Adventurer, adventurerClasses, AndRequirement, APSRequirement, BonusRequirement, ClassRequirement, OrRequirement, QuestRequirement } from "../models"

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

export const successRate = (requirement: QuestRequirement, inventory: Adventurer[]): number => {

    const andRequirementSuccessRate = (requirement: AndRequirement): number => {
        const leftSuccessRate = successRate(requirement.left, inventory)
        const rightSuccessRate = successRate(requirement.right, inventory)
        return 1 * leftSuccessRate * rightSuccessRate == 0 ? 0 : Math.min(leftSuccessRate, rightSuccessRate)
    }

    const orRequirementSuccessRate = (requirement: OrRequirement): number => 
        Math.max(successRate(requirement.left, inventory), successRate(requirement.right, inventory))

    const bonusRequirementSuccessRate = (requirement: BonusRequirement): number => {
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
    else if (requirement.ctype === "and-requirement") 
        return andRequirementSuccessRate(requirement)
    else 
        return orRequirementSuccessRate(requirement)
}