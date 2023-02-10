import { QuestRequirement, AndRequirement, OrRequirement, BonusRequirement, APSRequirement, ClassRequirement, 
         adventurerClasses, SuccessBonusRequirement, Reward, AssetReward, APS, Quest, AdventurerClass, EmptyRequirement } from "../models"

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

export function isReward(obj: any): obj is Reward {
    // All rewards have all properties optional
    return true
}

export function isAssetReward(obj: any): obj is AssetReward {
    return typeof obj.policyId === "string" && typeof obj.unit === "string" && typeof obj.quantity === "string"  
}

export function isAPS(obj: any): obj is APS {
    return typeof obj.athleticism === "number" && typeof obj.intellect === "number" && typeof obj.charisma === "number"
}

export function isQuest(obj: any): obj is Quest {
    return typeof obj.questId === "string" && typeof obj.name === "string" && typeof obj.location === "string" && typeof obj.description === "string" && isQuestRequirement(obj.requirements)
}

export function isClass(obj: any): obj is AdventurerClass {
    return typeof obj === "string" && adventurerClasses.includes(obj)
}
