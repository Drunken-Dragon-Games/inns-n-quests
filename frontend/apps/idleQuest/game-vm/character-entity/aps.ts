
export type APS = {
    athleticism: number,
    intellect: number,
    charisma: number,
}

export const newAPS = (values: [number, number, number]): APS => 
    ({ athleticism: values[0], intellect: values[1], charisma: values[2] })

export const zeroAPS = newAPS([0, 0, 0])

export const oneAPS = newAPS([1, 1, 1])

export const apsSum = (aps: APS): number =>
    aps.athleticism + aps.intellect + aps.charisma

export const addAPS = (aps1: APS, aps2: APS): APS =>
    newAPS([aps1.athleticism + aps2.athleticism, aps1.intellect + aps2.intellect, aps1.charisma + aps2.charisma])

export const applyAPSBonus = (aps: APS, bonus: number): APS =>
    addAPS(aps, newAPS([
        aps.athleticism * bonus,
        aps.intellect * bonus,
        aps.charisma * bonus
    ]))

export const multAPSScalar = (aps: APS, scalar: number): APS =>
    newAPS([aps.athleticism * scalar, aps.intellect * scalar, aps.charisma * scalar])

export const apsLevel = (aps: APS): number =>
    Math.floor(apsSum(aps) / 3)
