import { useMemo, useState } from "react"
import styled from "styled-components"
import { AvailableEncounter, Character, ProgressBar, rules } from "../../../../../common"
import * as vm from "../../../../../game-vm"

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

type EncounterStrategyState = {
    challenges: vm.ChallengeConfiguration[]
    combat?: vm.CombatConfiguration & { 
        weaknesses: { will?: string, magic?: string, physical?: string }, 
        resistances: { will?: string, magic?: string, physical?: string } 
    }
    successChance: number
}

const useEncounterStrategyState = (strategy: vm.Strategy, party: Character[]): EncounterStrategyState => 
    useMemo(() => {
        const configuration = rules.encounter.strategyConfiguration(strategy, party)
        const combat = (() => {
            const combat = configuration.combat
            if (!combat) return 

            const willResistances = combat.combat.resistances.filter((damageType) => vm.willDamageTypes.includes(damageType))
            const magicResistances = combat.combat.resistances.filter((damageType) => vm.magicDamageTypes.includes(damageType))
            const physicalResistances = combat.combat.resistances.filter((damageType) => vm.physicalDamageTypes.includes(damageType))

            const willWeaknesses = combat.combat.weaknesses.filter((damageType) => vm.willDamageTypes.includes(damageType))
            const magicWeaknesses = combat.combat.weaknesses.filter((damageType) => vm.magicDamageTypes.includes(damageType))
            const physicalWeamagicWeaknesses = combat.combat.weaknesses.filter((damageType) => vm.physicalDamageTypes.includes(damageType))

            return {
                ...combat,
                resistances: {
                    will: willResistances.length > 0 ? " | RESIST: " + willResistances.join(", ") : undefined,
                    magic: magicResistances.length > 0 ? " | RESIST: " + magicResistances.join(", ") : undefined,
                    physical: physicalResistances.length > 0 ? " | RESIST: " + physicalResistances.join(", ") : undefined,
                },
                weaknesses: {
                    will: willWeaknesses.length > 0 ? " | WEAK: " + willWeaknesses.join(", ") : undefined,
                    magic: magicWeaknesses.length > 0 ? " | WEAK: " + magicWeaknesses.join(", ") : undefined,
                    physical: physicalWeamagicWeaknesses.length > 0 ? " | WEAK: " + physicalWeamagicWeaknesses.join(", ") : undefined,
                },
            }
        })()
        return {...configuration, combat}
    }, [strategy, party])

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
                    <h5>(PWR {power}) { contributors.length > 0 ? contributors.flatMap(c => c.skills).map(s => s.name).join(", ") : null }</h5>
                </EncounterChallengeContainer>
            )}
            {state.combat ? <>
                <EncounterChallengeContainer key="combat">
                    <h4>COMBAT</h4>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={state.combat.combat.willHitPoints} currentValue={state.combat.damage.will} reverse />
                        <h5>{state.combat.combat.willHitPoints} HP WILL {state.combat.resistances.will} {state.combat.weaknesses.will}</h5>
                    </ChallengeDifficultyWrapper>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={state.combat.combat.magicHitPoints} currentValue={state.combat.damage.magic} reverse />
                        <h5>{state.combat.combat.magicHitPoints} HP MAGIC {state.combat.resistances.magic} {state.combat.weaknesses.magic}</h5>
                    </ChallengeDifficultyWrapper>
                    <ChallengeDifficultyWrapper>
                        <ProgressBar maxValue={state.combat.combat.physicalHitPoints} currentValue={state.combat.damage.physical} reverse />
                        <h5>{state.combat.combat.physicalHitPoints} HP PHYSICAL {state.combat.resistances.physical} {state.combat.weaknesses.physical}</h5>
                    </ChallengeDifficultyWrapper>
                    { state.combat.contributors.map(({character, power, skills}, index) => 
                        <Contribution key={"combat-contributor-" + index}>(PWR {power}) {character.name} ({skills.map(({name, damage}) => `${name}(${damage?.join(", ")})`).join("  ")})</Contribution>
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
