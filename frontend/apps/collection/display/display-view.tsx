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

const EthernalCollectionContainer = styled.div`
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

export const DisplayVieww = ({ collectionItems }: { collectionItems: CollectionWithUIMetada }) => {
    const [pixelTilesFilter, setPixelTilesFilter] = useState('adventurers')
    const [artType, setArtType] = useState({
        "pxlTs": "splashArt",
        "gmas": "splashArt",
        "advTln": "splashArt",
    })

    const dimensionsMap = {
        "pxlTs": {
            "splashArt": { height: 7,  width: 6 },
            "miniature": { height: 7,  width: 4.5 },
        },
        "gmas": {
            "splashArt": { height: 8,  width: 8 },
            "miniature": { height: 8,width: 6.4 }
        },
        "advTln": {
            "splashArt": { height: 8,  width: 6 },
            "miniature": { height: 8,  width: 6 }
        }
    }

    const [imageDimensions, setImageDimensions] = useState({
        "pxlTs": dimensionsMap["pxlTs"]["splashArt"],
        "gmas": dimensionsMap["gmas"]["splashArt"],
        "advTln": dimensionsMap["advTln"]["splashArt"],
    })

    const getArtSource = (coll: "pxlTs" | "gmas" | "advTln", src: {splashArt: string, miniature: string}) => {
        if (artType[coll] === 'splashArt') return src.splashArt
        else return src.miniature
    }

    const handleArtTypeChange = (coll: "pxlTs" | "gmas" | "advTln") => {
        const newArtType = artType[coll] === "splashArt" ? "miniature" : "splashArt";
        setArtType({...artType, [coll]: newArtType})
        setImageDimensions({...imageDimensions, [coll]: dimensionsMap[coll][newArtType]})
    }

    return (
    <CardContainer>
        <EthernalCollectionContainer>
            <Header>
                <ButtonContainer>
                    <button onClick={() => handleArtTypeChange("pxlTs")}>{artType.pxlTs}</button>
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
                        <PixelArtImage src={getArtSource("pxlTs", src)} alt={"Art image"} height={imageDimensions.pxlTs.height} width={ src.class === "furniture" && artType.pxlTs === "miniature" ? imageDimensions.pxlTs.width * 1.5 : imageDimensions.pxlTs.width}/>
                        <CollectibleInfo>
                            <p>{src.name}</p>
                            <p>Class: {src.class}</p>
                            <>{src.class === "furniture" ? <></> : <p>APS: {src.aps.join(', ')}</p>}</>
                        </CollectibleInfo>
                    </CollectibleContainer>
                </div>
                )
            })}
        </EthernalCollectionContainer>
        <EthernalCollectionContainer>
            <Header>
                <ButtonContainer>
                    <button onClick={() => handleArtTypeChange("gmas")}>{artType.gmas}</button>
                </ButtonContainer>
                <Title>Grand Master Adventurers</Title>
            </Header>
            {collectionItems.grandMasterAdventurers.map((src, index) => {
                return (
                <div key={index}>
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource("gmas", src)} alt={"Art image"} height={imageDimensions.gmas.height} width={imageDimensions.gmas.width}/>
                        <CollectibleInfo>
                            <p>{src.name}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                </div>
                )
            })}
        </EthernalCollectionContainer>
        <EthernalCollectionContainer>
            <Header>
                <ButtonContainer>
                    <button onClick={() =>  handleArtTypeChange("advTln")}>{artType.advTln}</button>
                </ButtonContainer>
                <Title>Adventurers Of Thiolden</Title>
            </Header>
            {collectionItems.adventurersOfThiolden.map((src, index) => {
                if (artType.advTln == "splashArt" && isVideoFile(src.splashArt)) {
                    return (
                    <CollectibleContainer key={index}>
                        <Video src={src.splashArt} height={imageDimensions.advTln.height} width={imageDimensions.advTln.width} units={vmax1}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                } else {
                    return (
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource("advTln",src)} alt={"Art image"} height={imageDimensions.advTln.height} width={imageDimensions.advTln.width}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                }
            })}
        </EthernalCollectionContainer>
    </CardContainer>
    )
}

export const DisplayView = ({ collectionItems }: { collectionItems: CollectionWithUIMetada }) => {
    const [artType, setArtType] = useState("splashArt")
    const handleArtTypeChange = () => {
        const newArtType = artType === "splashArt" ? "miniature" : "splashArt"
        setArtType(newArtType)
        setImageDimensions({
            "pxlTs": dimensionsMap["pxlTs"][newArtType],
            "gmas": dimensionsMap["gmas"][newArtType],
            "advTln": dimensionsMap["advTln"][newArtType],
        })
    }
   
    const dimensionsMap = {
        "pxlTs": {
            "splashArt": { height: 7,  width: 6 },
            "miniature": { height: 7,  width: 4.5 },
        },
        "gmas": {
            "splashArt": { height: 8,  width: 8 },
            "miniature": { height: 8,width: 6.4 }
        },
        "advTln": {
            "splashArt": { height: 8,  width: 6 },
            "miniature": { height: 8,  width: 6 }
        }
    }
    const getArtSource = ( src: {splashArt: string, miniature: string}) => {
        if (artType === 'splashArt') return src.splashArt
        else return src.miniature
    }
    const [imageDimensions, setImageDimensions] = useState({
        "pxlTs": dimensionsMap["pxlTs"]["splashArt"],
        "gmas": dimensionsMap["gmas"]["splashArt"],
        "advTln": dimensionsMap["advTln"]["splashArt"],
    })
    return( 
    <EthernalCollectionContainer>
        <Header>
                <ButtonContainer>
                    <button onClick={() =>  handleArtTypeChange()}>{artType}</button>
                </ButtonContainer>
                <Title>Collection</Title>
        </Header>
        {collectionItems.adventurersOfThiolden.map((src, index) => {
                if (artType == "splashArt" && isVideoFile(src.splashArt)) {
                    return (
                    <CollectibleContainer key={index}>
                        <Video src={src.splashArt} height={imageDimensions.advTln.height} width={imageDimensions.advTln.width} units={vmax1}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                } else {
                    return (
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource(src)} alt={"Art image"} height={imageDimensions.advTln.height} width={imageDimensions.advTln.width}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                }
            })}
            {collectionItems.grandMasterAdventurers.map((src, index) => {
                    return (
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource(src)} alt={"Art image"} height={imageDimensions.gmas.height} width={imageDimensions.gmas.width}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
            })}
            {collectionItems.pixelTiles.filter(src => src.class !== 'furniture')
            .map((src, index) => {
                    return (
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource(src)} alt={"Art image"} height={imageDimensions.pxlTs.height} width={imageDimensions.pxlTs.width}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
            })}
            {collectionItems.pixelTiles.filter(src => src.class == 'furniture')
            .map((src, index) => {
                    return (
                    <CollectibleContainer key={index}>
                        <PixelArtImage src={getArtSource(src)} alt={"Art image"} height={imageDimensions.pxlTs.height} width={imageDimensions.pxlTs.width}/>
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
            })}
    </EthernalCollectionContainer>
    )
}