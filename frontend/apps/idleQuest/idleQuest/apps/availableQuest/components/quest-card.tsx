import styled, { keyframes } from "styled-components"
import { CrispPixelArtBackground, CrispPixelArtImage, notEmpty } from "../../../../../utils"
import { Adventurer, APS, getQuestAPSRequirement, mergeAPSSum, questDescription, questName, questSeal, sameOrBetterAPS, SelectedQuest, takenQuestSecondsLeft, zeroAPS } from "../../../../dsl"
import { Seals, Signature, SuccessChance } from "../../../utils/components/basic_component"
import { ProgressionQuest } from "../../../utils/components/complex"
import { AdventurerSlot } from "."
import QuestLabelLevel from "./quest-label-level"
import { useEffect, useRef } from "react"

const BackShadow = styled.section<{ open: boolean }>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0,0,0,0.2);
    opacity: ${props => props.open ? 1 : 0};
    visibility: ${props => props.open ? "visible" : "hidden"};
    transition: opacity 1s, visibility 0.5s;
`

const CardContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    left: -10vw;
    width: 38vw;
    height: 43.4vw;
    filter: drop-shadow(0px 0px 1vw rgba(0, 0, 0, 0.8));
`

const InsideColumnWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;
`

const InsideLeftColumn = styled.div`
    display: flex;
    flex: 3;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

const InsideRightColumn = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: 2vw;
    padding-right: 1vw;
`

const Title = styled.h2`
    text-align: left;
    font-family: VT323;
    font-size: 1.7vw;
    font-weight: 900;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
    padding: 0vw 3.5vw;
    margin-top: 1.5vw;
    overflow: hidden;
    max-width: 25vw;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const Details = styled.p`
    margin-top: 2vw;
    width: 65%;
    height: 10.5vw;
    padding: 0vw 1.5vw 0vw 3vw;
    
    font-family: VT323;
    font-size: 1vw;
    color: #793312;
    line-height: 1.5vw;
    font-weight: 100;
`

const MonsterContainer = styled.div`
    position: relative;
    width: 9vw;
    height: 14vw;
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
    margin-top: 0.1vw;
    flex: 1;
    height: 1.2vw;
    overflow: hidden;
    border-radius: 0vw 1vw 0vw 1vw;
    background-color: ${props => rgbMapping(props.color, true)}};
    display: ${props => props.$display ? "block" : "none"};
    animation: ${props => props.$glow ? glow : "none"} 1s infinite;
`

const Experience = styled.div<{ start: number, experience: number, animate: boolean, color: ExperienceBarColor, $glow: boolean }>`
    height: inherit;
    border-radius: 0vw 1vw 0vw 1vw;
    background-color: ${props => rgbMapping(props.color, false)};
    width: ${props => props.experience}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.experience) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vw rgba(0, 0, 0, 0.5));
    span {
        filter: drop-shadow(0px 0px 0.2vw ${props => rgbMapping(props.$glow ? "y" : props.color, false)});
        font-family: Oswald;
        position: absolute;
        display: block;
        padding: 0;
        margin: -0.4vw 0 0 0.4vw;
        font-size: 1.3vw;
        font-weight: bold;
        color: ${props => rgbMapping(props.$glow ? "y" : props.color, true)};
    }
`

const APSReq = ({ apsRequired, apsAccumulated }: { apsRequired: APS, apsAccumulated: APS }) => {
    const lastAccumulated = useRef(zeroAPS)
    const start = {
        athleticism: lastAccumulated.current.athleticism * 100 / apsRequired.athleticism,
        intellect: lastAccumulated.current.intellect * 100 / apsRequired.intellect,
        charisma: lastAccumulated.current.charisma * 100 / apsRequired.charisma
    }
    const glow = sameOrBetterAPS(apsAccumulated, apsRequired)
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

const StyledSuccessChance = styled(SuccessChance)`
    position: absolute;
    right: -1vw;
    top: 15.5vw;
`

const ProgressionWrapper = styled.div`
    padding: 0vw 0vw;
    margin: 4vw 0vw 1vw 0vw;
`

const AdventurersWrapper = styled.div`
    width: 100%;
    display: flex;
    padding: 0vw 1vw;
    margin-top: auto;
`

const StyledQuestLabelLevel = styled(QuestLabelLevel)`
    right: 1vw;
`

const CornerRightDown = styled.div`
    position: absolute;
    right: 1vw;
    top: 33vw;
    z-index: -1;
`

const Footer = styled.div`
    width: 100%;
    height: 8vw;
`

const Monster = () =>
    <MonsterContainer>
        <CrispPixelArtImage
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
            alt="quest monster"
            layout="fill"
        />
    </MonsterContainer>

interface QuestPaperAvailableProps {
    className?: string,
    quest?: SelectedQuest, 
    adventurerSlots: (Adventurer | null)[],
    onSign?: (selectedQuest: SelectedQuest, adventurers: Adventurer[]) => void,
    onClose?: () => void,
    onUnselectAdventurer?: (adventurer: Adventurer) => void,
}

const QuestCard = ({ className, quest, adventurerSlots, onSign, onClose, onUnselectAdventurer }: QuestPaperAvailableProps) => {
    const signatureType 
        = quest?.ctype == "available-quest" && adventurerSlots.filter(notEmpty).length > 0 
            ? "available" 
        : quest?.ctype == "available-quest" 
            ? "available-no-adventurers"
        : quest?.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0 
            ? "finished"
        : "in-progress"
    const apsRequired = quest ? getQuestAPSRequirement(quest) : zeroAPS
    const apsAccumulated = adventurerSlots
        .filter(notEmpty)
        .reduce((acc, adventurer) => 
            mergeAPSSum(acc, { athleticism: adventurer.athleticism, intellect: adventurer.intellect, charisma: adventurer.charisma })
        , zeroAPS)
    return <BackShadow 
        onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose() }} 
        open={quest !== undefined} 
        className={className}>

        {notEmpty(quest) ?
            <CardContainer>
                <CrispPixelArtBackground
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png"
                    alt="paper prop"
                    layout="fill"
                />

                <StyledQuestLabelLevel>1</StyledQuestLabelLevel>

                <InsideColumnWrapper>
                    <InsideLeftColumn>
                        <Title>{questName(quest)}</Title>
                        <Details dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                    </InsideLeftColumn>

                    <InsideRightColumn>
                        {// <StyledSuccessChance percentage={0} />
                        }
                        <Monster />
                        {/*
                        <ProgressionWrapper>
                            <ProgressionQuest />
                        </ProgressionWrapper>
                        */}
                        <APSReq apsAccumulated={apsAccumulated} apsRequired={apsRequired} />
                    </InsideRightColumn>
                </InsideColumnWrapper>

                <AdventurersWrapper>
                    {adventurerSlots.map((adventurer, index) => 
                        <AdventurerSlot 
                            key={"adventurer-slot-"+index} 
                            adventurer={adventurer}
                            onUnselectAdventurer={ quest?.ctype === "available-quest" ? onUnselectAdventurer : undefined }
                        />
                    )} 
                </AdventurersWrapper>

                <Footer>
                    <CornerRightDown>
                        <Seals seal={questSeal(quest)} />
                    </CornerRightDown>

                    <Signature
                        signatureType={signatureType}
                        onClick={() => notEmpty(quest) && notEmpty(onSign) && onSign(quest, adventurerSlots.filter(notEmpty))}
                    />
                </Footer>
            </CardContainer>
            : <></>}
    </BackShadow>
}

export default QuestCard
