import Random from "../../tools-utils/random"
import apsRandomizer from "./aps-randomizer"

const sum = (aps: { athleticism: number, intellect: number, charisma: number }): number =>
    aps.athleticism + aps.intellect + aps.charisma

test("apsRandomizer simple check", () => {
    const rand = new Random("test")
    expect(sum(apsRandomizer(30, rand))).toBe(30)
    expect(sum(apsRandomizer(28, rand))).toBe(28)
    expect(sum(apsRandomizer(21, rand))).toBe(21)
    expect(sum(apsRandomizer(16, rand))).toBe(16)
    expect(sum(apsRandomizer(11, rand))).toBe(11)
    expect(sum(apsRandomizer(10, rand))).toBe(10)
    expect(sum(apsRandomizer(6, rand))).toBe(6)
    expect(sum(apsRandomizer(3, rand))).toBe(3)
})