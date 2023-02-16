import styled from "styled-components"
import { NoDragImage, PixelArtImage } from "../../../utils"
import { Adventurer } from "../../dsl"
import { useComputeHeightFromOriginalImage } from "../../utils"

const AdventurerSplashArtContainer = styled.div`
    filter: drop-shadow(0px 0px 1vmax rgba(0, 0, 0, 0.8));
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

const AdventurerSplashArt = ({ adventurer, scale = 1 }: { adventurer: Adventurer, scale?: number }) => {
    const baseWidth = 30
    const src = mapImageSrc(adventurer)
    const height = useComputeHeightFromOriginalImage(src, baseWidth)
    return (
        <AdventurerSplashArtContainer>
            { adventurer.collection === "adventurers-of-thiolden" ?
            <NoDragImage
                src={src}
                alt="adventurer splashart"
                width={baseWidth * scale} height={height * scale}
            /> :
            <PixelArtImage
                src={src}
                alt="adventurer splashart"
                width={baseWidth * scale} height={height * scale}
            /> }
        </AdventurerSplashArtContainer>
    )
}

export default AdventurerSplashArt