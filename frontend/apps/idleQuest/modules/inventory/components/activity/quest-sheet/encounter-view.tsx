import { useMemo, useState } from "react"
import styled from "styled-components"
import { AvailableEncounter, Character, ProgressBar } from "../../../../../common"
import * as vm from "../../../../../game-vm"
import { notEmpty } from "../../../../../utils"

const EncounterStrategyContainer = styled.div`
    padding-top: 10px;
`

const EncounterStrategyInfo = styled.div`
    padding-bottom: 10px;
`

const EncounterChallengeContainer = styled.div`
    padding: 5px 10px;
`

const ChallengeDifficultyWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: baseline;
`

const Contribution = styled.p`
    padding-top: 3px;
    font-size: 16px;
    font-weight: 600;
`

const skillPower = (skill: vm.SkillInfo, character: Character) => 
    skill.benefits.athleticism * character.evAPS.athleticism +
    skill.benefits.intellect * character.evAPS.intellect +
    skill.benefits.charisma * character.evAPS.charisma

const applyVulWeak = (power: number, damageTypes: vm.DamageType[], resistances: vm.DamageType[], weaknesses: vm.DamageType[]): number => {
    const resistant = damageTypes.some(dType => resistances.includes(dType)) ?? false
    const weak = damageTypes.some(dType => weaknesses.includes(dType)) ?? false
    const finalPower = resistant && weak ? power : resistant ? power * 0.5 : weak ? power * 2 : power
    return finalPower
}

const percentage = (value: number, total: number) => Math.min(Math.round(value * 100 / total), 100)

type GeneralDmgType = "Will" | "Magic" | "Physical"

const skillDamageType = (skill: vm.SkillInfo): GeneralDmgType[] => 
    skill.damage?.map(dType => {
        if (vm.willDamageTypes.includes(dType)) return "Will"
        if (vm.magicDamageTypes.includes(dType)) return "Magic"
        return "Physical"
    }) ?? []

type EncounterStrategyState = {
    challenges: { challenge: vm.Challenge, power: number, contributors: { 
        character: Character, skill: string, skillInfo: vm.SkillInfo }[] }[] 
    combat?: { 
        willDmg: number, 
        magicDmg: number, 
        physicalDmg: number, 
        willHitPoints: number,
        magicHitPoints: number,
        physicalHitPoints: number,
        willResistances?: string,
        magicResistances?: string,
        physicalResistances?: string,
        willWeaknesses?: string,
        magicWeaknesses?: string,
        physicalWeaknesses?: string,
        contributors: { 
            power: number, 
            skill: string, 
            skillInfo: vm.SkillInfo, 
            dmgTypes: GeneralDmgType[] 
        }[] }
    successChance: string
}

const useEncounterStrategyState = (strategy: vm.Strategy, party: Character[]): EncounterStrategyState => {
    const challenges = useMemo(() =>
        strategy.challenges.map(challenge => {
            const contributors = party.map(character => {
                const solvedBy = challenge.solvedBy
                const skills = character.skills?.filter(skill => {
                    const provokes = vm.Skills.get(skill).provokes
                    return solvedBy.includes(skill) || provokes?.some(c => solvedBy.includes(c))
                })
                return skills && skills.length > 0 ? { character, skill: skills[0], skillInfo: vm.Skills.get(skills[0]) } : undefined
            }).filter(notEmpty) as { character: Character, skill: string, skillInfo: vm.SkillInfo }[]
            return {
                challenge,
                power: contributors.reduce((acc, character) => acc + skillPower(character.skillInfo, character.character), 0),
                contributors,
            }
    }), [strategy, party])

    const combat = useMemo(() => {
        const combat = strategy.combat
        if (!combat) return

        const willResistances = combat.resistances.filter((damageType) => vm.willDamageTypes.includes(damageType))
        const magicResistances = combat.resistances.filter((damageType) => vm.magicDamageTypes.includes(damageType))
        const physicalResistances = combat.resistances.filter((damageType) => vm.physicalDamageTypes.includes(damageType))

        const willVulnerabilities = combat.weaknesses.filter((damageType) => vm.willDamageTypes.includes(damageType))
        const magicVulnerabilities = combat.weaknesses.filter((damageType) => vm.magicDamageTypes.includes(damageType))
        const physicalVulnerabilities = combat.weaknesses.filter((damageType) => vm.physicalDamageTypes.includes(damageType))

        const contributors = party.flatMap(character => 
            character.skills?.map(skill => {
                const skillInfo = vm.Skills.get(skill)
                const dmgTypes = skillDamageType(skillInfo)
                const prePower = skillPower(skillInfo, character)
                const power = 
                    skillInfo.damage ? applyVulWeak(prePower, skillInfo.damage, combat.resistances, combat.weaknesses)
                    : prePower
                return skillInfo.damage ? { 
                    skill, 
                    skillInfo, 
                    power, 
                    dmgTypes,
                } : undefined
            }).filter(notEmpty)
        ).filter(notEmpty) as { skill: string, skillInfo: vm.SkillInfo, power: number, dmgTypes: GeneralDmgType[]}[]

        const willDmg = contributors.filter(({dmgTypes}) => dmgTypes.includes("Will")).reduce((acc, {power}) => acc + power, 0)
        const magicDmg = contributors.filter(({dmgTypes}) => dmgTypes.includes("Magic")).reduce((acc, {power}) => acc + power, 0)
        const physicalDmg = contributors.filter(({dmgTypes}) => dmgTypes.includes("Physical")).reduce((acc, {power}) => acc + power, 0)

        return { ...combat, willDmg, magicDmg, physicalDmg, contributors,
            willResistances: willResistances.length > 0 ? " | RESIST: " + willResistances.join(", ") : undefined,
            magicResistances: magicResistances.length > 0 ? " | RESIST: " + magicResistances.join(", ") : undefined,
            physicalResistances: physicalResistances.length > 0 ? " | RESIST: " + physicalResistances.join(", ") : undefined,
            willWeaknesses: willVulnerabilities.length > 0 ? " | WEAK: " + willVulnerabilities.join(", ") : undefined,
            magicWeaknesses: magicVulnerabilities.length > 0 ? " | WEAK: " + magicVulnerabilities.join(", ") : undefined,
            physicalWeaknesses: physicalVulnerabilities.length > 0 ? " | WEAK: " + physicalVulnerabilities.join(", ") : undefined,
        }
        
    }, [strategy, party])

    const chance = useMemo(() => {
        const challengePercentage = challenges.reduce((acc, {power, challenge}) => acc + percentage(power, challenge.difficulty), 0) / challenges.length
        const willPercentage = combat ? percentage(combat.willDmg, combat.willHitPoints) : 0
        const magicPercentage = combat ? percentage(combat.magicDmg, combat.magicHitPoints) : 0
        const physicalPercentage = combat ? percentage(combat.physicalDmg, combat.physicalHitPoints) : 0
        const combatPercentage = combat ? 
            willPercentage > magicPercentage && willPercentage > physicalPercentage ? willPercentage :
            magicPercentage > physicalPercentage ? magicPercentage :
            physicalPercentage 
        : 0
        const successChance = 
            combat && challenges.length > 0 ?  
                Math.round((challengePercentage * 2 + combatPercentage) / 3) + "%" :
            combat ? 
                Math.round(combatPercentage) + "%" :
                Math.round(challengePercentage) + "%"
        return { successChance }
    }, [strategy, party])

    return { challenges, combat, ...chance }
}

const EncounterStrategy = ({ strategy, party }: { strategy: vm.Strategy, party: Character[] }) => {
    const state = useEncounterStrategyState(strategy, party)
    return (
        <EncounterStrategyContainer>
            <EncounterStrategyInfo>
                <h2>{strategy.name.toUpperCase().slice(0, -1)}</h2>
                <h3>{state.successChance} SUCCESS CHANCE</h3>
                <p>{strategy.description}</p>
            </EncounterStrategyInfo>
            <h3>Challenges</h3>
            {state.challenges.map(({challenge, power, contributors}, index) =>
                <EncounterChallengeContainer key={"encounter-challenge-" + index}>
                    <h4>{challenge.name}</h4>
                    <p>{challenge.description}</p>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={challenge.difficulty} currentValue={power} />
                        <h5>(DIFF {challenge.difficulty}) Solved by: {challenge.solvedBy.join(", ")}</h5>
                    </ChallengeDifficultyWrapper>
                    <h5>(PWR {power}) { contributors.length > 0 ? contributors.map(c => c.skill).join(", ") : null }</h5>
                </EncounterChallengeContainer>
            )}
            {state.combat ? <>
                <EncounterChallengeContainer key="combat">
                    <h4>COMBAT</h4>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={state.combat.willHitPoints} currentValue={state.combat.willDmg} reverse />
                        <h5>{state.combat.willHitPoints} HP WILL {state.combat.willResistances} {state.combat.willWeaknesses}</h5>
                    </ChallengeDifficultyWrapper>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={state.combat.magicHitPoints} currentValue={state.combat.magicDmg} reverse />
                        <h5>{state.combat.magicHitPoints} HP MAGIC {state.combat.magicResistances} {state.combat.magicWeaknesses}</h5>
                    </ChallengeDifficultyWrapper>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={state.combat.physicalHitPoints} currentValue={state.combat.physicalDmg} reverse />
                        <h5>{state.combat.physicalHitPoints} HP PHYSICAL {state.combat.physicalResistances} {state.combat.physicalWeaknesses}</h5>
                    </ChallengeDifficultyWrapper>
                    { state.combat.contributors.map(({power, skill, skillInfo, dmgTypes}, index) => 
                        <Contribution key={"combat-contributor-" + index}>(PWR {power}) {skill} ({skillInfo.damage?.join(", ")} = {dmgTypes.join(", ")})</Contribution>
                    )}
                </EncounterChallengeContainer>
            </> : <></> }
        </EncounterStrategyContainer>
    )
}

const EncounterViewContainer = styled.div`

