import { AdventurerClasses } from "../character-entity"
import { StakingQuest, StakingReward } from "./staking-quest"
import { AndRequirement, APSRequirement, AssetRefRequirement, RewardBonusRequirement, ClassRequirement, EmptyRequirement, OrRequirement, StakingQuestRequirementDSL, SuccessBonusRequirement } from "./staking-quest-requirements"

export function isStakingQuestRequirementDSL(obj: any): obj is StakingQuestRequirementDSL {

    function isAndRequirement(obj: any): obj is AndRequirement {
        return obj.ctype === "and-requirement" && isStakingQuestRequirementDSL(obj.left) && isStakingQuestRequirementDSL(obj.right)
    }

    function isOrRequirement(obj: any): obj is OrRequirement {
        return obj.ctype === "or-requirement" && isStakingQuestRequirementDSL(obj.left) && isStakingQuestRequirementDSL(obj.right)
    }

    function isBonusRequirement(obj: any): obj is RewardBonusRequirement {
        return obj.ctype === "bonus-requirement" && isStakingQuestRequirementDSL(obj.left) && isStakingQuestRequirementDSL(obj.right)
    }

    function isAPSRequirement(obj: any): obj is APSRequirement {
        return obj.ctype === "aps-requirement" && typeof obj.athleticism === "number" && typeof obj.intellect === "number" && typeof obj.charisma === "number"
    }

    function isClassRequirement(obj: any): obj is ClassRequirement {
        return obj.ctype === "class-requirement" && typeof obj.class === "string" && AdventurerClasses.includes(obj.class)
    }

    function isAssetRefRequirement(obj: any): obj is AssetRefRequirement {
        return obj.ctype === "asset-ref-requirement" && typeof obj.assetRef === "string"
    }

    function isSuccessBonus(obj: any): obj is SuccessBonusRequirement {
        return obj.ctype === "only-success-bonus-requirement" && isStakingQuestRequirementDSL(obj.left) && isStakingQuestRequirementDSL(obj.right)
    }

    function isEmptyRequirement(obj: any): obj is EmptyRequirement {
        return obj.ctype === "empty-requirement"
    }

    return isAndRequirement(obj) 
        || isOrRequirement(obj) 
        || isBonusRequirement(obj) 
        || isAPSRequirement(obj) 
        || isClassRequirement(obj)
        || isAssetRefRequirement(obj)
        || isSuccessBonus(obj)
        || isEmptyRequirement(obj)
}

export function isReward(obj: any): obj is StakingReward {
    return typeof obj.currency === "number"
}

export function isQuest(obj: any): obj is StakingQuest {
    return typeof obj.questId === "string" && typeof obj.name === "string" && typeof obj.location === "string" && typeof obj.description === "string" 
}