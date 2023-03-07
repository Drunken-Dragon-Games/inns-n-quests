import { APS, apsAdd, apsAddBonus, apsMultScalar, apsSum, CharacterEntity, newAPS, oneAPS, zeroAPS } from "../character-entity"
import { addEncounterRewards, encounterCurrencyReward, encounterAPSReward, noEncounterReward } from "../encounter"
import IQRandom from "../iq-random"
import { CharacterEntityRuleset, StakingQuestRuleset } from "../iq-ruleset"
import { addStakingRewards, AndRequirement, APSRequirement, BonusRequirement, ClassRequirement, OrRequirement, SatisfiedRequirements, StakingQuestOutcome, StakingQuestRequirement, StakingReward, SuccessBonusRequirement, TakenStakingQuest } from "../staking-quest"

export default class DefaultQuestRuleset implements StakingQuestRuleset {

    constructor (
        private characterRuleset: CharacterEntityRuleset, 
        private rand: IQRandom,
    ) {}
 
    outcome(takenQuest: TakenStakingQuest, party: CharacterEntity[]): StakingQuestOutcome {
        const successRate = this.satisfied(takenQuest.availableQuest.requirements, party)
        const success = this.rand.randomNumberBetween(1, 100) <= Math.floor(1 * 100)
        // Outcome data
        return success 
            ? { ctype: "success-outcome", reward: this.reward(takenQuest.availableQuest.requirements) } 
            : { ctype: "failure-outcome" }
    }

    satisfied(requirements: StakingQuestRequirement, party: CharacterEntity[]): SatisfiedRequirements {

        const and = (requirement: AndRequirement): SatisfiedRequirements => {
            const left = this.satisfied(requirement.left, party)
            const right = this.satisfied(requirement.right, party)
            return { 
                aps: newAPS([
                    Math.min(left.aps.athleticism, right.aps.athleticism),
                    Math.min(left.aps.intellect, right.aps.intellect),
                    Math.min(left.aps.charisma, right.aps.charisma)
                ]),
                class: Math.min(left.class, right.class),
            }
        }

        const or = (requirement: OrRequirement): SatisfiedRequirements => {
            const left = this.satisfied(requirement.left, party)
            const right = this.satisfied(requirement.right, party)
            if (left.class > right.class) return left
            if (right.class > left.class) return right
            if (apsSum(left.aps) > apsSum(right.aps)) return left
            if (apsSum(right.aps) > apsSum(left.aps)) return right
            else return left
        }

        const bonus = (requirement: BonusRequirement | SuccessBonusRequirement): SatisfiedRequirements => {
            const left = this.satisfied(requirement.left, party)
            const right = this.satisfied(requirement.right, party)
            if (left.class >= 1 && apsSum(left.aps) >= 3) 
                return {
                    aps: apsAddBonus(right.aps, requirement.bonus),
                    class: right.class
                } 
            else 
                return right
        }

        const apsS = (requirement: APSRequirement): SatisfiedRequirements => {
            const partyAPSSum: APS =
                party.reduce((acc, item) =>
                    apsAdd(acc, this.characterRuleset.evAPS(item.ivAPS, item.xpAPS))
                , zeroAPS)
            return {
                aps: newAPS([
                    partyAPSSum.athleticism / requirement.athleticism,
                    partyAPSSum.intellect / requirement.intellect,
                    partyAPSSum.charisma / requirement.charisma
                ]),
                class: 1
            }
        }

        const classS = (requirement: ClassRequirement): SatisfiedRequirements => ({
            aps: oneAPS,
            class: party.find(item => item.characterType.class === requirement.class) ? 1 : 0
        })

        switch (requirements.ctype) {
            case "and-requirement":
                return and(requirements)
            case "or-requirement":
                return or(requirements)
            case "aps-requirement":
                return apsS(requirements)
            case "class-requirement":
                return classS(requirements)
            case "bonus-requirement":
                return bonus(requirements)
            case "success-bonus-requirement":
                return bonus(requirements)
            case "empty-requirement":
                return { aps: oneAPS, class: 1 }
        }
    }

    reward(requirements: StakingQuestRequirement): StakingReward {

        const and = (requirement: AndRequirement | BonusRequirement): StakingReward => {
            const leftReward = this.reward(requirement.left)
            const rightReward = this.reward(requirement.right)
            return addStakingRewards(leftReward, rightReward)
        }

        const or = (requirement: OrRequirement): StakingReward => {
            const leftReward = this.reward(requirement.left)
            const rightReward = this.reward(requirement.right)
            return leftReward
        }

        const bonus = (requirement: SuccessBonusRequirement): StakingReward => 
            this.reward(requirement.right)

        const apsR = (requirement: APSRequirement): StakingReward => {
            const currency = encounterCurrencyReward(apsSum(requirement))
            const experienceReward = encounterAPSReward(apsMultScalar(requirement, 100))
            return addEncounterRewards(currency, experienceReward)
        }

        const classR = (requirement: ClassRequirement): StakingReward => {
            return encounterCurrencyReward(100)
        }

        switch (requirements.ctype) {
            case "aps-requirement":
                return apsR(requirements)
            case "class-requirement":
                return classR(requirements)
            case "bonus-requirement":
                return and(requirements)
            case "success-bonus-requirement":
                return bonus(requirements)
            case "and-requirement":
                return and(requirements)
            case "or-requirement":
                return or(requirements)
            case "empty-requirement":
                return noEncounterReward
        }
    }

    duration(requirements: StakingQuestRequirement): number {
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
