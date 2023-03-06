import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import _ from "underscore"
import { AvailableEncounter, AvailableQuest, Character, PixelFontFamily, Push, TakenQuest, takenQuestSecondsLeft } from "../../../../../common"
import * as vm from "../../../../../game-vm"
import { notEmpty, PixelArtCss, PixelArtImage, useRememberLastValue, vh1 } from "../../../../../utils"
import { DraggableItem, getQuestAPSRequirement, makeDropBox, mapSealImage, questDescription, questName } from "../../../inventory-dsl"
import { InventoryState } from "../../../inventory-state"
import InventoryTransitions from "../../../inventory-transitions"
import PartySlot from "./party-slot"
import Signature from "./signature"

type RenderQuest = AvailableQuest | TakenQuest | AvailableEncounter

const QuestCardContainer = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 75vh;
    height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 1.8vh;
    padding: 3vh;
    z-index: 20;
    filter: drop-shadow(0px 0px 1vh rgba(0, 0, 0, 0.8));
    background: url(https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png);
    background-size: cover;
    color: #793312;
    font-size: 21px;
    ${PixelArtCss}
    ${PixelFontFamily}
`

const QuestInfo = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2vh;
    width: 100%;
    flex: 1;
`

const QuestInfoLeft = styled.div`
    height: 100%;
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 2vh;
`

const QuestInfoRight = styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Title = styled.h2`
    padding-left: 4vh;
    text-align: left;
    font-size: 3.5vh;
    font-weight: 900;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
`

const Details = styled.p`
    width: 100%;
    font-size: 2vh;
    text-align: justify;
    color: #793312;
    line-height: 2vh;
    font-weight: 100;
`

type ExperienceBarColor = "r" | "g" | "b" | "y"

const rgbMapping = (color: ExperienceBarColor, background: boolean) => {
    if (color == "r" && background) return "rgb(255, 170, 170)"
    if (color == "r" && !background) return "rgb(255, 80, 80)"
    if (color == "g" && background) return "rgb(200, 200, 200)"
    if (color == "g" && !background) return "rgb(80, 180, 80)"
    if (color == "b" && background) return "rgb(150, 150, 255)"
    if (color == "b" && !background) return "rgb(80, 80, 255)"
    if (color == "y" && background) return "rgb(255, 255, 150)"
    if (color == "y" && !background) return "rgb(255, 255, 80)"
}

const APSWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const glow = keyframes`
    100% {text-shadow: 0 0 1px rgba(255,255,0,0.2), 0 0 1px rgba(255,255,0,0.2), 0 0 1px rgba(255,255,0,0.2), 0 0 1px rgba(255,255,0,0.2), 0 0 1px rgba(255,255,0,0.2), 0 0 1px rgba(255,255,0,0.2); }
`

const ExperienceAnimation = (start: number, experience: number) => keyframes`
    0% {width: ${start}%;}
    100% {width: ${experience}%;}
`

const ExperienceBar = styled.div<{ $display: boolean, color: ExperienceBarColor, $glow: boolean }>`
    margin-top: 0.1vh;
    flex: 1;
    height: 1.2vh;
    overflow: hidden;
    border-radius: 0vh 1vh 0vh 1vh;
    background-color: ${props => rgbMapping(props.color, true)}};
    display: ${props => props.$display ? "block" : "none"};
    animation: ${props => props.$glow ? glow : "none"} 1s infinite;
`

const Experience = styled.div<{ start: number, experience: number, animate: boolean, color: ExperienceBarColor, $glow: boolean }>`
    height: inherit;
    border-radius: 0vh 1vh 0vh 1vh;
    background-color: ${props => rgbMapping(props.color, false)};
    width: ${props => props.experience}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.experience) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vh rgba(0, 0, 0, 0.5));
    span {
        filter: drop-shadow(0px 0px 0.2vh ${props => rgbMapping(props.$glow ? "y" : props.color, false)});
        font-family: Oswald;
        position: absolute;
        display: block;
        padding: 0;
        margin: -0.4vh 0 0 0.4vh;
        font-size: 1.3vh;
        font-weight: bold;
        color: ${props => rgbMapping(props.$glow ? "y" : props.color, true)};
    }
`

