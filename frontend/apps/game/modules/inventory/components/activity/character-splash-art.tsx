import styled from "styled-components"
import { Character, NoDragImage, PixelArtImage, Units, useComputeHeightFromOriginalImage, vh1 } from "../../../../../common"
import * as vm from "../../../../game-vm"

const CharacterSplashArtContainer = styled.div<{ units: Units }>`
    overflow: hidden;
    border-radius: ${({units}) => units.u(1)};
    filter: drop-shadow(0px 0px ${({units}) => units.u(1)} rgba(0, 0, 0, 0.8));
`

const mapImageSrc = (character: Character) => {
    // Temporal until the backend returns the reference to the splash art
    if (character.collection === "adventurers-of-thiolden") {
        // extract with regex any string between "x6/" and ".png"
        const advId = character.sprite.match(/x6\/(.*)\.png/)?.[1]
        const [ advName1, isChromaText ] = advId?.split("-front-") ?? ["abbelka", "plain"]
        const advName = advName1.includes("avva") ? "avva" : advName1
        const isChroma = isChromaText === "plain" ? "0" : "1"
        const fileFormat = isChromaText === "plain" ? "webp" : "mp4"
        const apsSum = vm.apsSum(character.ivAPS)
        return `https://cdn.ddu.gg/adv-of-thiolden/web/${advName}_${apsSum}_${isChroma}.${fileFormat}`
    } else if (character.collection === "grandmaster-adventurers") {
        return `https://cdn.ddu.gg/gmas/xl/${character.assetRef}.gif`
    } else if (character.collection === "pixel-tiles") {
        return `https://www.drunkendragon.games/s1/${character.assetRef}.png`
    } else
        return "https://cdn.ddu.gg/adv-of-thiolden/web/abbelka_10_0.webp"
}

const CharacterSplashArt = ({ character, units = vh1 }: { character: Character, units?: Units }) => {
    const baseWidth = 50
    const src = mapImageSrc(character)
    const height = useComputeHeightFromOriginalImage(src, baseWidth)
    return (
        <CharacterSplashArtContainer units={units}>
            { character.collection === "adventurers-of-thiolden" ?
            <NoDragImage
                src={src}
                alt={ character.name + " splashart" }
                width={baseWidth} height={height}
                units={units}
            /> :
            <PixelArtImage
                src={src}
                alt={ character.name + " splashart" }
                width={baseWidth} height={height}
                units={units}
            /> }
        </CharacterSplashArtContainer>
    )
}

export default CharacterSplashArt