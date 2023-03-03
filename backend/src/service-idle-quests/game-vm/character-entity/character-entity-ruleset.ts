import { Reward } from "../quests"
import { APS } from "./aps"
import { CharacterEntity } from "./character-entity"

export type CharacterEntityRuleset = {
    natMaxHitPoints: (ivAPS: APS, xpAPS: APS) => number
    evAPS: (ivAPS: APS, xpAPS: APS) => APS
    apsLevelByXP: (xp: number) => number
    totalXPRequiredForNextAPSLevel: (currentLevel: number) => number
    individualXPReward: (character: CharacterEntity[], reward: APS, bonus: APS) => Record<string, APS>
    levelUp: (characters: CharacterEntity[], reward: Reward, bonus: APS) => CharacterEntity[]
}
