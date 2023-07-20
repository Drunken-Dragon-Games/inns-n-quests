import styled from "styled-components"
import { CollectionWithUIMetada } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
import { useState } from "react"
const CardContainer = styled.div`
    width: 100%;
    padding: 5vw;
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const PolicyContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
`
const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: span 4;
`;

const Title = styled.h2`
    color: #fff;
    text-align: center;
    grid-column: span 4;
    margin: 0;
`
const CollectibleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

const CollectibleInfo = styled.div`
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
    text-align: center;
`;

//TODO: use a button form the common components
const ButtonContainer = styled.div`
    display: flex;
    gap: 20px;
`;

const isVideoFile = (src: string): boolean => {
    return src.endsWith('.mp4')
}

const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

export const DisplayView = ({ collectionItems }: { collectionItems: CollectionWithUIMetada }) => {
    const [pixelTilesFilter, setPixelTilesFilter] = useState('adventurers')
    const [artType, setArtType] = useState({
        "pxlTs": "splashArt",
        "gmas": "splashArt",
        "advTln": "splashArt",
    })

    const getArtSource = (coll: "pxlTs" | "gmas" | "advTln", src: {splashArt: string, miniature: string}) => {
        if (artType[coll] === 'splashArt') return src.splashArt
        else return src.miniature
    }

    return (
    <CardContainer>
        <PolicyContainer>
            <Header>
                <ButtonContainer>
                    <button onClick={() => setArtType({...artType, "pxlTs": artType.pxlTs == "splashArt" ? "miniature" : "splashArt" })}>{artType.pxlTs}</button>
                </ButtonContainer>
                <Title>Pixel Tiles</Title>
                <ButtonContainer>
                    <button onClick={() => setPixelTilesFilter('adventurers')}>Adventurers</button>
                    <button onClick={() => setPixelTilesFilter('furniture')}>Furniture</button>
                </ButtonContainer>
            </Header>
            {collectionItems.pixelTiles
            .filter(src => pixelTilesFilter === 'furniture' ? src.class === 'furniture' : src.class !== 'furniture')
            .map((src, index) => {
                return (
                <div key={index}>
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource("pxlTs", src)} alt={"Art image"} height={6} width={5}/>
                        <CollectibleInfo>
                            <p>{src.name}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Class: {src.class}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                </div>
                )
            })}
        </PolicyContainer>
        <PolicyContainer>
            <Header>
                <ButtonContainer>
                    <button onClick={() => setArtType({...artType, "gmas": artType.gmas == "splashArt" ? "miniature" : "splashArt" })}>{artType.gmas}</button>
                </ButtonContainer>
                <Title>Grand Master Adventurers</Title>
            </Header>
            {collectionItems.grandMasterAdventurers.map((src, index) => {
                return (
                <div key={index}>
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource("gmas", src)} alt={"Art image"} height={5} width={5}/>
                        <CollectibleInfo>
                            <p>{src.name}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Class: {src.class}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                </div>
                )
            })}
        </PolicyContainer>
        <PolicyContainer>
            <Header>
                <ButtonContainer>
                    <button onClick={() => setArtType({...artType, "advTln": artType.advTln == "splashArt" ? "miniature" : "splashArt" })}>{artType.advTln}</button>
                </ButtonContainer>
                <Title>Adventurers Of Thiolden</Title>
            </Header>
            {collectionItems.adventurersOfThiolden.map((src, index) => {
                if (artType.advTln == "splashArt" && isVideoFile(src.splashArt)) {
                    return (
                    <CollectibleContainer key={index}>
                        <Video src={src.splashArt} height={6} width={5} units={vmax1}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Class: {src.class}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                } else {
                    return (
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource("advTln",src)} alt={"Art image"} height={6} width={5}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Class: {src.class}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                }
            })}
        </PolicyContainer>
    </CardContainer>
    )
}
    