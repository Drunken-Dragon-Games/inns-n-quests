import styled from "styled-components"
import { Adventurer } from "../../dsl"
import { NoDragImage, PixelArtImage, Units, useComputeHeightFromOriginalImage, vh1 } from "../../utils"

const AdventurerSplashArtContainer = styled.div<{ units: Units }>`
    overflow: hidden;
    border-radius: ${({units}) => units.u(1)};
    filter: drop-shadow(0px 0px ${({units}) => units.u(1)} rgba(0, 0, 0, 0.8));
`

const mapImageSrc = (adventurer: Adventurer) => {
    // Temporal until the backend returns the reference to the splash art
    if (adventurer.collection === "adventurers-of-thiolden") {
        // extract with regex any string between "x6/" and ".png"
        const advId = adventurer.sprite.match(/x6\/(.*)\.png/)?.[1]
        const [ advName, isChromaText ] = advId?.split("-front-") ?? ["abbelka", "plain"]
        const isChroma = isChromaText === "plain" ? "0" : "1"
        const fileFormat = isChromaText === "plain" ? "webp" : "mp4"
        const apsSum = adventurer.athleticism + adventurer.intellect + adventurer.charisma
        return `https://cdn.ddu.gg/adv-of-thiolden/web/${advName}_${apsSum}_${isChroma}.${fileFormat}`
    } else if (adventurer.collection === "grandmaster-adventurers") {
        return `https://cdn.ddu.gg/gmas/xl/${adventurer.assetRef}.gif`
    } else if (adventurer.collection === "pixel-tiles") {
        return `https://www.drunkendragon.games/s1/${adventurer.assetRef}.png`
    } else
        return "https://cdn.ddu.gg/adv-of-thiolden/web/abbelka_10_0.webp"
}

const AdventurerSplashArt = ({ adventurer, units = vh1 }: { adventurer: Adventurer, units?: Units }) => {
    const baseWidth = 50
    const src = mapImageSrc(adventurer)
    const height = useComputeHeightFromOriginalImage(src, baseWidth)
    return (
        <AdventurerSplashArtContainer units={units}>
            { adventurer.collection === "adventurers-of-thiolden" ?
            <NoDragImage
                src={src}
                alt={ adventurer.name + " splashart" }
                width={baseWidth} height={height}
                units={units}
            /> :
            <PixelArtImage
                src={src}
                alt={ adventurer.name + " splashart" }
                width={baseWidth} height={height}
                units={units}
            /> }
        </AdventurerSplashArtContainer>
    )
}

export default AdventurerSplashArt