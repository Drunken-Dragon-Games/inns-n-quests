import { CharacterEntityRuleset, APS, CharacterType, CharacterEntity, newAPS } from "../character-entity";
import { Reward } from "../quests";
import { cubicSolver } from "../utils";

const DefaultCharacterRuleset: CharacterEntityRuleset = {

    natMaxHitPoints: (ivAPS: APS, xpAPS: APS): number => {
        const ev = DefaultCharacterRuleset.evAPS(ivAPS, xpAPS)
        return (ev.athleticism + ev.intellect / 2) * 100
    },

    evAPS: (ivAPS: APS, xpAPS: APS): APS => ({
        athleticism: DefaultCharacterRuleset.apsLevelByXP(xpAPS.athleticism) - 1 + ivAPS.athleticism,
        intellect: DefaultCharacterRuleset.apsLevelByXP(xpAPS.intellect) - 1 + ivAPS.intellect,
        charisma: DefaultCharacterRuleset.apsLevelByXP(xpAPS.charisma) - 1 + ivAPS.charisma,
    }),

    apsLevelByXP: (xp: number): number => {
        if (xp === 0) return 1
        const roots = cubicSolver(10 / 3, 55, 155 / 3, -xp);
        const realRoots = roots.map(root => {
            return root.real;
        })
        const root = realRoots.find(root => root >= 0)
        return Math.floor(Math.round(root! * 10) / 10 + 1);
    },

    totalXPRequiredForNextAPSLevel: (currentLevel: number): number =>
        10 * ((currentLevel * (currentLevel + 1) * (2 * currentLevel + 1) / 6) + (10 * (currentLevel * (currentLevel + 1) / 2))),

    individualXPReward: (characters: CharacterEntity[], reward: APS, bonus: APS = newAPS([1,1,1])): Record<string, APS> => {
        const amount = characters.length
        const scale = 0.1
        const individualAthXP = Math.ceil(reward.athleticism / amount)
        const individualIntXP = Math.ceil(reward.intellect / amount)
        const individualChaXP = Math.ceil(reward.charisma / amount)
        return characters.reduce((result, character) => ({
            ...result, 
            [character.entityId]: newAPS(
                [ Math.ceil(character.ivAPS.athleticism * individualAthXP * scale * bonus.athleticism)
                , Math.ceil(character.ivAPS.intellect * individualIntXP * scale * bonus.intellect)
                , Math.ceil(character.ivAPS.charisma * individualChaXP * scale * bonus.charisma)
                ])
        }), {} as Record<string, APS>)
    },

    levelUp: (characters: CharacterEntity[], reward: Reward, bonus: APS = newAPS([1,1,1])): CharacterEntity[] => {
        const xpReward = reward.apsExperience
        if (!xpReward) return characters
        const individualXP = DefaultCharacterRuleset.individualXPReward(characters, xpReward, bonus)
        return characters.map(character => {
            const xp = individualXP[character.entityId]
            return {
                ...character,
                xpAPS: {
                    athleticism: character.xpAPS.athleticism + xp.athleticism,
                    intellect: character.xpAPS.intellect + xp.intellect,
                    charisma: character.xpAPS.charisma + xp.charisma,
                },
            }
        })
    },
}

export default DefaultCharacterRuleset