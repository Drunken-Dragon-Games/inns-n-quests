import Random from "../../../tools-utils/random"
import { APS, apsAdd, apsAddBonus, apsMultScalar, apsSum, CharacterEntity, newAPS, oneAPS, zeroAPS } from "../character-entity"
import {
    addRewards, AndRequirement, APSRequirement, apsReward, BonusRequirement,
    ClassRequirement, currencyReward, noReward, OrRequirement, QuestOutcome, QuestRequirement, Reward, SatisfiedRequirements, Strategy, SuccessBonusRequirement, TakenQuest
} from "../encounter"
import { CharacterEntityRuleset, QuestRuleset } from "../iq-ruleset"

class DefaultQuestRuleset implements QuestRuleset {

    constructor (
        private characterRuleset: CharacterEntityRuleset, 
        //private assetRewards: ItemRewards
    ) {}

    encounterOutcome(encounter: Strategy, party: CharacterEntity[], rand: Random): QuestOutcome {
        return { ctype: "success-outcome", party, reward: noReward }
    }

    encounterXPReward(encounter: Strategy): Reward {
        return noReward
    }

    
    outcome(takenQuest: TakenQuest, party: CharacterEntity[], rand: Random): QuestOutcome {
        
        const successOutcome = (): { party: CharacterEntity[], reward: Reward } => {
            const reward = this.reward(takenQuest.availableQuest.requirements)
            const newParty = this.characterRuleset.levelUp(party, reward, newAPS([1,1,1]))
            return { party: newParty, reward }
        }

        const failureOutcome = (): { party: CharacterEntity[] } => {
            //const challengeAPS = this.challengeAPS(takenQuest.availableQuest.requirements)
            //const newParty = party.map(p => this.characterRuleset.takeDamage(p, challengeAPS))
            return { party }
        }

        const successRate = this.satisfied(takenQuest.availableQuest.requirements, party)
        const success = rand.randomNumberBetween(1, 100) <= Math.floor(1 * 100)
        // Outcome data
        return success 
            ? { ctype: "success-outcome", ...successOutcome() } 
            : { ctype: "failure-outcome", ...failureOutcome() }
    }

    satisfied(requirements: QuestRequirement, party: CharacterEntity[]): SatisfiedRequirements {

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

        /*
        const not = (requirement: NotRequirement): SatisfiedRequirements => {
            const continuation = this.satisfied(requirement.continuation, party)
            return {
                aps: newAPS([
                    1 - continuation.aps.athleticism,
                    1 - continuation.aps.intellect,
                    1 - continuation.aps.charisma
                ]),
                class: 1 - continuation.class
            }
        }
        */

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

    reward(requirements: QuestRequirement): Reward {

        const and = (requirement: AndRequirement | BonusRequirement): Reward => {
            const leftReward = this.reward(requirement.left)
            const rightReward = this.reward(requirement.right)
            return addRewards(leftReward, rightReward)
        }

        const or = (requirement: OrRequirement): Reward => {
            const leftReward = this.reward(requirement.left)
            const rightReward = this.reward(requirement.right)
            return leftReward
        }

        const bonus = (requirement: SuccessBonusRequirement): Reward => 
            this.reward(requirement.right)

        const apsR = (requirement: APSRequirement): Reward => {
            const currency = currencyReward(apsSum(requirement))
            const experienceReward = apsReward(apsMultScalar(requirement, 100))
            return addRewards(currency, experienceReward)
        }

        const classR = (requirement: ClassRequirement): Reward => {
            return currencyReward(100)
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
                return noReward
        }
    }

    duration(requirements: QuestRequirement): number {
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
