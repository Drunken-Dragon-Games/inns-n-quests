import styled, { keyframes } from "styled-components"
import { TextOswald } from "../../utils/components/basic_components"
import { Adventurer, totalXPRequiredForNextLevel } from "../dsl"
import { Units, vmax1, useRememberLastValue, PixelArtImage, notEmpty } from "../utils"
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
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const InfoWrapper = styled.div<{ units: Units }>`
    margin-top: ${props => props.units.u(0.5)};
    width: inherit;
`

const NameTitle = styled.div<{ $display: boolean }>`
    font-weight: bold;
    text-transform: uppercase;
    display: ${props => props.$display ? "block" : "none"};
`

const APSWrapper = styled.div<{ units: Units }>`
    width: 100%;
    display: flex;
    gap: ${({units}) => units.u(1)};
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ExperienceAnimation = (start: number, experience: number) => keyframes`
    0% {width: ${start}%;}
    100% {width: ${experience}%;}
`

const ExperienceBar = styled.div<{ $display: boolean, color: ExperienceBarColor, units: Units }>`
    width: 100%;
    overflow: visible;
    flex: 1;
    height: ${props => props.units.u(0.3)};
    background-color: ${props => rgbMapping(props.color, true)}};
    display: ${props => props.$display ? "block" : "none"};
`

const Experience = styled.div<{ start: number, experience: number, animate: boolean, color: ExperienceBarColor, units: Units }>`
    height: inherit;
    overflow: visible;
    background-color: ${props => rgbMapping(props.color, false)};
    width: ${props => props.experience}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.experience) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px ${({units}) => units.u(0.2)} rgba(0, 0, 0, 0.5));
    span {
        filter: drop-shadow(0px 0px ${({units}) => units.u(0.2)} ${props => rgbMapping(props.color, false)});
        font-family: Oswald;
        position: absolute;
        display: block;
        overflow: visible;
        padding: 0;
        margin: ${({units}) => units.u(-1)} 0 0 ${({units}) => units.u(0.5)};
        font-size: ${({units}) => units.u(1)};
        font-weight: bold;
        color: ${props => rgbMapping(props.color, true)};
    }
`

const DeadMarkAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
    40% {transform: translateY(-15px);} 
    60% {transform: translateY(-5px);} 
    0% {opacity: 0;}
    50% {opacity: 1;}
`

const DeadMark = styled.div <{ $display: boolean, units: Units }>`
    position: absolute;
    top: ${({units}) => units.u(3)};
    left: ${({units}) => units.u(0.5)};
    width: ${({units}) => units.u(5)};
    height: ${({units}) => units.u(4)};
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
    displayNameColor?: string,
    units?: Units,
}

const AdventurerMini = ({ 
    adventurer, 
    emoji, 
    render = "normal", 
    displayDeadMark = false, 
    displayAPS = false, 
    animateAPS = true, 
    displayNameColor,// = "rgb(121, 51, 18)",
    units = vmax1,
}: AdventurerProps) => {
    const experience: [number,number,number] = [
        adventurer.athXP * 100 / totalXPRequiredForNextLevel(adventurer.realATH),
        adventurer.intXP * 100 / totalXPRequiredForNextLevel(adventurer.realINT),
        adventurer.chaXP * 100 / totalXPRequiredForNextLevel(adventurer.realCHA)
    ]
    const lastExperience = useRememberLastValue<[number, number, number]>(experience, [0,0,0])
    return (
        <AdventurerContainer>

            <DeadMark $display={displayDeadMark} units={units}>
                <PixelArtImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_mark_fail.png"
                    alt="fail mark image"
                />
            </DeadMark>

            <AdventurerSprite
                adventurer={adventurer}
                render={render}
                emoji={emoji}
                units={units}
            />

            <InfoWrapper units={units}>
                <NameTitle $display={notEmpty(displayNameColor)}>
                    <TextOswald fontsize={0.8} color={displayNameColor ?? "white"}>{adventurer.name}</TextOswald>
                </NameTitle>
                <APSWrapper units={units}>
                    <ExperienceBar $display={displayAPS} color="r" key="ath" units={units}>
                        <Experience start={lastExperience[0]} experience={experience[0]} animate={animateAPS} color="r" units={units}>
                            <span>{adventurer.realATH}</span>
                        </Experience>
                    </ExperienceBar>
                    <ExperienceBar $display={displayAPS} color="b" key="int" units={units}>
                        <Experience start={lastExperience[1]} experience={experience[1]} animate={animateAPS} color="b" units={units}>
                            <span>{adventurer.realINT}</span>
                        </Experience>
                    </ExperienceBar>
                    <ExperienceBar $display={displayAPS} color="g" key="cha" units={units}>
                        <Experience start={lastExperience[2]} experience={experience[2]} animate={animateAPS} color="g" units={units}>
                            <span>{adventurer.realCHA}</span>
                        </Experience>
                    </ExperienceBar>
                </APSWrapper>
            </InfoWrapper>
        </AdventurerContainer>
    )
}

export default AdventurerMini