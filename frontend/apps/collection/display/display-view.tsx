import styled from "styled-components"
import { CollectionWithUIMetada, UICollectible } from "../collection-state-models"
import { OswaldFontFamily, PixelArtImage, Video, colors, vmax1 } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"
import { CharacterSprite, FurnitureSprite } from "./sprites"
import { Section } from "../commponents"
import { Button } from "../commponents/button"

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
const CollectibleContainer = styled.div<{ maxHeight?: string | number}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    min-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '350px')};
    max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '400px')};
`;


const CollectibleInfo = styled.div`
    padding: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #fff;
`

const CollectibleName = styled.p`
    font-size: 20px;
    color: ${colors.textGray};
    ${OswaldFontFamily}; 
    font-weight: bold;
    margin-bottom: 10px;
`

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
    imageDimensions: { height: number,  width: number }, 
    collectionName: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers", 
    isVideo?: boolean, 
    artType: string,
    type? : "Furniture" | "Character"
}

export const Collectible = ({ src, imageDimensions, collectionName, isVideo, artType, type}: RenderCollectible) => {
    return (
        <CollectibleContainer>
            {isVideo ? (
                <Video src={src.splashArt} height={imageDimensions.height} width={imageDimensions.width} units={vmax1} />
            ) : (
            <> { 
                artType === 'splashArt' ? (
                    <PixelArtImage
                        src={src.splashArt}
                        alt={src.name}
                        height={imageDimensions.height}
                        width={imageDimensions.width}
                    />
                ) : (
                    type === "Furniture" ? (
                        <FurnitureSprite
                            furniture={{
                                sprite: src.miniature,
                                assetRef: src.assetRef,
                                name: src.name
                            }}
                        />
                    ) : (
                        <CharacterSprite
                            character={{
                                sprite: src.miniature,
                                collection: collectionName,
                                class: src.class,
                                assetRef: src.assetRef
                            }}
                        />
                    )
                )
            }
             </>
            )}
            <CollectibleInfo>
                <CollectibleName>{capitalizeFirstLetter(src.name)}</CollectibleName>
                <p>Class: {src.class}</p>
                {src.class !== 'furniture' && <p>APS: {src.aps.join(', ')}</p>}
                <p>Quantity: {src.quantity} </p>
                <p>Pasive Stake: {src.stakingContribution}</p>
            </CollectibleInfo>
            { type === "Furniture" ? <></> : <Button action={() => modifyMortalCollection(src.assetRef, "add", collectionName)} disabled={src.mortalRealmsActive >= parseInt(src.quantity)}>Add To Mortal</Button>}
        </CollectibleContainer>
    )
}

export const DisplayView = ({ collectionItems, artType }: { collectionItems: CollectionWithUIMetada, artType: "miniature" | "splashArt" }) => { 
    const imageDimensions = {
        "pixelTiles": { height: 12,  width: 9 },
        "grandMasterAdventurers": { height: 12,  width: 12 },
        "adventurersOfThiolden": { height: 12,  width: 9 },
    }

    return (
        <Section key={"Ethernal Collection"} title="Ethernal Collection" colums={3}>
            {collectionItems.adventurersOfThiolden.map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.adventurersOfThiolden} collectionName="adventurersOfThiolden" isVideo={artType == "splashArt" && isVideoFile(src.splashArt)} artType={artType} />
            )}
            {collectionItems.grandMasterAdventurers.map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.grandMasterAdventurers} collectionName="grandMasterAdventurers" artType={artType}/>
            )}
            {collectionItems.pixelTiles.filter(src => src.class !== 'furniture').map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.pixelTiles} collectionName="pixelTiles" artType={artType}/>
            )}
            {collectionItems.pixelTiles.filter(src => src.class == 'furniture').map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.pixelTiles} collectionName="pixelTiles" artType={artType} type={"Furniture"}/>
            )}
        </Section>
    )
}