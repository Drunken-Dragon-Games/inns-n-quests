import { apsAdd, APS, zeroAPS } from "../character-entity"

export type Reward = { 
    items: {}, 
    currency: number,
    experience: APS 
}

export type ItemReward = Record<string, number>

/*
export interface ItemRewards {

    healingPotion: (quantity: number) => ItemReward
}
*/

export const apsReward = (aps: APS): Reward => 
    ({ experience: aps, currency: 0, items: {} })

export const currencyReward = (currency: number): Reward =>
    ({ experience: zeroAPS, currency, items: {} })

export const noReward: Reward = { experience: zeroAPS, currency: 0, items: {} }

export const addItems = (a: ItemReward, b: ItemReward): ItemReward => {
    return Object.keys(b).reduce((a, key) => {
        if (a[key]) a[key] += b[key]
        else a[key] = b[key]
        return a
    }, {...a})
}

export const addRewards = (a: Reward, b: Reward): Reward => ({
    items: addItems(a.items, b.items),
    currency: a.currency + b.currency,
    experience: apsAdd(a.experience, b.experience)
})

/*
export const bestReward = (a: Reward, b: Reward): Reward => {
    const aAPSsum = apsSum(a.experience ?? { athleticism: 0, intellect: 0, charisma: 0 })
    const bAPSsum = apsSum(b.experience ?? { athleticism: 0, intellect: 0, charisma: 0 })
    const resultAPS = aAPSsum > bAPSsum ? a.experience : b.experience
    const aCurrenciesSum = a.currencies?.reduce((acc, curr) => acc + BigInt(curr.quantity), BigInt(0)) ?? BigInt(0)
    const bCurrenciesSum = b.currencies?.reduce((acc, curr) => acc + BigInt(curr.quantity), BigInt(0)) ?? BigInt(0)
    const resultCurrencies = aCurrenciesSum > bCurrenciesSum ? a.currencies : b.currencies
    return { experience: resultAPS, currencies: resultCurrencies }
}
*/