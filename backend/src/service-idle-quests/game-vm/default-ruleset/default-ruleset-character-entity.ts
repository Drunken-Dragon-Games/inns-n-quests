import { APS, CharacterEntity, newAPS } from "../character-entity.js";
import { CharacterEntityRuleset } from "../iq-ruleset.js";
import { EncounterReward } from "../encounter.js";
import { cubicSolver } from "../utils.js";

class DefaultCharacterRuleset implements CharacterEntityRuleset {

    natMaxHitPoints(ivAPS: APS, xpAPS: APS): number {
        const ev = this.evAPS(ivAPS, xpAPS)
        return (ev.athleticism + ev.intellect / 2) * 100
    }

    evAPS(ivAPS: APS, xpAPS: APS): APS { return {
        athleticism: this.apsLevelByXP(xpAPS.athleticism) - 1 + ivAPS.athleticism,
        intellect: this.apsLevelByXP(xpAPS.intellect) - 1 + ivAPS.intellect,
        charisma: this.apsLevelByXP(xpAPS.charisma) - 1 + ivAPS.charisma,
    }}

    totalXPRequiredForNextAPSLevel(currentLevel: number): number {
        return 10 * ((currentLevel * (currentLevel + 1) * (2 * currentLevel + 1) / 6) + (10 * (currentLevel * (currentLevel + 1) / 2)))
    }

    levelUp(party: CharacterEntity[], reward: EncounterReward, bonus: APS = newAPS([1,1,1])): CharacterEntity[] {
        const xpReward = reward.experience
        if (!xpReward) return party
        
        const individualXP = ((): Record<string, APS> => {
            const amount = party.length
            const scale = 0.1
            const individualAthXP = Math.ceil(xpReward.athleticism / amount)
            const individualIntXP = Math.ceil(xpReward.intellect / amount)
            const individualChaXP = Math.ceil(xpReward.charisma / amount)
            return party.reduce((result, character) => ({
                ...result, 
                [character.entityId]: newAPS(
                    [ Math.ceil(character.ivAPS.athleticism * individualAthXP * scale * bonus.athleticism)
                    , Math.ceil(character.ivAPS.intellect * individualIntXP * scale * bonus.intellect)
                    , Math.ceil(character.ivAPS.charisma * individualChaXP * scale * bonus.charisma)
                    ])
            }), {} as Record<string, APS>)
        })()

        return party.map(character => {
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
    }

    takeDamage(party: CharacterEntity, challengeAPS: APS): CharacterEntity {
        return party
    }

    apsLevelByXP(xp: number): number {
        if (xp === 0) return 1
        const roots = cubicSolver(10 / 3, 55, 155 / 3, -xp);
        const realRoots = roots.map(root => {
            return root.real;
        })
        const root = realRoots.find(root => root >= 0)
        return Math.floor(Math.round(root! * 10) / 10 + 1);
    }
}

export default DefaultCharacterRuleset
