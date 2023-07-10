import randomseed from 'random-seed'
/**
 * this class exist to allow us to obtain random deterministic values
 */
export class RandomDSL {
    private readonly random: randomseed.RandomSeed

    constructor (seed: string) { 
        this.random = randomseed.create(seed)
     }
    
    static seed(s: string): RandomDSL{
        return new RandomDSL(s)
    }

    genRand(): number { 
        return this.random.random() }
    
    shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(this.genRand() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    randomNumberBetween(min: number, max: number): number {
        return Math.floor(this.genRand() * (max - min + 1)) + min
    }
}