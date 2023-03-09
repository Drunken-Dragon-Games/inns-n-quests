import { addAPS, APS, apsSum, CharacterEntity, newAPS, zeroAPS } from "../character-entity"
import IQRandom from "../iq-random"
import { CharacterEntityRuleset, StakingQuestRuleset } from "../iq-ruleset"
import { addStakingReward, BaseStakingQuestRequirement, Possible, StakingQuest, StakingQuestConfiguration, StakingQuestOutcome, StakingQuestRequirement, StakingQuestRequirementConfiguration, StakingQuestRequirementInfo, StakingQuestRequirementSatisfactionPercentage, StakingQuestSatisfactionInfo, StakingReward } from "../staking-quest"
import { notEmpty } from "../utils"

export default class DefaultQuestRuleset implements StakingQuestRuleset {

    constructor (
        private characterRuleset: CharacterEntityRuleset, 
        private rand: IQRandom,
    ) {}
 
    outcome(quest: StakingQuest, party: CharacterEntity[]): StakingQuestOutcome {
        const configuration = this.questConfiguration(quest, party)
        const bestSuccessRate = configuration.configurations[configuration.bestIndex].finalSuccessRate
        const reward = configuration.configurations[configuration.bestIndex].finalReward
        const success = this.rand.randomNumberBetween(1, 100) <= Math.floor(bestSuccessRate * 100)
        return success 
            ? { ctype: "success-outcome", reward } 
            : { ctype: "failure-outcome" }
    }

    questConfiguration(quest: StakingQuest, party: CharacterEntity[]): StakingQuestConfiguration {

        const requirementConfiguration = (requirement: StakingQuestRequirement): StakingQuestRequirementConfiguration => {
            const info = this.satisfaction(requirement, party)
            const finalSuccessRate = applyFinalSuccessRate(info)
            const finalReward = applyFinalReward(info)
            return { satisfactionInfo: info, finalSuccessRate, finalReward }
        }

        const configurations = quest.requirements.map(requirementConfiguration)
        const bestIndex = configurations.reduce((best, current, index) => { 
            if (current.finalSuccessRate > configurations[best].finalSuccessRate) return index
            else if (current.finalSuccessRate == configurations[best].finalSuccessRate && isBetterReward(current.finalReward, configurations[best].finalReward)) return index
            else return best
        }, 0)
        return { configurations, bestIndex }
    }

    satisfaction(requirement: StakingQuestRequirement, party: CharacterEntity[]): StakingQuestSatisfactionInfo {

        const baseSatisfaction = (requirement: BaseStakingQuestRequirement): StakingQuestRequirementSatisfactionPercentage => {
            const ivAPSSatisfaction = (): APS => {
                const accAPS = party.map(c => c.ivAPS).reduce(addAPS, zeroAPS)
                return newAPS([
                    Math.min(1, accAPS.athleticism / requirement.aps.athleticism),
                    Math.min(1, accAPS.intellect / requirement.aps.intellect),
                    Math.min(1, accAPS.charisma / requirement.aps.charisma),
                ])
            }

            const collectionSatisfaction = (): number | undefined => {
                if (!requirement.collection || requirement.collection.length === 0) return undefined
                const allApply = party.every(c => requirement.collection!.includes(c.collection))
                return allApply ? 1 : 0
            }

            const classSatisfaction = (): number | undefined => {
                if (!requirement.class || requirement.class.length === 0) return undefined
                const allApply = party.every(c => requirement.class!.includes(c.characterType.class))
                return allApply ? 1 : 0
            }

            const assetRefSatisfaction = (): number | undefined => {
                if (!requirement.assetRef || requirement.assetRef.length === 0) return undefined
                const allApply = party.some(c => requirement.assetRef!.includes(c.assetRef))
                return allApply ? 1 : 0
            }

            const satisfaction: StakingQuestRequirementSatisfactionPercentage = {
                aps: ivAPSSatisfaction(),
                collection: collectionSatisfaction(),
                class: classSatisfaction(),
                assetRef: assetRefSatisfaction(),
            }

            return satisfaction
        }

        const possibleBaseRequirementSuccessRate = (requirement: Possible<BaseStakingQuestRequirement>): number => {
            if (Array.isArray(requirement)) {
                return requirement.map(possibleBaseRequirementSuccessRate).some(r => r === 1) ? 1 : 0
            } else {
                return baseSuccessRate(baseSatisfaction(requirement))
            }
        }

        const info = this.requirementInfo(requirement)
        const base = baseSatisfaction(requirement)
        const rewardBonusRequirement = requirement.rewardBonus?.requirement
        const SuccessBonusRequirement = requirement.successBonus?.requirement
        const rewardBonus = rewardBonusRequirement ? possibleBaseRequirementSuccessRate(rewardBonusRequirement) == 1 : undefined
        const successBonus = SuccessBonusRequirement ? possibleBaseRequirementSuccessRate(SuccessBonusRequirement) == 1 : undefined

        return { requirement, requirementInfo: info, satisfaction: { ...base, rewardBonus, successBonus } }
    }

    requirementInfo(requirement: StakingQuestRequirement): StakingQuestRequirementInfo {
        const duration = Math.max(3, apsSum(requirement.aps) / 10)
        const currency = (
            Math.max(1, apsSum(requirement.aps) / 10) +
            (requirement.collection?.length ?? 0) * 10 +
            (requirement.class?.length ?? 0) * 20 +
            (requirement.assetRef?.length ?? 0) * 30
        )
        const rewardBonus = requirement.rewardBonus?.reward
        const successBonus = requirement.successBonus?.success
        return { duration, reward: { currency }, rewardBonus, successBonus }
    }
}

const baseSuccessRate = (satisfaction: StakingQuestRequirementSatisfactionPercentage): number => {
    const successArray: number[] = [
        apsSum(satisfaction.aps) / 3, 
        satisfaction.collection, 
        satisfaction.class, 
        satisfaction.assetRef
    ].filter(notEmpty)
    return successArray.reduce((a, b) => a + b, 0) / successArray.length
}

const applyFinalSuccessRate = (info: StakingQuestSatisfactionInfo): number => {
    const baseSuccess = baseSuccessRate(info.satisfaction)
    return info.satisfaction.successBonus && info.requirementInfo.successBonus && info.satisfaction.successBonus 
        ? Math.min(1, baseSuccess + info.requirementInfo.successBonus) 
        : baseSuccess
}

const applyFinalReward = (info: StakingQuestSatisfactionInfo): StakingReward => {
    const baseReward = info.requirementInfo.reward
    return info.satisfaction.rewardBonus && info.requirementInfo.rewardBonus && info.satisfaction.rewardBonus 
        ? addStakingReward(baseReward, info.requirementInfo.rewardBonus) 
        : baseReward
}

const isBetterReward = (a: StakingReward, b: StakingReward): boolean => 
    a.currency > b.currency
