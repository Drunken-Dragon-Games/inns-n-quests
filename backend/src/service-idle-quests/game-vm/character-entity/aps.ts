import Random from "../../../tools-utils/random"

export type APS = {
    athleticism: number,
    intellect: number,
    charisma: number,
}

export const newAPS = (values: [number, number, number]): APS => 
    ({ athleticism: values[0], intellect: values[1], charisma: values[2] })

export const zeroAPS = newAPS([0, 0, 0])

export const apsSum = (aps: APS): number =>
    aps.athleticism + aps.intellect + aps.charisma

export const apsLevel = (aps: APS): number =>
    Math.floor(apsSum(aps) / 3)

export const newRandAPS = (targetAPSSum: number, rand: Random): APS => {
    // Assign stats as best as possible
    let currentSum = 0, overflow = 0
    const baseStatsOrder = rand.shuffle(
        ["athleticism", "intellect", "charisma"] as ["athleticism", "intellect", "charisma"])
    const singleStatMax = 10
    const stats = { athleticism: 0, intellect: 0, charisma: 0 }
    baseStatsOrder.forEach((stat, i) => {
        if (i == 2) {
            const semiFinalStat = targetAPSSum - currentSum
            const finalStat = Math.min(singleStatMax, semiFinalStat)
            overflow = semiFinalStat - finalStat
            stats[stat] = finalStat
        } else {
            const maxPossibleStat = Math.min(Math.min(targetAPSSum - 2, singleStatMax), targetAPSSum - 1 - currentSum)
            const finalStat = rand.randomNumberBetween(1, maxPossibleStat)
            currentSum += finalStat
            stats[stat] = finalStat
        }
    })
    // Randomly distribute the rest
    while (overflow > 0) {
        baseStatsOrder.forEach((stat) => {
            const currentStat = stats[stat]
            if (currentStat == singleStatMax || overflow <= 0) return
            const maxPossibleIncrement = Math.min(singleStatMax - currentStat, overflow)
            const randomIncrement = rand.randomNumberBetween(1, maxPossibleIncrement)
            const finalStat = randomIncrement + currentStat
            overflow -= randomIncrement
            stats[stat] = finalStat
        })
    }
    const totalStatSum = stats.athleticism + stats.intellect + stats.charisma
    if (totalStatSum != targetAPSSum) throw new Error("Expected " + targetAPSSum + " stats but got " + totalStatSum)
    else return stats
}