const APSReq = ({ apsRequired, apsAccumulated }: { apsRequired: vm.APS, apsAccumulated: vm.APS }) => {
    const lastAccumulated = useRef(vm.zeroAPS)
    const start = {
        athleticism: lastAccumulated.current.athleticism * 100 / apsRequired.athleticism,
        intellect: lastAccumulated.current.intellect * 100 / apsRequired.intellect,
        charisma: lastAccumulated.current.charisma * 100 / apsRequired.charisma
    }
    const glow = 
        apsAccumulated.athleticism >= apsRequired.athleticism &&
        apsAccumulated.intellect >= apsRequired.intellect &&
        apsAccumulated.charisma >= apsRequired.charisma
    useEffect(() => { lastAccumulated.current = apsAccumulated }, [apsAccumulated])
    return (
        <APSWrapper>
            <ExperienceBar $glow={glow} $display={true} color="r" key="ath">
                <Experience $glow={glow} start={start.athleticism} experience={apsAccumulated.athleticism * 100 / apsRequired.athleticism} animate={true} color="r">
                    <span>{apsRequired.athleticism}</span>
                </Experience>
            </ExperienceBar>
            <ExperienceBar $glow={glow} $display={true} color="b" key="int">
                <Experience $glow={glow} start={start.intellect} experience={apsAccumulated.intellect * 100 / apsRequired.intellect} animate={true} color="b">
                    <span>{apsRequired.intellect}</span>
                </Experience>
            </ExperienceBar>
            <ExperienceBar $glow={glow} $display={true} color="g" key="cha">
                <Experience $glow={glow} start={start.charisma} experience={apsAccumulated.charisma * 100 / apsRequired.charisma} animate={true} color="g">
                    <span>{apsRequired.charisma}</span>
                </Experience>
            </ExperienceBar>
        </APSWrapper>
    )
}

const PartyContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 1vh;
    flex-direction: row;
`

const SealImage = styled.div<{ offset: number }>`
    margin-top: ${props => props.offset}vh;
`

const Footer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 10vh;
`

type PartyViewState = {
    dropBoxRef: RefObject<HTMLDivElement>
    hovering?:Character 
    picked: Character | null
}[]

const usePartyViewState = (quest: RenderQuest, adventurerSlots: (Character | null)[]): PartyViewState => {
    const boxRef1 = useRef<HTMLDivElement>(null)
    const boxRef2 = useRef<HTMLDivElement>(null)
    const boxRef3 = useRef<HTMLDivElement>(null)
    const boxRef4 = useRef<HTMLDivElement>(null)
    const boxRef5 = useRef<HTMLDivElement>(null)
    const dropBoxesRefs = [boxRef1, boxRef2, boxRef3, boxRef4, boxRef5]
    const box1Bound = boxRef1.current?.getBoundingClientRect()

    useEffect(() => {
        if (quest.ctype === "taken-quest" || dropBoxesRefs.every(ref => ref.current == null)) return
        InventoryTransitions.registerDropBoxes("party-pick", dropBoxesRefs.map(makeDropBox))
        return InventoryTransitions.deregisterDropBoxes
    }, [boxRef1.current, boxRef2.current, boxRef3.current, boxRef4.current, boxRef5.current, quest,
        box1Bound?.left, box1Bound?.top, box1Bound?.bottom, box1Bound?.right, 
    ])

    const dropBoxesState = useSelector((state: InventoryState) => state.dropBoxesState, _.isEqual)

    const slotsState = useMemo<PartyViewState>(() => 
        dropBoxesRefs.map((dropBoxRef, index) => {
            const hovering: DraggableItem | undefined = dropBoxesState?.dropBoxes[index]?.hovering
            return {
                dropBoxRef,
                hovering: hovering?.ctype == "character" ? hovering : undefined,
                picked: adventurerSlots[index]
            }
        })
    , [dropBoxesState, adventurerSlots, quest])

    return slotsState
    /*
    return dropBoxesRefs.map((dropBoxRef, index) => {
        return {
            dropBoxRef,
            picked: adventurerSlots[index]
        }
    })
    */
}

