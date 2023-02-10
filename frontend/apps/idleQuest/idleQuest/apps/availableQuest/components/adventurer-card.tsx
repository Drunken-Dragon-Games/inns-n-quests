import styled, { keyframes } from "styled-components"
import { CrispPixelArtImage } from "../../../../../utils"
import { TextOswald } from "../../../../../utils/components/basic_components"
import { Adventurer, EmojiName } from "../../../../dsl"
import { AdventurerSprite } from "../../../utils/components/basic_component"
import { SpriteRenderOptions } from "../../../utils/components/basic_component/adventurer-sprite"

type ExperienceBarColor = "r" | "g" | "b"

const rgbMapping = (color: ExperienceBarColor, background: boolean) => {
    if (color == "r" && background) return "rgb(255, 170, 170)"
    if (color == "r" && !background) return "rgb(255, 80, 80)"
    if (color == "g" && background) return "rgb(200, 200, 200)"
    if (color == "g" && !background) return "rgb(80, 180, 80)"
    if (color == "b" && background) return "rgb(150, 150, 255)"
    if (color == "b" && !background) return "rgb(80, 80, 255)"
}

const InfoWrapper = styled.div`
    margin-top: 0.5vh;
    width: inherit;
`

const NameTitle = styled.div<{ display: boolean }>`
    font-weight: bold;
    text-transform: uppercase;
    display: ${props => props.display ? "block" : "none"};
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

const ExperienceBar = styled.div<{ display: boolean, color: ExperienceBarColor }>`
    margin-top: 0.1vh;
    flex: 1;
    height: 1.2vh;
    overflow: hidden;
    border-radius: 0vw 1vw 0vw 1vw;
    background-color: ${props => rgbMapping(props.color, true)}};
    display: ${props => props.display ? "block" : "none"};
`

const Experience = styled.div<{ experience: number, animate: boolean, color: ExperienceBarColor }>`
    height: inherit;
    border-radius: 0vw 1vw 0vw 1vw;
    background-color: ${props => rgbMapping(props.color, false)};
    width: ${props => props.experience}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.experience) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vh rgba(0, 0, 0, 0.5));
    span {
        filter: drop-shadow(0px 0px 0.2vh ${props => rgbMapping(props.color, false)});
        font-family: Oswald;
        position: absolute;
        display: block;
        padding: 0;
        margin: -0.4vh 0 0 0.4vw;
        font-size: 1.3vh;
        font-weight: bold;
        color: ${props => rgbMapping(props.color, true)};
    }
`

const MedalWrapper = styled.div<{ display: boolean }>`
    position: absolute;
    background-color: #ca9a3a;
    width: 2vw;
    height: 2vw;
    border-radius: 50%;
    z-index: 3;
    display: ${props => props.display ? "flex" : "none"};
    justify-content: center;
    align-items: center;
`

const Medal = styled.span`
    color: white;
    font-family: arial;
    font-size: 0.9vw;
`

const AdventurerContainer = styled.div`
    position: relative;
    display: flex;
    height: inherit;
    width: inherit;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const DeadMarkAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
    40% {transform: translateY(-15px);} 
    60% {transform: translateY(-5px);} 
    0% {opacity: 0;}
    50% {opacity: 1;}
`

const DeadMark = styled.div <{ display: boolean }>`
    position: absolute;
    top: 3vh;
    left: 0.5vw;
    width: 5vw;
    height: 4vh;
    z-index: 2;
    animation: ${DeadMarkAnimation} 1.2s;
    ${props => props.display == true  ? "" : "display: none;"}
`

const StyledAdventurerSprite = styled(AdventurerSprite)`
    position: absolute;
`

const AdventurerWrapper = styled.div`
    width: 100%;
    height: 1px;
    display: flex;
    margin-top: 9vh;
    flex-direction: column;
    align-items: center;
`

interface AdventurerProps {
    adventurer: Adventurer,
    emoji?: EmojiName,
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

        <DeadMark display={displayDeadMark} >
            <CrispPixelArtImage 
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_mark_fail.png" 
                alt="fail mark image" 
                //width={2000} height={1250} 
                layout="fill"
            />
        </DeadMark>

        <MedalWrapper display={medalNumber !== undefined}>
            <Medal>{medalNumber}</Medal>
        </MedalWrapper>

        <AdventurerWrapper>
            <StyledAdventurerSprite
                adventurer={adventurer}
                render={render}
                emoji={emoji}
            />
        </AdventurerWrapper>

        <InfoWrapper>
            <NameTitle display={displayNameColor !== undefined}>
                <TextOswald fontsize={0.8} color={displayNameColor ?? "white"}>{adventurer.name}</TextOswald>
            </NameTitle>
            <APSWrapper>
                <ExperienceBar display={displayAPS} color="r" key="ath">
                    <Experience experience={adventurer.athleticism * 100 / 10} animate={animateAPS} color="r">
                        <span>{adventurer.athleticism}</span>
                    </Experience>
                </ExperienceBar>
                <ExperienceBar display={displayAPS} color="b" key="int">
                    <Experience experience={adventurer.intellect * 100 / 10} animate={animateAPS} color="b">
                        <span>{adventurer.intellect}</span>
                    </Experience>
                </ExperienceBar>
                <ExperienceBar display={displayAPS} color="g" key="cha">
                    <Experience experience={adventurer.charisma * 100 / 10} animate={animateAPS} color="g">
                        <span>{adventurer.charisma}</span>
                    </Experience>
                </ExperienceBar>
            </APSWrapper>
        </InfoWrapper>

    </AdventurerContainer>

export default AdventurerCard