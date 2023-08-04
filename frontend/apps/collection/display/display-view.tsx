import styled from "styled-components"
import { CollectionWithUIMetada } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
import { useState } from "react"

const EthernalCollectionContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`
const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: span 3;
`;

const Title = styled.h2`
    color: #fff;
    text-align: center;
    grid-column: span 3;
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

const MirroredPixelArtImage = styled(PixelArtImage)<{ isFlipped: boolean }>`
  transform: ${props => props.isFlipped ? 'scaleX(-1)' : 'none'};
`;


const isVideoFile = (src: string): boolean => {
    return src.endsWith('.mp4')
}

const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
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
            "splashArt": { height: 10.5,  width: 9 },
            "miniature": { height: 10.5,  width: 6.75 },
        },
        "gmas": {
            "splashArt": { height: 12,  width: 12 },
            "miniature": { height: 12,width: 9.6 }
        },
        "advTln": {
            "splashArt": { height: 12,  width: 9 },
            "miniature": { height: 12,  width: 9 }
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
                            <p>Active: {src.mortalRealmsActive}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                } else {
                    return (
                    <CollectibleContainer key={index}>
                        <MirroredPixelArtImage 
                            src={getArtSource(src)} 
                            alt={src.name} 
                            height={imageDimensions.advTln.height} 
                            width={imageDimensions.advTln.width} 
                            isFlipped={artType === 'miniature'}
                        />
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Active: {src.mortalRealmsActive}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
                }
            })}
            {collectionItems.grandMasterAdventurers.map((src, index) => {
                    return (
                    <CollectibleContainer key={index}>
                        <MirroredPixelArtImage 
                            src={getArtSource(src)} 
                            alt={src.name} 
                            height={imageDimensions.gmas.height} 
                            width={imageDimensions.gmas.width} 
                            isFlipped={artType === 'miniature'}
                        />
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Active: {src.mortalRealmsActive}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
            })}
            {collectionItems.pixelTiles.filter(src => src.class !== 'furniture')
            .map((src, index) => {
                    return (
                    <CollectibleContainer key={index}>
                       <MirroredPixelArtImage 
                            src={getArtSource(src)} 
                            alt={src.name} 
                            height={imageDimensions.pxlTs.height} 
                            width={imageDimensions.pxlTs.width} 
                            isFlipped={artType === 'miniature'}
                        />
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Quantity: {src.quantity}</p>
                            <p>Active: {src.mortalRealmsActive}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
            })}
            {collectionItems.pixelTiles.filter(src => src.class == 'furniture')
            .map((src, index) => {
                    return (
                    <CollectibleContainer key={index}>
                        <MirroredPixelArtImage 
                            src={getArtSource(src)} 
                            alt={src.name} 
                            height={imageDimensions.pxlTs.height} 
                            width={imageDimensions.pxlTs.width * (artType === 'splashArt' ? 1 : 1.5)} 
                            isFlipped={artType === 'miniature'}
                        />
                        <CollectibleInfo>
                            <p>{capitalizeFirstLetter(src.name)}</p>
                            <p>Class: {src.class}</p>
                            <p>APS: {src.aps.join(', ')}</p>
                            <p>Quantity: {src.quantity}</p>
                            <p>Active: {src.mortalRealmsActive}</p>
                        </CollectibleInfo>
                    </CollectibleContainer>
                    )
            })}
    </EthernalCollectionContainer>
    )
}