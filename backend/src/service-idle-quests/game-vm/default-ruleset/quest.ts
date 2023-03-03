import { CharacterEntity, APS, apsSum, CharacterEntityRuleset, CharacterType } from "../character-entity"
import { AndRequirement, APSRequirement, apsReward, AssetRewards, bestReward, BonusRequirement, ClassRequirement, mergeRewards, OrRequirement, QuestRequirement, QuestRuleset, Reward, SuccessBonusRequirement } from "../quests"

class DefaultQuestRuleset implements QuestRuleset {

    constructor (
        private characterRuleset: CharacterEntityRuleset, 
        private assetRewards: AssetRewards
    ) {}

    successRate = (requirement: QuestRequirement, party: CharacterEntity[]): number => {

        const andRequirementSuccessRate = (requirement: AndRequirement): number => {
            const leftSuccessRate = this.successRate(requirement.left, party)
            const rightSuccessRate = this.successRate(requirement.right, party)
            return 1 * leftSuccessRate * rightSuccessRate == 0 ? 0 : Math.min(leftSuccessRate, rightSuccessRate)
        }

        const orRequirementSuccessRate = (requirement: OrRequirement): number =>
            Math.max(this.successRate(requirement.left, party), this.successRate(requirement.right, party))

        const bonusRequirementSuccessRate = (requirement: BonusRequirement | SuccessBonusRequirement): number => {
            const leftSuccessRate = this.successRate(requirement.left, party)
            const rightSuccessRate = this.successRate(requirement.right, party)
            const bonus = leftSuccessRate == 0 ? 0 - requirement.bonus : requirement.bonus
            return Math.min(rightSuccessRate + bonus, 1)
        }

        const apsRequirementSuccessRate = (requirement: APSRequirement): number => {

            const partyAPSSum = (party: CharacterEntity[]): APS => {
                return party.reduce((acc, item) => {
                    const { athleticism, intellect, charisma } = this.characterRuleset.evAPS(item.ivAPS, item.xpAPS)
                    return {
                        athleticism: acc.athleticism + athleticism,
                        intellect: acc.intellect + intellect,
                        charisma: acc.charisma + charisma,
                    }
                }, { athleticism: 0, intellect: 0, charisma: 0 })
            }

            const aAPSSum = partyAPSSum(party)
            const athDiff = Math.max(requirement.athleticism - aAPSSum.athleticism, 0)
            const intDiff = Math.max(requirement.intellect - aAPSSum.intellect, 0)
            const chaDiff = Math.max(requirement.charisma - aAPSSum.charisma, 0)
            const result = 1 - (athDiff + intDiff + chaDiff) / (requirement.athleticism + requirement.intellect + requirement.charisma)
            return result
        }

        const classRequirementSuccessRate = (requirement: ClassRequirement): number =>
            party.find(item => item.characterType.class === requirement.class) ? 1 : 0

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

    reward = (requirements: QuestRequirement): Reward => {

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

        const onlySuccessBonusRequirementReward = (requirement: SuccessBonusRequirement): Reward => 
            this.reward(requirement.right)

        const apsRequirementReward = (requirement: APSRequirement): Reward => {
            const dragonSilverReward = this.assetRewards.dragonSilver(
                (apsSum({
                    athleticism: requirement.athleticism,
                    intellect: requirement.intellect,
                    charisma: requirement.charisma,
                })).toString())
            const experienceReward = apsReward({
                athleticism: requirement.athleticism * 100,
                intellect: requirement.intellect * 100,
                charisma: requirement.charisma * 100,
            })
            return mergeRewards(dragonSilverReward, experienceReward)
        }

        const classRequirementReward = (requirement: ClassRequirement): Reward => {
            return this.assetRewards.dragonSilver("5")
        }

        if (requirements.ctype === "aps-requirement")
            return apsRequirementReward(requirements)
        else if (requirements.ctype === "class-requirement")
            return classRequirementReward(requirements)
        else if (requirements.ctype === "bonus-requirement")
            return andRequirementReward(requirements)
        else if (requirements.ctype === "success-bonus-requirement")
            return onlySuccessBonusRequirementReward(requirements)
        else if (requirements.ctype === "and-requirement")
            return andRequirementReward(requirements)
        else if (requirements.ctype === "or-requirement")
            return orRequirementReward(requirements)
        else
            return {}
    }

    duration = (requirements: QuestRequirement): number => {
        if (requirements.ctype === "aps-requirement")
            return 60//apsSum({ athleticism: requirements.athleticism, intellect: requirements.intellect, charisma: requirements.charisma }) * 10 * this.durationFactor
        else if (requirements.ctype === "bonus-requirement")
            return this.duration(requirements.right)
        else if (requirements.ctype === "success-bonus-requirement")
            return this.duration(requirements.right)
        else if (requirements.ctype === "and-requirement")
            return this.duration(requirements.left) + this.duration(requirements.right)
        else if (requirements.ctype === "or-requirement")
            return Math.max(this.duration(requirements.left), this.duration(requirements.right))
        else
            return 0
    }
}

export default DefaultQuestRuleset
