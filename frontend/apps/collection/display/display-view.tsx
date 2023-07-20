import styled from "styled-components"
import { CollectionWithUIMetada } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
const CardContainer = styled.div`
    width: 100%;
    padding: 5vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media only screen and (max-width: 1400px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

const isVideoFile = (src: string): boolean => {
    return src.endsWith('.mp4')
}

export const DisplayView = ({ collectionItems }: { collectionItems: CollectionWithUIMetada }) => {
    return <CardContainer>
    {collectionItems.pixelTiles.map((src, index) => {
        if (isVideoFile(src.splashArt)) {
            return (
                <Video 
                    key={index}
                    src={src.splashArt}
                    height={5}
                    width={5}
                    units={vmax1}
                />
            )
        } else {
            return (
                <PixelArtImage
                    key={index}
                    src={src.splashArt}
                    alt={"Art image"}
                    height={5}
                    width={5}
                />
            )
        }
    })}
    </CardContainer>
    }
    