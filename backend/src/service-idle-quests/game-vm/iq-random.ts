
export default abstract class IQRandom {

    abstract genrand(): number

    abstract seed(s: string): IQRandom

    /** Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
    shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(this.genrand() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    /** Inclusive on both ends */
    randomNumberBetween(min: number, max: number): number {
        return Math.floor(this.genrand() * (max - min + 1)) + min
    }

    pickRandom<T>(elements: T[]): T {
        return elements[this.randomNumberBetween(0, elements.length - 1)]
    }

    pickRandoms<T>(elements: T[], amount: number): T[] {
        return [...Array(amount)].map(() => elements[this.randomNumberBetween(0, elements.length - 1)])
    }
}
