import styled from "styled-components"
import { CollectionWithUIMetada, MortalCollectible, UICollectible } from "../collection-state-models"
import { OswaldFontFamily, PixelArtImage, Video, colors, vmax, vmax1 } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"
import { CharacterSprite, FurnitureSprite } from "./sprites"
import { Section } from "../commponents"
import { Button } from "../commponents/button"

const CollectibleContainer = styled.div<{ artType: "miniature" | "splashArt", maxHeight?: string | number}>`
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    min-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '350px')};
    max-height: ${({ artType, maxHeight }) => artType === 'splashArt' ? 'none' : (maxHeight ? `${maxHeight}px` : '400px')};
`;


const CollectibleInfo = styled.div<{isMobile: boolean}>`
    padding: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #fff;
    font-size: ${(isMobile) => isMobile ? "20px" : "16px"};
`

const CollectibleName = styled.p<{isMobile: boolean}>`
    font-size: ${(isMobile) => isMobile ? "22px" : "20px"};
    color: ${colors.textGray};
    ${OswaldFontFamily}; 
    font-weight: bold;
    margin-bottom: 10px;
`

const GoldenP = styled.p`
    color: ${colors.dduGold}
`

const isVideoFile = (src: string): boolean => {
    return src.endsWith('.mp4')
}

const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

const modifyMortalCollection = (asset: MortalCollectible, action: "add" | "remove", policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers") => {
    collectionTransitions.modifyMortalCollection(asset, action, policy)
}

type RenderCollectible = { 
    src: UICollectible, 
    imageDimensions: { height: number,  width: number }, 
    collectionName: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers",
    artType: "miniature" | "splashArt",
    mortalLocked: boolean,
    type? : "Furniture" | "Character",
    isMobile: boolean
}

export const Collectible = ({ src, imageDimensions, collectionName, artType, type, mortalLocked, isMobile}: RenderCollectible) => {
    return (
        <CollectibleContainer artType={artType}>
            {
            artType === 'splashArt' ?
                isVideoFile(src.splashArt) ?
                    <Video src={src.splashArt} height={imageDimensions.height} width={imageDimensions.width} units={isMobile ? vmax(3) : vmax1} /> :
                    <PixelArtImage src={src.splashArt} alt={src.name} height={imageDimensions.height} width={imageDimensions.width} units={isMobile ? vmax(3) : vmax1}/>
                :
                type === "Furniture" ? 
                    <FurnitureSprite furniture={{ sprite: src.miniature, assetRef: src.assetRef, name: src.name}} units={isMobile ? vmax(3) : vmax1}/> :
                    <CharacterSprite character={{sprite: src.miniature,collection: collectionName,class: src.class,assetRef: src.assetRef}} units={isMobile ? vmax(3) : vmax1} />  
            }
            <CollectibleInfo isMobile={isMobile}>
                <CollectibleName isMobile={isMobile}>{capitalizeFirstLetter(src.name)}</CollectibleName>
                <p>Class: {src.class}</p>
                {src.class !== 'furniture' && <p>APS: {src.aps.join(', ')}</p>}
                { Number(src.quantity) > 1 ? <p>Quantity: {src.quantity} </p> : <></>}
                <GoldenP>{src.stakingContribution} $DS/week</GoldenP>
            </CollectibleInfo>
            { mortalLocked || type === "Furniture" ? <></> : <Button action={() => modifyMortalCollection(src, "add", collectionName)} disabled={src.mortalRealmsActive >= parseInt(src.quantity)}>Add To Mortal</Button>}
        </CollectibleContainer>
    )
}

export const DisplayView = ({ collectionItems, artType, mortalLocked, isMobile }: { collectionItems: CollectionWithUIMetada, artType: "miniature" | "splashArt", mortalLocked: boolean, isMobile: boolean }) => { 
    const imageDimensions = {
        "pixelTiles": { height: 12,  width: 9 },
        "grandMasterAdventurers": { height: 12,  width: 12 },
        "adventurersOfThiolden": { height: 12,  width: 9 },
    }

    return (
        <Section key={"Eternal Collection"} title="Eternal Collection" colums={isMobile ? 1 : 3}>
            {collectionItems.adventurersOfThiolden.map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.adventurersOfThiolden} collectionName="adventurersOfThiolden" artType={artType} mortalLocked={mortalLocked} isMobile={isMobile}/>
            )}
            {collectionItems.grandMasterAdventurers.map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.grandMasterAdventurers} collectionName="grandMasterAdventurers" artType={artType} mortalLocked={mortalLocked} isMobile={isMobile}/>
            )}
            {collectionItems.pixelTiles.filter(src => src.class !== 'furniture').map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.pixelTiles} collectionName="pixelTiles" artType={artType} mortalLocked={mortalLocked} isMobile={isMobile}/>
            )}
            {collectionItems.pixelTiles.filter(src => src.class == 'furniture').map((src, index) =>
                <Collectible key={index} src={src} imageDimensions={imageDimensions.pixelTiles} collectionName="pixelTiles" artType={artType} type={"Furniture"} mortalLocked={mortalLocked} isMobile={isMobile}/>
            )}
        </Section>
    )
}