import { levelByXP, totalXPRequiredForNextLevel } from './adventurer-equations'

test("Simple level equations checks", () => {
    expect(levelByXP(totalXPRequiredForNextLevel(5))).toBe(6)
    expect(levelByXP(totalXPRequiredForNextLevel(10))).toBe(11)
    expect(levelByXP(totalXPRequiredForNextLevel(15))).toBe(16)
    expect(levelByXP(totalXPRequiredForNextLevel(92))).toBe(93)
    expect(levelByXP(totalXPRequiredForNextLevel(123))).toBe(124)
})