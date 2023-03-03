import { WellKnownPolicies } from "../../../registry-policies";
import { APS, apsSum } from "../character-entity";
import { QuestRequirement } from "./quests-requirements";

export type Quest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: QuestRequirement,
    timeModifier?: { operator: "multiply" | "add" | "replace", modifier: number },
    rewardModifier?: { operator: "multiply" | "add" | "replace", modifier: Reward },
    slots?: number,
}

export type Reward = { 
    currencies?: AssetReward[], 
    apsExperience?: APS 
}

export type AssetReward = { policyId: string, assetRef: string, quantity: string }

export class AssetRewards {

    constructor(private readonly wellKnownPolicies: WellKnownPolicies) {}

    dragonSilver (quantity: string): Reward {
        return { currencies: [{ policyId: this.wellKnownPolicies.dragonSilver.policyId, assetRef: "DragonSilver", quantity }] }
    }
}

export const apsReward = (aps: APS): Reward => 
    ({ apsExperience: aps, })

export const mergeRewards = (a: Reward, b: Reward): Reward => {
    const preCurrencies = [...(a.currencies ?? [])]
    const currencies = [...(b.currencies ?? [])].reduce((acc, curr) => {
        const existing = acc.find(c => c.policyId === curr.policyId && c.assetRef === curr.assetRef)
        if (existing) {
            existing.quantity = (BigInt(existing.quantity) + BigInt(curr.quantity)).toString()
        } else {
            acc.push(curr)
        }
        return acc
    }, preCurrencies)
    const apsExperience: APS = { 
        athleticism: (a.apsExperience?.athleticism ?? 0) + (b.apsExperience?.athleticism ?? 0), 
        intellect: (a.apsExperience?.intellect ?? 0) + (b.apsExperience?.intellect ?? 0),
        charisma: (a.apsExperience?.charisma ?? 0) + (b.apsExperience?.charisma ?? 0)
    }
    return { currencies, apsExperience }
}

export const bestReward = (a: Reward, b: Reward): Reward => {
    const aAPSsum = apsSum(a.apsExperience ?? { athleticism: 0, intellect: 0, charisma: 0 })
    const bAPSsum = apsSum(b.apsExperience ?? { athleticism: 0, intellect: 0, charisma: 0 })
    const resultAPS = aAPSsum > bAPSsum ? a.apsExperience : b.apsExperience
    const aCurrenciesSum = a.currencies?.reduce((acc, curr) => acc + BigInt(curr.quantity), BigInt(0)) ?? BigInt(0)
    const bCurrenciesSum = b.currencies?.reduce((acc, curr) => acc + BigInt(curr.quantity), BigInt(0)) ?? BigInt(0)
    const resultCurrencies = aCurrenciesSum > bCurrenciesSum ? a.currencies : b.currencies
    return { apsExperience: resultAPS, currencies: resultCurrencies }
}
