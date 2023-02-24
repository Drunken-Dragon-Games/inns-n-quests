import Random from "../../tools-utils/random"
import { apsSum, generateRandomAPS } from "./adventurer-fun"

test("generateRandomAPS simple check", () => {
    const rand = new Random("test")
    expect(apsSum(generateRandomAPS(30, rand))).toBe(30)
    expect(apsSum(generateRandomAPS(28, rand))).toBe(28)
    expect(apsSum(generateRandomAPS(21, rand))).toBe(21)
    expect(apsSum(generateRandomAPS(16, rand))).toBe(16)
    expect(apsSum(generateRandomAPS(11, rand))).toBe(11)
    expect(apsSum(generateRandomAPS(10, rand))).toBe(10)
    expect(apsSum(generateRandomAPS(6, rand))).toBe(6)
    expect(apsSum(generateRandomAPS(3, rand))).toBe(3)
})
