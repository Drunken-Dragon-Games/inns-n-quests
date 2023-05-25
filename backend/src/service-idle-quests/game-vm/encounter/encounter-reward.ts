import { addAPS, APS, zeroAPS } from "../character-entity"

export type EncounterReward = { 
    items: {}, 
    currency: number,
    experience: APS 
}

export type EncounterItemReward = Record<string, number>

/*
export interface ItemRewards {

    healingPotion: (quantity: number) => ItemReward
}
*/

export const encounterAPSReward = (aps: APS): EncounterReward => 
    ({ experience: aps, currency: 0, items: {} })

export const encounterCurrencyReward = (currency: number): EncounterReward =>
    ({ experience: zeroAPS, currency, items: {} })

export const noEncounterReward: EncounterReward = { experience: zeroAPS, currency: 0, items: {} }

export const addEncounterItemReward = (a: EncounterItemReward, b: EncounterItemReward): EncounterItemReward => {
    return Object.keys(b).reduce((a, key) => {
        if (a[key]) a[key] += b[key]
        else a[key] = b[key]
        return a
    }, {...a})
}

export const addEncounterRewards = (a: EncounterReward, b: EncounterReward): EncounterReward => ({
    items: addEncounterItemReward(a.items, b.items),
    currency: a.currency + b.currency,
    experience: addAPS(a.experience, b.experience)
})