`

const EncounterTabs = styled.div`
    display: flex;
    gap: 10px;
    padding: 10px 0;
    color: white;
`

const EncounterTab = styled.div<{ selected: boolean }>`
    padding: 8px 10px;
    border-radius: 5px;
    background-color: #793312;
    cursor: pointer;
    background-color: ${props => props.selected ? "rgba(121, 51, 18, 0.5)" : "#793312" };#"rgba(121, 51, 18, 0.8)" };
    &:hover {
        background-color: rgba(121, 51, 18, 0.5);
    }
`

const EncounterView = ({ encounter, party }: { encounter: AvailableEncounter, party: Character[] }) => {
    const [selectedStrategy, setSelectedStrategy] = useState(0)
    return (
        <EncounterViewContainer>
            <h3>STRATEGIES</h3>
            <EncounterTabs>
                {encounter.strategies.map((strategy, index) =>
                    <EncounterTab 
                        key={"encounter-tab-" + index} 
                        selected={index === selectedStrategy}
                        onClick={() => setSelectedStrategy(index)}
                    >
                        {strategy.name.toUpperCase().slice(0, -1)}
                    </EncounterTab>
                )}
            </EncounterTabs>
            <EncounterStrategy strategy={encounter.strategies[selectedStrategy]} party={party} />
        </EncounterViewContainer>
    )
}

export default EncounterView
