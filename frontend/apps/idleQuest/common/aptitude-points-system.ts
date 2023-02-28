export type APS = {
    athleticism: number,
    intellect: number,
    charisma: number,
}

export const zeroAPS: APS = { athleticism: 0, intellect: 0, charisma: 0 }

export function sameOrBetterAPS(a: APS, b: APS): boolean {
    return a.athleticism >= b.athleticism && a.intellect >= b.intellect && a.charisma >= b.charisma
}

export function mergeAPSSum(a: APS, b: APS): APS {
    return {
        athleticism: a.athleticism + b.athleticism,
        intellect: a.intellect + b.intellect,
        charisma: a.charisma + b.charisma,
    }
}