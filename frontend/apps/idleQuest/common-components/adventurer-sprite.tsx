import { useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { Adventurer } from "../dsl/adventurer"
import {
    notEmpty, PixelArtImage, simpleHash, Units,
    useComputeHeightFromOriginalImage, useRememberLastValue, vmax1
} from "../utils"
import { If } from "./helper-components"

const ptMeasures = (adventurer: Adventurer): [number, [number,number], number] => {
    if (adventurer.assetRef === "PixelTile42")
        return [5, [0,0], -4]
    else 
        return [5, [0,0], -7]
}

const gmasMeasures = (adventurer: Adventurer): [number, [number,number], number] => {
    if (adventurer.class == "bard")
        return [8.5, [0,0.3], -6]
    else if (adventurer.class == "rogue")
        return [8.5, [0,0.3], -6.5]
    else if (adventurer.class == "warlock")
        return [8.5, [0,0.3], -6.8]
    else if (adventurer.class == "fighter")
        return [8.5, [0,0.3], -6.5]
    else if (adventurer.class == "knight")
        return [8.5, [0,0.3], -7]
    else if (adventurer.class == "cleric")
        return [8.5, [0,0.3], -9]
    else
        return [8.5, [0,0.3], -7.5]
}

const aotMeasures = (adventurer: Adventurer): [number, [number,number], number] => {
    const advName = adventurer.sprite.split('/')[5].split('-')[0]
    
    // Vilnay
    if (advName == 'astrid')
        return [5, [0,0], -7] 
    else if (advName == 'vadanna')
        return [6.5, [0,1], -7] 
    else if (advName == 'marlanye')
        return [5, [0,0], -7] 
    else if (advName == 'volggan')
        return [5, [0,0], -6] 
    else if (advName == 'aragren')
        return [6.2, [0,-0.2], -6] 
    else if(advName == "arne")
        return [8.5, [0,1], -7.5] 
    else if (advName == 'friga')
        return [5.2, [0,-0.2], -7] 
    else if (advName == 'kilia')
        return [6.3, [0,1], -7] 
    else if (advName == 'hilana')
        return [8, [0,-0.8], -7] 
    else if (advName == 'perneli')
        return [5.6, [0,0.1], -7] 
    else if (advName == 'eify')
        return [5.5, [0,0.4], -7.5] 
    else if (advName == 'bo')
        return [7.2, [0,0.5], -7.5] 
    else if (advName == 'lyskyr')
        return [7.8, [0,0.6], -7.5] 
    else if (advName == 'abbelka')
        return [8.2, [0,1], -7] 
    else if (advName == 'ilinmyr')
        return [12.4, [0,0.4], -8]
    else if (advName == 'gadrull')
        return [6.8, [0,-1.6], -7] 
    else if (advName == 'filgrald')
        return [6.8, [0,-1.7], -7.5] 
    else if (advName == 'mey')
        return [6.2, [0,-0.5], -7] 
    else if (advName == "arun'na" )
        return [6.3, [0,-0.4], -7] 
    else if (advName == 'ferra')
        return [5.8, [0,-0.8], -7] 
    else if (advName == 'fjolnaer')
        return [9.2, [0,-0.2], -7.5] 

    // Auristar
    else if (advName == 'avva_ice')
        return [6.5, [0,0], -8] 
    else if (advName == 'avva_fire')
        return [6.5, [0,0.2], -8]
    else if (advName == 'aumara')
        return [6.7, [0,0.2], -7] 
    else if (advName == 'marendil')
        return [9.3, [0,-1], -7.5] 
    else if (advName == 'haakon')
        return [7.4, [0,-1.1], -7.5] 
    else if (advName == 'tyr')
        return [6.2, [0,-0.6], -9] 
    else if (advName == 'ulf')
        return [6.6, [0,0.8], -9] 
    else if (advName == 'othil')
        return [5.5, [0,0], -7] 
    else if (advName == 'vale')
        return [8.2, [0,-1], -6] 
    else if (advName == 'gulnim')
        return [6.8, [0,0], -7] 
    else if (advName == 'milnim')
        return [6.8, [0,-0.2], -7] 
    else if (advName == 'delthamar')
        return [6.2, [0,-1.2], -7] 
    else if (advName == 'naya')
        return [8.2, [0,3.2], -7]
    else if(advName == "drignir")
        return [7.8, [0,-1.3], -7] 
    else if (advName == 'shaden')
        return [5.5, [0,0.5], -7] 

    // Kullmyr
    else if (advName == 'rundir')
        return [6.7, [0,-1.6], -7.5] 
    else if (advName == 'dethiol')
        return [14.2, [0,0.6], -9] 
    else if (advName == 'syonir')
        return [9.1, [0,-1.5], -7] 
    else if (advName == 'mili')
        return [5.5, [0,0.5], -7] 
    else if (advName == 'mare')
        return [7.7, [0,1.3], -7.5] 
    
    // Nurmyr & Jagermyr
    else if (advName == 'bodica')
        return [6.2, [0,1.2], -7.2] 
    else if (advName == "ude'namvar")
        return [6.2, [0,0.2], -7.5] 
    else if (advName == 'rando')
        return [6.3, [0,-0.6], -7] 
    else if(advName == "aztuneio")
        return [8.4, [0,2], -7] 

    // Rare
    else if (advName == 'rei')
        return [7, [0,-2], -7.5] 
    else if (advName == 'thelas')
        return [6.7, [0,-0.5], -7] 
    else if (advName == 'arin')
        return [8, [0,2.2], -7.5] 
    else if (advName == 'aki')
        return [8.5, [0,0.9], -5] 

    else if(advName == "vimtyr")
        return [8.4, [0,-1], -7] 
    else if (advName == 'terrorhertz')
        return [6.6, [0,-1], -7] 

    else 
        return [1, [0,0], 0] 
}

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

export type SpriteRenderOptions = "normal" | "in-challenge" | "selected" | "dead" | "hovered"

const AdventurerSpriteContainer = styled.div<{ dimensions: Dimensions, render: SpriteRenderOptions }>`
    position: relative;
    width: ${props => props.dimensions.units.u(5)};
    height: ${props => props.dimensions.units.u(5)};
    overflow: visible;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;

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

const EnteringEmojiAnimation = (dimensions: Dimensions) => keyframes`
    0% {opacity: 0; margin-top: ${dimensions.units.u(dimensions.offsetEmoji - 1)};}
    100% {opacity: 1; margin-top: ${dimensions.units.u(dimensions.offsetEmoji)};}
`

const LeavingEmojiAnimation = (dimensions: Dimensions) => keyframes`
    0% {opacity: 1; margin-top: ${dimensions.units.u(dimensions.offsetEmoji)}; }
    100% {opacity: 0; margin-top: ${dimensions.units.u(dimensions.offsetEmoji - 1)};}
`

const EmojiContainer = styled.div<{ $display: boolean, dimensions: Dimensions }>`
    position: absolute;
    width: ${props => props.dimensions.units.u(3.4)};
    height: ${props => props.dimensions.units.u(3.4)};
    z-index: 10;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    margin-top: ${props => props.dimensions.units.u(props.dimensions.offsetEmoji)};
    opacity: ${props => props.$display ? 1 : 0};
    animation ${props => props.$display ? EnteringEmojiAnimation(props.dimensions) : LeavingEmojiAnimation(props.dimensions)} 1s;
`

const EmojiBubble = styled(PixelArtImage)`
    padding-top: 0.3vmax;
`
const EmojiImage = ({ emoji, dimensions }: { emoji?: string, dimensions: Dimensions }) => {
    const lastEmoji = useRememberLastValue(emoji, undefined)
    const renderEmoji = emoji ?? lastEmoji
    return (
        <If $if={notEmpty(renderEmoji)}>
            <EmojiContainer $display={notEmpty(emoji)} dimensions={dimensions}>
                <EmojiBubble
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/buble_emoji.webp"
                    alt="emoji buble"
                    width={3.4}
                    height={3.4}
                    units={dimensions.units}
                    absolute
                />
                <PixelArtImage
                    src={emojiMapping(renderEmoji)}
                    alt="adventurer emoji"
                    width={2.8}
                    height={2.5}
                    units={dimensions.units}
                />
            </EmojiContainer>
        </If>
    )
}

const AdventurerImageContainer = styled.div<{ dimensions: Dimensions }>`
    position: absolute;
    width: ${props => props.dimensions.units.u(props.dimensions.width)};
    height: ${props => props.dimensions.units.u(props.dimensions.height)};
    overflow: visible;
    margin-top: ${props => props.dimensions.units.u(props.dimensions.offset[0])};
    margin-left: ${props => props.dimensions.units.u(props.dimensions.offset[1])};
`

const AdventurerImage = (props: { adventurer: Adventurer, dimensions: Dimensions }) =>
    <AdventurerImageContainer dimensions={props.dimensions}>
        <PixelArtImage
            src={props.adventurer.sprite}
            alt={props.adventurer.assetRef}
            width={props.dimensions.width}
            height={props.dimensions.height}
            units={props.dimensions.units}
        />
    </AdventurerImageContainer>

interface Dimensions {
    width: number
    height: number
    units: Units
    offset: [number, number]
    offsetEmoji: number
}

const useAdventurerSpriteState = (adventurer: Adventurer, units: Units): Dimensions => {
    const dimensions = useMemo(() => {
        const [width, offset, offsetEmoji] =
            adventurer.collection == "pixel-tiles" ?
                ptMeasures(adventurer) :
            adventurer.collection == "grandmaster-adventurers" ?
                gmasMeasures(adventurer) :
            // adventurer.collection == "adventurers-of-thiolden" ?
                aotMeasures(adventurer)
        return { width, height: 0, units, offset: offset as [number,number], offsetEmoji }
    }, [adventurer, units])
    return {...dimensions, height: useComputeHeightFromOriginalImage(adventurer.sprite, dimensions.width) }
}

interface AdventurerSpriteProps {
    className?: string
    adventurer: Adventurer
    render?: SpriteRenderOptions
    emoji?: string
    units?: Units
}

const AdventurerSprite = ({className, adventurer, render = "normal", emoji, units = vmax1 } : AdventurerSpriteProps) => {
    const dimensions = useAdventurerSpriteState(adventurer, units)
    return (
        <AdventurerSpriteContainer 
            className={className} 
            dimensions={dimensions}
            render={render} >
            <EmojiImage emoji={emoji} dimensions={dimensions} />
            <AdventurerImage adventurer={adventurer} dimensions={dimensions} />
        </AdventurerSpriteContainer>
    )
}

export default AdventurerSprite