import { addAPS, APS, apsSum, CharacterEntity, newAPS, zeroAPS } from "../character-entity/index.js"
import IQRandom from "../iq-random.js"
import { CharacterEntityRuleset, StakingQuestRuleset } from "../iq-ruleset.js"
import { addStakingReward, StakingQuest, StakingQuestConfiguration, StakingQuestOutcome, StakingQuestRequirement, StakingQuestRequirementConfiguration, StakingQuestRequirementInfo, StakingQuestRequirementSatisfactionPercentage, StakingQuestSatisfactionInfo, StakingReward } from "../staking-quest/index.js"
import { notEmpty } from "../utils.js"

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

        const ivAPSSatisfaction = (): APS => {
            const accAPS = party.map(c => c.ivAPS).reduce(addAPS, zeroAPS)
            return accAPS
        }

        const collectionSatisfaction = (): number | undefined => {
            if (!requirement.collection || requirement.collection.length === 0) return undefined
            if (party.length === 0) return 0
            const allApply = party.every(c => requirement.collection!.includes(c.collection))
            return allApply ? 1 : 0
        }

        const classSatisfaction = (): number | undefined => {
            if (!requirement.class || requirement.class.length === 0) return undefined
            if (party.length === 0) return 0
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

        const info = this.requirementInfo(requirement)
        return { requirement, requirementInfo: info, satisfaction }
    }

    requirementInfo(requirement: StakingQuestRequirement): StakingQuestRequirementInfo {
        const duration = Math.round(Math.max(30, apsSum(requirement.aps)))
        const currency = (
            Math.round(Math.max(1, apsSum(requirement.aps) / 10)) +
            (requirement.collection?.length ?? 0) * 10 +
            (requirement.class?.length ?? 0) * 20 +
            (requirement.assetRef?.length ?? 0) * 30
        )
        const rewardBonus = requirement.rewardBonus
        const successBonus = requirement.successBonus
        return { duration, reward: { currency }, rewardBonus, successBonus }
    }
}

const baseSuccessRate = (info: StakingQuestSatisfactionInfo): number => {
    const cappedAPS = newAPS([
        Math.min(info.requirement.aps.athleticism, info.satisfaction.aps.athleticism),
        Math.min(info.requirement.aps.intellect, info.satisfaction.aps.intellect),
        Math.min(info.requirement.aps.charisma, info.satisfaction.aps.charisma),
    ])
    const successArray: number[] = [
        apsSum(cappedAPS) / apsSum(info.requirement.aps), 
        info.satisfaction.collection, 
        info.satisfaction.class, 
        info.satisfaction.assetRef
    ].filter(notEmpty)
    return successArray.reduce((a, b) => a + b, 0) / successArray.length
}

const applyFinalSuccessRate = (info: StakingQuestSatisfactionInfo): number => {
    const baseSuccess = baseSuccessRate(info)
    return info.requirementInfo.successBonus 
        ? Math.min(1, baseSuccess + info.requirementInfo.successBonus) 
        : baseSuccess
}

const applyFinalReward = (info: StakingQuestSatisfactionInfo): StakingReward => {
    const baseReward = info.requirementInfo.reward
    return info.requirementInfo.rewardBonus 
        ? addStakingReward(baseReward, info.requirementInfo.rewardBonus) 
        : baseReward
}

const isBetterReward = (a: StakingReward, b: StakingReward): boolean => 
    a.currency > b.currency