const PartyView = ({ quest, adventurerSlots }: { quest: RenderQuest, adventurerSlots: (Character | null)[] }) => {
    const state = usePartyViewState(quest, adventurerSlots)
    return (
        <PartyContainer>
            {state.map(({ dropBoxRef, picked, hovering }, index) =>
                <div key={"character-slot-" + index} ref={dropBoxRef}>
                    <PartySlot
                        character={hovering ? hovering : picked}
                        preview={notEmpty(hovering) || quest.ctype === "taken-quest"}
                    />
                </div>
            )}
        </PartyContainer>
    )
}










const ProgressBarContainer = styled.div`
    height: 10px;
    min-width: 100px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #796257;
`

const ProgressBarProgress = styled.div<{ start: number, progress: number, animate: boolean }>`
    height: inherit;
    background-color: #793312;
    width: ${props => props.progress}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.progress) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vh rgba(0, 0, 0, 0.5));
    span {
        font-family: Oswald;
        position: absolute;
        display: block;
        padding: 0;
        margin: -0.4vh 0 0 0.4vh;
        font-size: 1.3vh;
        font-weight: bold;
    }
`

const ProgressBar = (props: { maxValue: number, currentValue: number, reverse?: boolean }) => {
    //const progress = props.currentValue * 100 / props.maxValue
    const p = Math.min(props.currentValue * 100 / props.maxValue, 100)
    const progress = props.reverse ? 100 - p : p
    const lastProgress = useRememberLastValue(progress, 0)
    return (
        <ProgressBarContainer>
            <ProgressBarProgress start={lastProgress} progress={progress} animate={true}>
            </ProgressBarProgress>
        </ProgressBarContainer>
    )
}

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














type QuestSheetState = {
    signatureType: "in-progress" | "finished" | "claimed" | "available-no-adventurers" | "available"
    apsRequired: vm.APS
    apsAccumulated: vm.APS
    sealImage: { src: string, width: number, height: number, offset: number }
}

const useQuestCardState = (quest: RenderQuest, adventurerSlots: (Character | null)[]): QuestSheetState => 
    useMemo<QuestSheetState>(() => ({
        signatureType: 
            quest.ctype == "available-quest" && adventurerSlots.filter(notEmpty).length > 0 ? "available" : 
            quest.ctype == "available-quest" ? "available-no-adventurers" : 
            quest.ctype == "taken-quest" && quest.claimedAt ? "claimed" :
            quest.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0 ? "finished" : 
            "in-progress",
        apsRequired: 
            getQuestAPSRequirement(quest),
        apsAccumulated: 
            adventurerSlots.filter(notEmpty).reduce((acc, character) =>
                vm.apsAdd(acc, character.evAPS), vm.zeroAPS),
        sealImage: 
            mapSealImage(quest)
    }), [quest, adventurerSlots])

interface QuestSheetProps {
    className?: string,
    quest: RenderQuest, 
    adventurerSlots: (Character | null)[],
}

const QuestSheet = ({ className, quest, adventurerSlots }: QuestSheetProps) => {
    if (!quest) return <></>
    const state = useQuestCardState(quest, adventurerSlots)
    return (
        <QuestCardContainer className={className}>
            <QuestInfo>
                <QuestInfoLeft>
                    <Title>{questName(quest)}</Title>
                    <Details dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                    {quest.ctype == "available-encounter" ?
                        <EncounterView encounter={quest} party={adventurerSlots.filter(notEmpty)} />
                    : <></> }
                </QuestInfoLeft>

                <QuestInfoRight>
                    <PixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                        alt="quest monster"
                        width={20} height={20}
                        units={vh1}
                    />
                    {/*<APSReq apsAccumulated={state.apsAccumulated} apsRequired={state.apsRequired} /> */}
                </QuestInfoRight>
            </QuestInfo>

            <Push />
            <PartyView quest={quest} adventurerSlots={adventurerSlots} />

            <Footer>
                <Signature
                    signatureType={state.signatureType}
                    onClick={InventoryTransitions.onSignQuest}
                />
                <Push/>
                <SealImage offset={state.sealImage.offset}>
                    <PixelArtImage
                        src={state.sealImage.src}
                        alt="quest seal"
                        width={state.sealImage.width}
                        height={state.sealImage.height}
                        units={vh1}
                    />
                </SealImage>
            </Footer>
        </QuestCardContainer>
    )
}

export default QuestSheet
