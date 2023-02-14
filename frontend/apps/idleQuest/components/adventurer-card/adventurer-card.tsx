import styled, { keyframes } from "styled-components"
import { PixelArtImage, notEmpty } from "../../../utils"
import { TextOswald } from "../../../utils/components/basic_components"
import { Adventurer } from "../../dsl"
import AdventurerSprite, { SpriteRenderOptions } from "./adventurer-sprite"

type ExperienceBarColor = "r" | "g" | "b"

const rgbMapping = (color: ExperienceBarColor, background: boolean) => {
    if (color == "r" && background) return "rgb(255, 170, 170)"
    if (color == "r" && !background) return "rgb(255, 80, 80)"
    if (color == "g" && background) return "rgb(200, 200, 200)"
    if (color == "g" && !background) return "rgb(80, 180, 80)"
    if (color == "b" && background) return "rgb(150, 150, 255)"
    if (color == "b" && !background) return "rgb(80, 80, 255)"
}

const AdventurerContainer = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const InfoWrapper = styled.div`
    margin-top: 0.5vmax;
    width: inherit;
`

const NameTitle = styled.div<{ $display: boolean }>`
    font-weight: bold;
    text-transform: uppercase;
    display: ${props => props.$display ? "block" : "none"};
`

const AdventurerSpriteWrapper = styled.div`
    display: flex;
    height: 100%;
`

const APSWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const ExperienceAnimation = (experience: number) => keyframes`
    0% {width: 0%;}
    100% {width: ${experience}%;}
`

const ExperienceBar = styled.div<{ $display: boolean, color: ExperienceBarColor }>`
    overflow: visible;
    flex: 1;
    height: 0.3vmax;
    background-color: ${props => rgbMapping(props.color, true)}};
    display: ${props => props.$display ? "block" : "none"};
`

const Experience = styled.div<{ experience: number, animate: boolean, color: ExperienceBarColor }>`
    height: inherit;
    overflow: visible;
    background-color: ${props => rgbMapping(props.color, false)};
    width: ${props => props.experience}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.experience) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vmax rgba(0, 0, 0, 0.5));
    span {
        filter: drop-shadow(0px 0px 0.2vmax ${props => rgbMapping(props.color, false)});
        font-family: Oswald;
        position: absolute;
        display: block;
        overflow: visible;
        padding: 0;
        margin: -1vmax 0 0 0.5vmax;
        font-size: 1vmax;
        font-weight: bold;
        color: ${props => rgbMapping(props.color, true)};
    }
`

const MedalWrapper = styled.div<{ $display: boolean }>`
    position: absolute;
    background-color: #ca9a3a;
    width: 2vmax;
    height: 2vmax;
    border-radius: 50%;
    z-index: 3;
    display: ${props => props.$display ? "flex" : "none"};
    justify-content: center;
    align-items: center;
`

const Medal = styled.span`
    color: white;
    font-family: arial;
    font-size: 0.9vmax;
`

const DeadMarkAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
    40% {transform: translateY(-15px);} 
    60% {transform: translateY(-5px);} 
    0% {opacity: 0;}
    50% {opacity: 1;}
`

const DeadMark = styled.div <{ $display: boolean }>`
    position: absolute;
    top: 3vmax;
    left: 0.5vmax;
    width: 5vmax;
    height: 4vmax;
    z-index: 2;
    animation: ${DeadMarkAnimation} 1.2s;
    ${props => props.$display ? "" : "display: none;"}
`

interface AdventurerProps {
    adventurer: Adventurer,
    emoji?: string,
    render?: SpriteRenderOptions,
    displayDeadMark?: boolean,
    displayAPS?: boolean,
    animateAPS?: boolean,
    medalNumber?: number,
    displayNameColor?: string,
}

const AdventurerCard = ({ 
    adventurer, 
    emoji, 
    render = "normal", 
    displayDeadMark = false, 
    displayAPS = false, 
    animateAPS = true, 
    medalNumber,
    displayNameColor// = "rgb(121, 51, 18)",
}: AdventurerProps) =>
    <AdventurerContainer>

        <DeadMark $display={displayDeadMark} >
            <PixelArtImage 
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_mark_fail.png" 
                alt="fail mark image" 
            />
        </DeadMark>

        <MedalWrapper $display={notEmpty(medalNumber)}>
            <Medal>{medalNumber}</Medal>
        </MedalWrapper>

        <AdventurerSpriteWrapper>
            <AdventurerSprite
                adventurer={adventurer}
                render={render}
                emoji={emoji}
            />
        </AdventurerSpriteWrapper>

        <InfoWrapper>
            <NameTitle $display={notEmpty(displayNameColor)}>
                <TextOswald fontsize={0.8} color={displayNameColor ?? "white"}>{adventurer.name}</TextOswald>
            </NameTitle>
            <APSWrapper>
                <ExperienceBar $display={displayAPS} color="r" key="ath">
                    <Experience experience={adventurer.athleticism * 100 / 10} animate={animateAPS} color="r">
                        <span>{adventurer.athleticism}</span>
                    </Experience>
                </ExperienceBar>
                <ExperienceBar $display={displayAPS} color="b" key="int">
                    <Experience experience={adventurer.intellect * 100 / 10} animate={animateAPS} color="b">
                        <span>{adventurer.intellect}</span>
                    </Experience>
                </ExperienceBar>
                <ExperienceBar $display={displayAPS} color="g" key="cha">
                    <Experience experience={adventurer.charisma * 100 / 10} animate={animateAPS} color="g">
                        <span>{adventurer.charisma}</span>
                    </Experience>
                </ExperienceBar>
            </APSWrapper>
        </InfoWrapper>

    </AdventurerContainer>

export default AdventurerCard