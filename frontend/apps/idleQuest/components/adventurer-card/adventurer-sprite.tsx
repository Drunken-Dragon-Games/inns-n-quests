import styled, { keyframes } from "styled-components"
import { notEmpty, PixelArtImage, simpleHash } from "../../../utils"
import { Adventurer } from "../../dsl/adventurer"
import { useComputeHeightFromOriginalImage, useRememberLastValue } from "../../utils"

const emojiMapping = (emoji?: string) => {
    switch (emoji) {
        case "over-confident": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/over_confident.webp"
        case "confident": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/confident.webp"
        case "insecure": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/insecure.webp"
        case "fearful": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/fearful.webp"
        case "panicking": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/panicking.webp"
        case "terrified": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/terrified.webp"
        case "cross": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/close_icon.png"
        default: return `https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/emoji_${(Math.abs(simpleHash(emoji ?? "") % 6) + 1)}.webp`
    }
}

const adventurerOfThioldenCustomWidthAndOffset = (adventurer: Adventurer): [number, number] => {
    const advName = adventurer.sprite.split('/')[5].split('-')[0]
    if(advName == "drignir" || advName == "arne" || advName == "aztuneio" || advName == "vimtyr")
        return [5.*1.2, -2.2] 
    else if (advName == 'ilinmyr')
        return [8.*1.2, -2.2]
    else if (advName == 'aragren' || advName == 'bodica' || advName == 'kilia' || advName == 'rando')
        return [4.*1.2, -2.2] 
    else if (advName == 'vale')
        return [5.*1.2, -2.2] 
    else if (advName == 'naya')
        return [5.*1.2, -2.2]
    else if (advName == 'mili')
        return [3.*1.2, -2.2] 
    else if (advName == 'filgrald' || advName == 'gadrull' || advName == 'gulnim' || advName == 'rundir' || advName == 'thelas')
        return [4.*1.2, -2.2] 
    else if (advName == 'volggan')
        return [4.*1.2, -2.2] 
    else if (advName == 'marlanye' || advName == 'friga' || advName == 'astrid' || advName == 'tyr' || advName == 'ulf')
        return [4.*1.2, -2.2] 
    else if (advName == 'mey' || advName == 'delthamar'  || advName == "ude'namvar" || advName == 'vadanna'|| advName == "avva_fire" )
        return [4.*1.2, -2.2] 
    else if (advName == 'milnim'  || advName == 'terrorhertz'  || advName == "arun'na" )
        return [4.*1.2, -2.2] 
    else if (advName == 'marendil')
        return [6.*1.2, -2.2] 
    else if (advName == 'shaden' || advName == 'ferra')
        return [3.*1.2, -2.2] 
    else if (advName == 'syonir' || advName == 'fjolnaer')
        return [6.*1.2, -2.2] 
    else if (advName == 'lyskyr')
        return [5.*1.2, -2.2] 
    else if (advName == 'perneli' || advName == 'eify')
        return [4.*1.2, -2.2] 
    else if (advName == 'abbelka')
        return [5.*1.2, -2.2] 
    else if (advName == 'aumara')
        return [5.*1.2, -2.2] 
    else if (advName == 'mare' || advName == 'bo')
        return [5.*1.2, -2.2] 
    else if (advName == 'dethiol')
        return [10*1.2,-2.2] 
    else if (advName == 'haakon')
        return [5*1.2, -2.2] 
    else if (advName == 'avva_ice')
        return [4.*1.2, -2.2] 
    else if (advName == 'hilana')
        return [5.*1.2, -2.2] 
    else if (advName == 'rei')
        return [4.*1.2, -2.2] 
    else if (advName == 'othil')
        return [3.*1.2, -2.2] 
    else if (advName == 'arin')
        return [5.*1.2, -2.2] 
    else if (advName == 'aki')
        return [5.*1.2, -2.2] 
    else 
        return [5.*1.2, -2.2] 
}

const grandmasterAdventurerCustomOffer = (adventurer: Adventurer): number => {
    if (adventurer.class == "bard")
        return 2
    else
        return 0
}

export type SpriteRenderOptions = "normal" | "in-challenge" | "selected" | "dead" | "hovered"

