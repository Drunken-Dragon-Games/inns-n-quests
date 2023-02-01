import * as genrand from "random-seed"

/** Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
const shuffle = (rand: genrand.RandomSeed) => <A>(array: A[]): A[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(rand.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

/** Inclusive on both ends */
const randomNumberBetween = (rand: genrand.RandomSeed) => (min: number, max: number): number =>
    Math.floor(rand.random() * (max - min + 1)) + min

const buildBaseStatsArray = (): ("athleticism" | "intellect" | "charisma")[] =>
    ["athleticism", "intellect", "charisma"]

export default function apsRandomizer(targetAPS: number, rand: genrand.RandomSeed): { athleticism: number, intellect: number, charisma: number } {
    // Assign stats as best as possible
    let currentSum = 0, overflow = 0
    const baseStatsOrder = shuffle(rand)(buildBaseStatsArray())
    const singleStatMax = 10
    const stats = { athleticism: 0, intellect: 0, charisma: 0 }
    baseStatsOrder.forEach((stat, i) => {
        if (i == 2) {
            const semiFinalStat = targetAPS - currentSum
            const finalStat = Math.min(singleStatMax, semiFinalStat)
            overflow = semiFinalStat - finalStat
            stats[stat] = finalStat
        } else {
            const maxPossibleStat = Math.min(Math.min(targetAPS - 2, singleStatMax), targetAPS - 1 - currentSum)
            const finalStat = randomNumberBetween(rand)(1, maxPossibleStat)
            currentSum += finalStat
            stats[stat] = finalStat
        }
    })
    if (overflow > 0) console.log("Overflowed by " + overflow)
    // Randomly distribute the rest
    while (overflow > 0) {
        baseStatsOrder.forEach((stat) => {
            const currentStat = stats[stat]
            if (currentStat == singleStatMax || overflow <= 0) return
            const maxPossibleIncrement = Math.min(singleStatMax - currentStat, overflow)
            const randomIncrement = randomNumberBetween(rand)(1, maxPossibleIncrement)
            const finalStat = randomIncrement + currentStat 
            overflow -= randomIncrement
            stats[stat] = finalStat
        })
    }
    const totalStatSum = stats.athleticism + stats.intellect + stats.charisma
    if (totalStatSum != targetAPS) throw new Error("Expected " + targetAPS + " stats but got " + totalStatSum)
    else return stats
}