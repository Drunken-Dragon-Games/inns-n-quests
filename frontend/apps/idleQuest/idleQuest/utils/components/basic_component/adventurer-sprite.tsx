import styled from "styled-components"
import { useComputeHeightFromOriginalImage } from "../../../apps/console/hooks"
import { Adventurer } from "../../../../dsl/models"
import { CrispPixelArtImage } from "../../../../../utils"

export type SpriteRenderOptions = "normal" | "questing" | "selected" | "dead" | "hovered"

const renderOptionsFilters = (render: SpriteRenderOptions) => {
    switch (render) {
        case "questing":
            return "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
        case "selected":
            return "filter: sepia; /* IE6-9 */ -webkit-filter: sepia(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: sepia(1);"
        case "dead":
            return "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
        case "hovered":
            return `
                @-webkit-keyframes bounce { 
                    0%, 20%, 50%, 80%, 100% {-webkit-transform: translateY(0);} 
                    40% {-webkit-transform: translateY(-15px);} 
                    60% {-webkit-transform: translateY(-5px);} 
                } 
                
                @keyframes bounce { 
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
                    40% {transform: translateY(-15px);} 
                    60% {transform: translateY(-5px);} 
                }
                
                -webkit-animation-name: bounce; 
                animation-name: bounce; 
                -webkit-animation-duration: 0.5s;
                animation-duration: 0.5s; 
                -webkit-animation-fill-mode: both; 
                animation-fill-mode: both;
                overflow: visible; 
            `
        default:
            return ""
    }
}

const AdventurerSpriteContainer = styled.div<{ height: number, width: number, render: SpriteRenderOptions }>`
    position: relative;
    width: ${props => props.width + 0.2}vw;
    height: ${props => props.height}vw;
    ${props => renderOptionsFilters(props.render)}
`

const adventurerOfThioldenCustomWidth = (adventurer: Adventurer): number => {
    const advName = adventurer.sprite.split('/')[5].split('-')[0]
    if(advName == "drignir" || advName == "arne" || advName == "aztuneio" || advName == "vimtyr")
        return 5.5
    else if (advName == 'ilinmyr')
        return 8.5
    else if (advName == 'aragren' || advName == 'bodica' || advName == 'kilia' || advName == 'rando')
        return 4.3
    else if (advName == 'vale' || advName == 'naya')
        return 5.7
    else if (advName == 'mili')
        return 3.7
    else if (advName == 'filgrald' || advName == 'gadrull' || advName == 'gulnim' || advName == 'rundir' || advName == 'thelas')
        return 4.6
    else if (advName == 'volggan' || advName == 'marlanye' || advName == 'friga' || advName == 'astrid' || advName == 'tyr' || advName == 'ulf')
        return 3.5
    else if (advName == 'mey' || advName == 'delthamar'  || advName == "ude'namvar" || advName == 'vadanna'|| advName == "avva_fire" )
        return 4.1
    else if (advName == 'milnim'  || advName == 'terrorhertz'  || advName == "arun'na" )
        return 4.5
    else if (advName == 'marendil')
        return 6.1
    else if (advName == 'shaden' || advName == 'ferra')
        return 3.8
    else if (advName == 'syonir' || advName == 'fjolnaer')
        return 6.2
    else if (advName == 'lyskyr')
        return 5.4
    else if (advName == 'perneli' || advName == 'eify')
        return 3.9
    else if (advName == 'abbelka')
        return 5.7
    else if (advName == 'aumara')
        return 4.4
    else if (advName == 'mare' || advName == 'bo')
        return 5.1
    else if (advName == 'dethiol')
        return 8.5
    else if (advName == 'haakon')
        return 5
    else if (advName == 'avva_ice')
        return 4.2
    else if (advName == 'hilana')
        return 5.6
    else if (advName == 'rei')
        return 4.8
    else if (advName == 'othil')
        return 3.6
    else if (advName == 'arin')
        return 5.3
    else if (advName == 'aki')
        return 5.5
    else 
        return 5.5
}

const grandmasterAdventurerCustomWidth = (adventurer: Adventurer): number => {
    if (adventurer.class == "bard")
        return 6.8
    else 
        return 6.5
}

interface AdventurerSpriteProps {
    className?: string
    adventurer: Adventurer
    render: SpriteRenderOptions
    scale?: number
}

const AdventurerSprite = ({className, adventurer, render = "normal", scale = 1} : AdventurerSpriteProps) => {
    if (adventurer.collection == "pixel-tiles") {
        const width = 4.3 * scale
        const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
        return (
            <AdventurerSpriteContainer className={className} height={height} width={width} render={render}>
                <CrispPixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} layout="fill" />
            </AdventurerSpriteContainer>
        )
    } else if (adventurer.collection == "grandmaster-adventurers") {
        const width = grandmasterAdventurerCustomWidth(adventurer) * scale
        const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
        return (
            <AdventurerSpriteContainer className={className} height={height} width={width} render={render}>
                <CrispPixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} layout="fill" />
            </AdventurerSpriteContainer>
        )
    } else if (adventurer.collection == "adventurers-of-thiolden") {
        const width = adventurerOfThioldenCustomWidth(adventurer) * 1.2 * scale
        const height = useComputeHeightFromOriginalImage(adventurer.sprite, width)
        return (
            <AdventurerSpriteContainer className={className} height={height} width={width} render={render}>
                <CrispPixelArtImage src={adventurer.sprite} alt={adventurer.assetRef} layout="fill" />
            </AdventurerSpriteContainer>
        )
    } else return <></>
}

export default AdventurerSprite