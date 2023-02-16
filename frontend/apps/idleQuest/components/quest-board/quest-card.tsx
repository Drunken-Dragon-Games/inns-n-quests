import styled, { keyframes } from "styled-components"
import { useEffect, useMemo, useRef } from "react"
import Signature from "./signature"
import { notEmpty, PixelArtCss, PixelArtImage } from "../../../utils"
import AdventurerSlot from "./adventurer-slot"
import { APS, zeroAPS, sameOrBetterAPS, SelectedQuest, questSeal, Adventurer, 
         takenQuestSecondsLeft, getQuestAPSRequirement, mergeAPSSum, questName, 
         questDescription, 
         mapSealImage} from "../../dsl"

const BackShadow = styled.section<{ open: boolean }>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0,0,0,0.2);
    opacity: ${props => props.open ? 1 : 0};
    visibility: ${props => props.open ? "visible" : "hidden"};
    transition: opacity 1s, visibility 0.5s;
`

const CardContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.8vmax;
    padding: 3vmax;
    width: 44vmax;
    min-height: 50vmax;
    max-height: 80vh;
    filter: drop-shadow(0px 0px 1vmax rgba(0, 0, 0, 0.8));
    background: url(https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png);
    background-size: cover;
    ${PixelArtCss}
`

const QuestInfo = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2vmax;
    width: 100%;
    flex: 1;
`

const QuestInfoLeft = styled.div`
    height: 100%;
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 2vmax;
`

const QuestInfoRight = styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Title = styled.h2`
    padding-left: 3vmax;
    text-align: left;
    font-family: VT323;
    font-size: 1.7vmax;
    font-weight: 900;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
`

const Details = styled.p`
    width: 100%;
    font-family: VT323;
    font-size: 1.5vmax;
    text-align: justify;
    color: #793312;
    line-height: 1.5vmax;
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
    margin-top: 0.1vmax;
    flex: 1;
    height: 1.2vmax;
    overflow: hidden;
    border-radius: 0vmax 1vmax 0vmax 1vmax;
    background-color: ${props => rgbMapping(props.color, true)}};
    display: ${props => props.$display ? "block" : "none"};
    animation: ${props => props.$glow ? glow : "none"} 1s infinite;
`

const Experience = styled.div<{ start: number, experience: number, animate: boolean, color: ExperienceBarColor, $glow: boolean }>`
    height: inherit;
    border-radius: 0vmax 1vmax 0vmax 1vmax;
    background-color: ${props => rgbMapping(props.color, false)};
    width: ${props => props.experience}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.experience) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vmax rgba(0, 0, 0, 0.5));
    span {
        filter: drop-shadow(0px 0px 0.2vmax ${props => rgbMapping(props.$glow ? "y" : props.color, false)});
        font-family: Oswald;
        position: absolute;
        display: block;
        padding: 0;
        margin: -0.4vmax 0 0 0.4vmax;
        font-size: 1.3vmax;
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

const AdventurersWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 1vmax;
    flex-direction: row;
`

const SealImage = styled(PixelArtImage)`
    right: 3vmax;
    bottom: 3vmax;
    z-index: -1;
`

const Footer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 4.5vmax;
`

interface QuestPaperTakenState {
    signatureType: "in-progress" | "finished" | "available-no-adventurers" | "available"
    apsRequired: APS
    apsAccumulated: APS
    sealImage: { src: string, width: number, height: number }
}

const memoQuestCardState = (quest: SelectedQuest, adventurerSlots: (Adventurer | null)[]): QuestPaperTakenState => 
    useMemo(() => ({
        signatureType: 
            quest.ctype == "available-quest" && adventurerSlots.filter(notEmpty).length > 0 ? "available" : 
            quest.ctype == "available-quest" ? "available-no-adventurers" : 
            quest.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0 ? "finished" : 
            "in-progress",
        apsRequired: 
            getQuestAPSRequirement(quest),
        apsAccumulated: 
            adventurerSlots.filter(notEmpty).reduce((acc, adventurer) =>
                mergeAPSSum(acc, { 
                    athleticism: adventurer.athleticism, 
                    intellect: adventurer.intellect, 
                    charisma: adventurer.charisma 
                }), zeroAPS),
        sealImage: 
            mapSealImage(quest)
    }), [quest, adventurerSlots])

interface QuestPaperAvailableProps {
    className?: string,
    quest?: SelectedQuest, 
    adventurerSlots: (Adventurer | null)[],
    onSign?: (selectedQuest: SelectedQuest, adventurers: Adventurer[]) => void,
    onClose?: () => void,
    onUnselectAdventurer?: (adventurer: Adventurer) => void,
}

const QuestCard = ({ className, quest, adventurerSlots, onSign, onClose, onUnselectAdventurer }: QuestPaperAvailableProps) => {
    if (!quest) return <></>
    const state = memoQuestCardState(quest, adventurerSlots)
    return (
        <CardContainer className={className}>
            <QuestInfo>
                <QuestInfoLeft>
                    <Title>{questName(quest)}</Title>
                    <Details dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                </QuestInfoLeft>

                <QuestInfoRight>
                    <PixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                        alt="quest monster"
                        width={15} height={15}
                    />
                    <APSReq apsAccumulated={state.apsAccumulated} apsRequired={state.apsRequired} />
                </QuestInfoRight>
            </QuestInfo>

            <AdventurersWrapper>
                {adventurerSlots.map((adventurer, index) =>
                    <AdventurerSlot
                        key={"adventurer-slot-" + index}
                        adventurer={adventurer}
                        onUnselectAdventurer={quest?.ctype === "available-quest" ? onUnselectAdventurer : undefined}
                    />
                )}
            </AdventurersWrapper>

            <Footer>
                <Signature
                    signatureType={state.signatureType}
                    onClick={() => notEmpty(quest) && notEmpty(onSign) && onSign(quest, adventurerSlots.filter(notEmpty))}
                />

                <SealImage
                    src={state.sealImage.src}
                    alt="quest seal"
                    width={state.sealImage.width}
                    height={state.sealImage.height}
                    absolute
                />
            </Footer>
        </CardContainer>
    )
}

export default QuestCard
