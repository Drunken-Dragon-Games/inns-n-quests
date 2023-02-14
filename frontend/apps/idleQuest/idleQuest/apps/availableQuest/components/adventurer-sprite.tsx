import styled, { keyframes } from "styled-components"
import { Adventurer } from "../../../../dsl/models"
import { PixelArtImage, notEmpty, simpleHash } from "../../../../../utils"
import { useEffect, useRef, useState } from "react"

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
        return [5.5, -2.2] 
    else if (advName == 'ilinmyr')
        return [8.5, -2.2]
    else if (advName == 'aragren' || advName == 'bodica' || advName == 'kilia' || advName == 'rando')
        return [4.3, -2.2] 
    else if (advName == 'vale')
        return [5.7, -2.2] 
    else if (advName == 'naya')
        return [5.8, -2.2]
    else if (advName == 'mili')
        return [3.7, -2.2] 
    else if (advName == 'filgrald' || advName == 'gadrull' || advName == 'gulnim' || advName == 'rundir' || advName == 'thelas')
        return [4.6, -2.2] 
    else if (advName == 'volggan')
        return [4.3, -2.2] 
    else if (advName == 'marlanye' || advName == 'friga' || advName == 'astrid' || advName == 'tyr' || advName == 'ulf')
        return [4.1, -2.2] 
    else if (advName == 'mey' || advName == 'delthamar'  || advName == "ude'namvar" || advName == 'vadanna'|| advName == "avva_fire" )
        return [4.1, -2.2] 
    else if (advName == 'milnim'  || advName == 'terrorhertz'  || advName == "arun'na" )
        return [4.5, -2.2] 
    else if (advName == 'marendil')
        return [6.1, -2.2] 
    else if (advName == 'shaden' || advName == 'ferra')
        return [3.8, -2.2] 
    else if (advName == 'syonir' || advName == 'fjolnaer')
        return [6.2, -2.2] 
    else if (advName == 'lyskyr')
        return [5.4, -2.2] 
    else if (advName == 'perneli' || advName == 'eify')
        return [4.5, -2.2] 
    else if (advName == 'abbelka')
        return [5.7, -2.2] 
    else if (advName == 'aumara')
        return [5.1, -2.2] 
    else if (advName == 'mare' || advName == 'bo')
        return [5.1, -2.2] 
    else if (advName == 'dethiol')
        return [10, -2.2] 
    else if (advName == 'haakon')
        return [5, -2.2] 
    else if (advName == 'avva_ice')
        return [4.2, -2.2] 
    else if (advName == 'hilana')
        return [5.6, -2.2] 
    else if (advName == 'rei')
        return [4.8, -2.2] 
    else if (advName == 'othil')
        return [3.6, -2.2] 
    else if (advName == 'arin')
        return [5.3, -2.2] 
    else if (advName == 'aki')
        return [5.5, -2.2] 
    else 
        return [5.5, -2.2] 
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

const EmojiContainer = styled.div<{ $display: boolean, offset: number }>`
    position: absolute;
    width: 3.4vmax;
    height: 3.4vmax;
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

const Emoji = ({ emoji, offset }: { emoji?: string, offset: number }) => {
    const lastEmoji = useRef<string | undefined>(undefined)
    const renderEmoji = emoji ?? lastEmoji.current
    useEffect(() => { lastEmoji.current = emoji }, [emoji])
    return notEmpty(renderEmoji) ? 
        <EmojiContainer $display={emoji !== undefined} offset={offset}>
            <EmojiBubble
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/buble_emoji.webp"
                alt="emoji buble"
                width={3.4}
                height={3.4}
                absolute
            />
            <PixelArtImage
                src={emojiMapping(renderEmoji)}
                alt="adventurer emoji"
                width={2.8}
                height={2.5}
            />
        </EmojiContainer>
    : <></>
}

/**
 * Computes the height of an image based on its width and the original image's width and height
 * 
 * @param src The image source
 * @param desiredWidth The intended width of the image
 */
const useComputeHeightFromOriginalImage = (src: string, desiredWidth: number): number => {
    const [desiredHeight, setHeight] = useState<number>(0)
    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            const height = (desiredWidth * img.height) / img.width
            setHeight(Math.round(height * 10) / 10)
        }
    }, [src])
    return desiredHeight
}

interface AdventurerSpriteProps {
    className?: string
    adventurer: Adventurer
    render: SpriteRenderOptions
    scale?: number
    emoji?: string
}

const AdventurerSprite = ({className, adventurer, render = "normal", scale = 1, emoji} : AdventurerSpriteProps) => {
    if (adventurer.collection == "pixel-tiles") {
        const width = 4.6 * scale
        const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
        return (
            <AdventurerSpriteContainer className={className} height={height} width={width} render={render}>
                <Emoji emoji={emoji} offset={-2.5}/>
                <PixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} fill />
            </AdventurerSpriteContainer>
        )
    } else if (adventurer.collection == "grandmaster-adventurers") {
        const offset = grandmasterAdventurerCustomOffer(adventurer)
        const width = 7.7
        const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
        return (
            <AdventurerSpriteContainer className={className} height={height} width={width} render={render}>
                <Emoji emoji={emoji} offset={offset} />
                <PixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} fill />
            </AdventurerSpriteContainer>
        )
    } else if (adventurer.collection == "adventurers-of-thiolden") {
        const [width1, emojiOffset] = adventurerOfThioldenCustomWidthAndOffset(adventurer)
        const width = width1 * 1.2 * scale
        const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
        return (
            <AdventurerSpriteContainer className={className} height={height} width={width} render={render}>
                <Emoji emoji={emoji} offset={emojiOffset} />
                <PixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} fill />
            </AdventurerSpriteContainer>
        )
    } else return <></>
}

export default AdventurerSprite