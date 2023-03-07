import { AdventurerClasses } from "../character-entity"
import { StakingQuest, StakingReward } from "./staking-quest"
import { AndRequirement, APSRequirement, BonusRequirement, ClassRequirement, EmptyRequirement, OrRequirement, StakingQuestRequirement, SuccessBonusRequirement } from "./staking-quest-requirements"

export function isQuestRequirement(obj: any): obj is StakingQuestRequirement {

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
        return obj.ctype === "class-requirement" && typeof obj.class === "string" && AdventurerClasses.includes(obj.class)
    }

    function isSuccessBonus(obj: any): obj is SuccessBonusRequirement {
        return obj.ctype === "only-success-bonus-requirement" && isQuestRequirement(obj.left) && isQuestRequirement(obj.right)
    }

    function isEmptyRequirement(obj: any): obj is EmptyRequirement {
        return obj.ctype === "empty-requirement"
    }

    return isAndRequirement(obj) 
        || isOrRequirement(obj) 
        || isBonusRequirement(obj) 
        || isAPSRequirement(obj) 
        || isClassRequirement(obj)
        || isSuccessBonus(obj)
        || isEmptyRequirement(obj)
}

export function isReward(obj: any): obj is StakingReward {
    return typeof obj.currency === "number"
}

export function isQuest(obj: any): obj is StakingQuest {
    return typeof obj.questId === "string" && typeof obj.name === "string" && typeof obj.location === "string" && typeof obj.description === "string" && isQuestRequirement(obj.requirements)
}