import { CharacterEntity } from "../character-entity/index.js";
import { ChallengeConfiguration, CombatConfiguration, ConfigurationCharacter, ConfigurationContributor, StrategyConfiguration } from "../encounter/encounter-configuration.js";
import { Strategy, EncounterOutcome, Challenge, SkillInfo, GeneralDamageType, willDamageTypes, magicDamageTypes, DamageType } from "../encounter/encounter.js";
import { noEncounterReward } from "../index.js";
import { WithEV } from "../iq-entity.js";
import { EncounterRuleset } from "../iq-ruleset.js";
import { SkillName, Skills } from "../skills/index.js";
import { notEmpty, percentage } from "../utils.js";

export default class DefaultEncounterRuleset implements EncounterRuleset {

    constructor(
    ){}

    outcome(encounter: Strategy, party: ConfigurationCharacter[]): EncounterOutcome {
        return { ctype: "success-outcome", party, reward: noEncounterReward }
    }

    strategyConfiguration(strategy: Strategy, party: ConfigurationCharacter[]): StrategyConfiguration {

        const challengeConfiguration = (challenge: Challenge): ChallengeConfiguration => {
            const contributors: ConfigurationContributor[] = party.map(character => {
                const solvedBy = challenge.solvedBy
                const skills = character.skills
                if (!skills) 
                    return undefined
                const solutionSkills = skills
                    .map(skill => Skills[skill])
                    .filter(skill => solvedBy.includes(skill.name as SkillName) || skill.provokes?.some(c => solvedBy.includes(c)))
                if (solutionSkills.length === 0) 
                    return undefined
                return { character, skills: solutionSkills, power: this.skillPower(solutionSkills, character) }
            }).filter(notEmpty)
            return {
                challenge,
                power: contributors.reduce((acc, { power }) => acc + power, 0),
                contributors,
            }
        }

        const challengesConfiguration: ChallengeConfiguration[] =
            strategy.challenges.map(challengeConfiguration)
        
        const combatConfiguration = ((): CombatConfiguration | undefined => {
            const combat = strategy.combat
            if (!combat) return

            const contributorSkills = 
                party.flatMap(character => {
                    const damageSkills = character.skills?.map(skill => Skills[skill]).filter(skill => notEmpty(skill.damage))
                    if (!damageSkills || damageSkills.length == 0) return []
                    const skills = damageSkills.map(skill => {
                        const dmgTypes = this.skillGeneralDamageTypes(skill)
                        const prePower = this.skillPower(skill, character)
                        const power = this.applyDamageModifiers(prePower, { damageTypes: skill.damage!, ...combat })
                        return { skill, power, dmgTypes }
                    })
                    return { character, skills }
                })

            const willDamage = contributorSkills
                .flatMap(c => c.skills)
                .filter(({ dmgTypes }) => dmgTypes.includes("Will"))
                .reduce((acc, {power}) => acc+power, 0)
            const magicDamage = contributorSkills
                .flatMap(c => c.skills)
                .filter(({ dmgTypes }) => dmgTypes.includes("Magic"))
                .reduce((acc, {power}) => acc+power, 0)
            const physicalDamage = contributorSkills
                .flatMap(c => c.skills)
                .filter(({ dmgTypes }) => dmgTypes.includes("Physical"))
                .reduce((acc, {power}) => acc+power, 0)
            
            const contributors = contributorSkills.map(({ character, skills }) => 
                ({ character, power: skills.reduce((acc, { power }) => acc + power, 0), skills: skills.map(({ skill }) => skill) }))

            return { combat, damage: { will: willDamage, magic: magicDamage, physical: physicalDamage }, contributors }
        })()

        const successChance = ((): number => {
            const combat = combatConfiguration
            const challengePercentage = challengesConfiguration.reduce((acc, { power, challenge }) => acc + percentage(power, challenge.difficulty), 0) / challengesConfiguration.length
            const willPercentage = combat ? percentage(combat.damage.will, combat.combat.willHitPoints) : 0
            const magicPercentage = combat ? percentage(combat.damage.magic, combat.combat.magicHitPoints) : 0
            const physicalPercentage = combat ? percentage(combat.damage.physical, combat.combat.physicalHitPoints) : 0
            const combatPercentage = combat ?
                willPercentage > magicPercentage && willPercentage > physicalPercentage ? 
                    willPercentage :
                magicPercentage > physicalPercentage ? magicPercentage :
                    physicalPercentage
                : 0
            const successChance =
                combat && challengesConfiguration.length > 0 ?
                    Math.round((challengePercentage * 2 + combatPercentage) / 3) :
                combat ?
                    Math.round(combatPercentage) :
                Math.round(challengePercentage)
            return successChance
        })()

        return { strategy, successChance, challenges: challengesConfiguration, combat: combatConfiguration }
    }

    skillGeneralDamageTypes(skill: SkillInfo): GeneralDamageType[] {
        return skill.damage?.map(dType => {
            if (willDamageTypes.includes(dType)) return "Will"
            if (magicDamageTypes.includes(dType)) return "Magic"
            return "Physical"
        }) ?? []
    }

    skillPower(skill: SkillInfo | SkillInfo[], character: CharacterEntity & WithEV): number {
        const power = (skill: SkillInfo): number => 
            skill.benefits.athleticism * character.evAPS.athleticism +
            skill.benefits.intellect * character.evAPS.intellect +
            skill.benefits.charisma * character.evAPS.charisma 
        if (Array.isArray(skill)) 
            return skill.reduce((acc, skill) => acc + power(skill), 0)
        else
            return power(skill)
    }

    applyDamageModifiers(power: number, modifiers: { damageTypes: DamageType[], resistances: DamageType[], weaknesses: DamageType[] }): number {
        const resistant = modifiers.damageTypes.some(dType => modifiers.resistances.includes(dType)) ?? false
        const weak = modifiers.damageTypes.some(dType => modifiers.weaknesses.includes(dType)) ?? false
        const finalPower = resistant && weak ? power : resistant ? power * 0.5 : weak ? power * 2 : power
        return finalPower
    }
}