const AdventurerSpriteContainer = styled.div<{ height: number, width: number, render: SpriteRenderOptions }>`
    margin-top: auto;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: ${props => props.width + 0.2}vmax;
    height: ${props => props.height}vmax;

    ${({ render }) => { switch (render) {
        case "in-challenge":
            return "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
        case "selected":
            return "filter: sepia; /* IE6-9 */ -webkit-filter: sepia(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: sepia(1);"
        case "dead":
            return "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
        case "hovered":
            return `
                @-webkit-keyframes hovered-animation {
                    0%, 20%, 50%, 80%, 100% {-webkit-transform: translateY(0);}
                    40% {-webkit-transform: translateY(-15px);}
                    60% {-webkit-transform: translateY(-5px);}
                }
                @keyframes hovered-animation {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-15px);}
                    60% {transform: translateY(-5px);}
                }
                -webkit-animation-name: hovered-animation; 
                animation-name: hovered-animation; 
                -webkit-animation-duration: 0.5s;
                animation-duration: 0.5s; 
                -webkit-animation-fill-mode: both; 
                animation-fill-mode: both;
                overflow: visible; 
                filter: drop-shadow(0px 10px 5px rgba(0,0,0,0.5)); /* IE6-9 */ 
                -webkit-filter: drop-shadow(0px 10px 5px rgba(0,0,0,0.5)); /* Google Chrome, Safari 6+ & Opera 15+ */ 
                filter: drop-shadow(0px 10px 5px rgba(0,0,0,0.5));
            `
        default:
            return ""
    }}}
`

const EnteringEmojiAnimation = keyframes`
    0% {opacity: 0; margin-top: -1vmax;}
    100% {opacity: 1}
`

const LeavingEmojiAnimation = keyframes`
    0% {opacity: 1;}
    100% {opacity: 0; margin-top: -3vmax;}
`

const EmojiContainer = styled.div<{ $display: boolean, offset: number, scale: number }>`
    position: absolute;
    width: ${props => 3.4 * props.scale}vmax;
    height: ${props => 3.4 * props.scale}vmax;
    z-index: 100;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: ${props => props.offset}vmax;
    opacity: ${props => props.$display ? 1 : 0};
    animation ${props => props.$display ? EnteringEmojiAnimation : LeavingEmojiAnimation} 1s;
`

const EmojiBubble = styled(PixelArtImage)`padding-top: 0.3vmax;`

const Emoji = ({ emoji, offset, scale }: { emoji?: string, offset: number, scale: number }) => {
    const lastEmoji = useRememberLastValue(emoji, undefined)
    const renderEmoji = emoji ?? lastEmoji
    return notEmpty(renderEmoji) ? 
        <EmojiContainer $display={emoji !== undefined} offset={offset} scale={scale}>
            <EmojiBubble
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/buble_emoji.webp"
                alt="emoji buble"
                width={3.4 * scale}
                height={3.4 * scale}
                absolute
            />
            <PixelArtImage
                src={emojiMapping(renderEmoji)}
                alt="adventurer emoji"
                width={2.8 * scale}
                height={2.5 * scale}
            />
        </EmojiContainer>
    : <></>
}

interface AdventurerSpriteProps {
    className?: string
    adventurer: Adventurer
    render?: SpriteRenderOptions
    scale?: number
    emoji?: string
}

const AdventurerSprite = ({className, adventurer, render = "normal", scale = 1, emoji} : AdventurerSpriteProps) => {
    const [width, offset] =
        adventurer.collection == "pixel-tiles" ? 
            [4.6, -2.5] :
        adventurer.collection == "grandmaster-adventurers" ? 
            [7.7, grandmasterAdventurerCustomOffer(adventurer)] :
        // adventurer.collection == "adventurers-of-thiolden" ?
            adventurerOfThioldenCustomWidthAndOffset(adventurer)
    const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
    return (
        <AdventurerSpriteContainer className={className} height={height * scale} width={width * scale} render={render}>
            <Emoji emoji={emoji} offset={offset} scale={scale} />
            <PixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} fill />
        </AdventurerSpriteContainer>
    )
}

export default AdventurerSprite