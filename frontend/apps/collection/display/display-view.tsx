import styled from "styled-components"
import { CollectionWithUIMetada, UICollectible } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"

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

const modifyMortalCollection = (assetRef: string, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers") => {
    collectionTransitions.modifyMortalCollection(assetRef, action, policy)
}

type RenderCollectible = { 
    src: UICollectible, 
    imageDimensions: any, 
    type: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers", 
    isVideo?: boolean, 
    artType: string
}

export const Collectible = ({ src, imageDimensions, type, isVideo, artType }: RenderCollectible) => {
    const getArtSource = ( src: {splashArt: string, miniature: string}) => {
        if (artType === 'splashArt') return src.splashArt
        else return src.miniature
    }
    return (
        <CollectibleContainer>
            {isVideo ? (
                <Video src={src.splashArt} height={imageDimensions.adventurersOfThiolden.height} width={imageDimensions.adventurersOfThiolden.width} units={vmax1} />
            ) : (
                <MirroredPixelArtImage
                    src={getArtSource(src)}
                    alt={src.name}
                    height={imageDimensions[type].height}
                    width={imageDimensions[type].width * (type === 'pixelTiles' && artType === 'miniature' && src.class === 'furniture'? 1.5 : 1)}
                    isFlipped={artType === 'miniature'}
                />
            )}
            <CollectibleInfo>
                <p>{capitalizeFirstLetter(src.name)}</p>
                <p>Class: {src.class}</p>
                {src.class !== 'furniture' && <p>APS: {src.aps.join(', ')}</p>}
                <p>Quantity: {src.quantity} </p>
                <p>Active: {src.mortalRealmsActive}</p>
            </CollectibleInfo>
            <button onClick={() => modifyMortalCollection(src.assetRef, "add", type)} disabled={src.mortalRealmsActive >= parseInt(src.quantity)}>Add To Mortal</button>
            <button onClick={() => modifyMortalCollection(src.assetRef, "remove", type)} disabled={src.mortalRealmsActive < 1}>Remove from Mortal</button>
        </CollectibleContainer>
    )
}

export const DisplayView = ({ collectionItems }: { collectionItems: CollectionWithUIMetada }) => {
    const [artType, setArtType] = useState("splashArt")
    const handleArtTypeChange = () => {
        const newArtType = artType === "splashArt" ? "miniature" : "splashArt"
        setArtType(newArtType)
        setImageDimensions({
            "pixelTiles": dimensionsMap["pixelTiles"][newArtType],
            "grandMasterAdventurers": dimensionsMap["grandMasterAdventurers"][newArtType],
            "adventurersOfThiolden": dimensionsMap["adventurersOfThiolden"][newArtType],
        })
    }
   
    const dimensionsMap = {
        "pixelTiles": {
            "splashArt": { height: 10.5,  width: 9 },
            "miniature": { height: 10.5,  width: 6.75 },
        },
        "grandMasterAdventurers": {
            "splashArt": { height: 12,  width: 12 },
            "miniature": { height: 12,width: 9.6 }
        },
        "adventurersOfThiolden": {
            "splashArt": { height: 12,  width: 9 },
            "miniature": { height: 12,  width: 9 }
        }
    }

    const [imageDimensions, setImageDimensions] = useState({
        "pixelTiles": dimensionsMap["pixelTiles"]["splashArt"],
        "grandMasterAdventurers": dimensionsMap["grandMasterAdventurers"]["splashArt"],
        "adventurersOfThiolden": dimensionsMap["adventurersOfThiolden"]["splashArt"],
    })
    return (
        <EthernalCollectionContainer>
            <Header>
                <Title>Ethernal Collection</Title>
                <ButtonContainer>
                    <button onClick={() => handleArtTypeChange()}>{artType}</button>
                </ButtonContainer>
            </Header>
            {collectionItems.adventurersOfThiolden.map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions} type="adventurersOfThiolden" isVideo={artType == "splashArt" && isVideoFile(src.splashArt)} artType={artType} />
            )}
            {collectionItems.grandMasterAdventurers.map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions} type="grandMasterAdventurers" artType={artType}/>
            )}
            {collectionItems.pixelTiles.filter(src => src.class !== 'furniture').map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions} type="pixelTiles" artType={artType}/>
            )}
            {collectionItems.pixelTiles.filter(src => src.class == 'furniture').map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions} type="pixelTiles" artType={artType}/>
            )}
        </EthernalCollectionContainer>
    )
}