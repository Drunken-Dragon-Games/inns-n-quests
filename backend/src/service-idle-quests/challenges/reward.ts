import { APS, Reward } from "../models";

export class AssetRewards {

    constructor(private readonly policies: { dragonSilver: string }) {}

    dragonSilver (quantity: string): Reward {
        return { currencies: [{ policyId: this.policies.dragonSilver, unit: "DragonSilver", quantity }] }
    }
}

export const apsReward = (aps: APS): Reward => ({ apsExperience: aps, })

export const mergeRewards = (a: Reward, b: Reward): Reward => {
    const preCurrencies = [...(a.currencies ?? [])]
    const currencies = [...(b.currencies ?? [])].reduce((acc, curr) => {
        const existing = acc.find(c => c.policyId === curr.policyId && c.unit === curr.unit)
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

export const apsSum = (aps: APS): number => aps.athleticism + aps.intellect + aps.charisma

export const bestReward = (a: Reward, b: Reward): Reward => {
    const aAPSsum = apsSum(a.apsExperience ?? { athleticism: 0, intellect: 0, charisma: 0 })
    const bAPSsum = apsSum(b.apsExperience ?? { athleticism: 0, intellect: 0, charisma: 0 })
    const resultAPS = aAPSsum > bAPSsum ? a.apsExperience : b.apsExperience
    const aCurrenciesSum = a.currencies?.reduce((acc, curr) => acc + BigInt(curr.quantity), BigInt(0)) ?? BigInt(0)
    const bCurrenciesSum = b.currencies?.reduce((acc, curr) => acc + BigInt(curr.quantity), BigInt(0)) ?? BigInt(0)
    const resultCurrencies = aCurrenciesSum > bCurrenciesSum ? a.currencies : b.currencies
    return { apsExperience: resultAPS, currencies: resultCurrencies }
}