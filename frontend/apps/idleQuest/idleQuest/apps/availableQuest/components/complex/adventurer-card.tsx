import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { CrispPixelArtImage, notEmpty } from "../../../../../../utils"
import { TextOswald } from "../../../../../../utils/components/basic_components"
import { Adventurer, EmojiName } from "../../../../../dsl"
import { AdventurerSprite } from "../../../../utils/components/basic_component"
import { SpriteRenderOptions } from "../../../../utils/components/basic_component/adventurer-sprite"

const emojiMapping = (emoji?: EmojiName) => {
    switch (emoji) {
        case "over-confident": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/over_confident.webp"
        case "confident": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/confident.webp"
        case "insecure": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/insecure.webp"
        case "fearful": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/fearful.webp"
        case "panicking": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/panicking.webp"
        case "terrified": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/terrified.webp"
        default: return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/close_icon.png"
    }
}

type ExperienceBarColor = "r" | "g" | "b"

const rgbMapping = (color: ExperienceBarColor, background: boolean) => {
    if (color == "r" && background) return "rgb(255, 150, 150)"
    if (color == "r" && !background) return "rgb(255, 80, 80)"
    if (color == "g" && background) return "rgb(150, 255, 150)"
    if (color == "g" && !background) return "rgb(80, 255, 80)"
    if (color == "b" && background) return "rgb(150, 150, 255)"
    if (color == "b" && !background) return "rgb(80, 80, 255)"
}

const InfoWrapper = styled.div`
    position: absolute;
    bottom: -3vh;
    width: inherit;
`

const NameTitle = styled.div<{ display: boolean }>`
    font-weight: bold;
    text-transform: uppercase;
    display: ${props => props.display ? "block" : "none"};
`

const ExperienceAnimation = (experience: number) => keyframes`
    0% {width: 0%;}
    100% {width: ${experience}%;}
`

const ExperienceBar = styled.div<{ display: boolean, color: ExperienceBarColor }>`
    margin-top: 0.1vh;
    width: 100%;
    height: 0.7vh;
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
`

const AdventurerContainer = styled.div`
    position: relative;
    display: flex;
    height: inherit;
    width: inherit;
    flex-direction: column;
    align-items: center;
`

const EnteringEmojiAnimation = keyframes`
    0% {opacity: 0; margin-top: -1vh;}
    100% {opacity: 1}
`

const LeavingEmojiAnimation = keyframes`
    0% {opacity: 1;}
    100% {opacity: 0; margin-top: -3vh;}
`

const EmojiContainer = styled.div<{ display: boolean }>`
    position: absolute;
    margin-top: -2vh;
    z-index: 5;
    width: 1.8vw;
    height: 1.5vw;
    opacity: ${props => props.display ? 1 : 0};
    animation ${props => props.display ? EnteringEmojiAnimation : LeavingEmojiAnimation} 1s;
`

const Emoji = ({ emoji }: { emoji?: EmojiName }) => {
    const [lastEmoji, setLastEmoji] = useState<EmojiName | undefined>(undefined)
    const renderEmoji = emoji ?? lastEmoji
    useEffect(() => { if (emoji) setLastEmoji(emoji) }, [emoji])
    return notEmpty(renderEmoji) ?
        <EmojiContainer display={emoji !== undefined}>
            <CrispPixelArtImage
                src={emojiMapping(renderEmoji)}
                alt="adventurer emoji bubble"
                width={1.8}
                height={1.5}
                layout="responsive"
            />
        </EmojiContainer>
    : <></>
}

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
    margin-top: auto;
`

interface AdventurerProps {
    adventurer: Adventurer,
    emoji?: EmojiName,
    render?: SpriteRenderOptions,
    displayDeadMark?: boolean,
    displayAPS?: boolean,
    animateAPS?: boolean,
    experience?: number,
    displayNameColor?: string,
}

const AdventurerCard = ({ 
    adventurer, 
    emoji, 
    render = "normal", 
    displayDeadMark = false, 
    displayAPS: displayExperienceBar = false, 
    animateAPS: animateExperienceBar = true, 
    experience = 70,
    displayNameColor// = "rgb(121, 51, 18)",
}: AdventurerProps) =>
    <AdventurerContainer>
        <Emoji emoji={emoji} />

        <DeadMark display={displayDeadMark} >
            <CrispPixelArtImage 
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_mark_fail.png" 
                alt="fail mark image" 
                //width={2000} height={1250} 
                layout="fill"
            />
        </DeadMark>

        <StyledAdventurerSprite
            adventurer={adventurer}
            render={render}
        />

        <InfoWrapper> 
            <NameTitle display={displayNameColor !== undefined}>
                <TextOswald fontsize={0.8} color={displayNameColor ?? "white"}>{adventurer.name}</TextOswald>
            </NameTitle>
            <ExperienceBar display={displayExperienceBar} color="r" key="ath">
                <Experience experience={adventurer.athleticism * 100 / 10} animate={animateExperienceBar} color="r" />
            </ExperienceBar>
            <ExperienceBar display={displayExperienceBar} color="b" key="int">
                <Experience experience={adventurer.intellect * 100 / 10} animate={animateExperienceBar} color="b"/>
            </ExperienceBar>
            <ExperienceBar display={displayExperienceBar} color="g" key="cha">
                <Experience experience={adventurer.charisma * 100 / 10} animate={animateExperienceBar} color="g"/>
            </ExperienceBar>
        </InfoWrapper>

    </AdventurerContainer>

export default AdventurerCard