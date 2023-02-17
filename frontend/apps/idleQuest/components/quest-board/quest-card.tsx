import styled, { keyframes } from "styled-components"
import { useEffect, useMemo, useRef } from "react"
import Signature from "./signature"
import { notEmpty } from "../../../utils"
import AdventurerSlot from "./adventurer-slot"
import { APS, zeroAPS, sameOrBetterAPS, SelectedQuest, questSeal, Adventurer, 
         takenQuestSecondsLeft, getQuestAPSRequirement, mergeAPSSum, questName, 
         questDescription, 
         mapSealImage} from "../../dsl"
import { PixelArtCss, PixelArtImage, Push, vh1 } from "../../utils"

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
    ${PixelArtCss}
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
    font-family: VT323;
    font-size: 3.5vh;
    font-weight: 900;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
`

const Details = styled.p`
    width: 100%;
    font-family: VT323;
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

interface QuestPaperTakenState {
    signatureType: "in-progress" | "finished" | "available-no-adventurers" | "available"
    apsRequired: APS
    apsAccumulated: APS
    sealImage: { src: string, width: number, height: number, offset: number }
}

const useQuestCardState = (quest: SelectedQuest, adventurerSlots: (Adventurer | null)[]): QuestPaperTakenState => 
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
    onUnselectAdventurer?: (adventurer: Adventurer) => void,
}

const QuestCard = ({ className, quest, adventurerSlots, onSign, onUnselectAdventurer }: QuestPaperAvailableProps) => {
    if (!quest) return <></>
    const state = useQuestCardState(quest, adventurerSlots)
    return (
        <QuestCardContainer className={className}>
            <QuestInfo>
                <QuestInfoLeft>
                    <Title>{questName(quest)}</Title>
                    <Details dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                    <Push />
                    <AdventurersWrapper>
                        {adventurerSlots.map((adventurer, index) =>
                            <AdventurerSlot
                                key={"adventurer-slot-" + index}
                                adventurer={adventurer}
                                onUnselectAdventurer={quest?.ctype === "available-quest" ? onUnselectAdventurer : undefined}
                            />
                        )}
                    </AdventurersWrapper>
                </QuestInfoLeft>

                <QuestInfoRight>
                    <PixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                        alt="quest monster"
                        width={20} height={20}
                        units={vh1}
                    />
                    <APSReq apsAccumulated={state.apsAccumulated} apsRequired={state.apsRequired} />
                </QuestInfoRight>
            </QuestInfo>

            <Footer>
                <Signature
                    signatureType={state.signatureType}
                    onClick={() => notEmpty(quest) && notEmpty(onSign) && onSign(quest, adventurerSlots.filter(notEmpty))}
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

export default QuestCard
