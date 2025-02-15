import styled, { keyframes } from "styled-components"
import { CollectionWithUIMetada, MortalCollectible, UICollectible } from "../collection-state-models"
import { OswaldFontFamily, PixelArtImage, Video, colors, vmax, vmax1 } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"
import { CharacterSprite, FurnitureSprite } from "./sprites"
import { Section } from "../commponents"
import { Button } from "../commponents/button"

const DisplaylContainer = styled.div<{isMobile: boolean}>`
padding-right: ${(p)=>p.isMobile? "15px": "8vw"};
`

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
    #border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    #box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
    #background-color: rgba(0, 0, 0, 0.5);
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

const ClickableText = styled.p`
    color: ${colors.dduGold};
    font-weight: bold;
    cursor: pointer;
    font-size: 24px;
    img {
        vertical-align: middle; // Align the image vertically in the middle
        margin-left: 5px; // Add some spacing between text and image
    }
`

const EmptyCollectionHeaderMessage = styled.div`
    font-size: 30px;
    text-align: center;
    color: ${colors.textBeige};
    margin-top: 20px;
    ${OswaldFontFamily}
    font-weight: bold;
    text-transform: uppercase;
`

const EmptyCollectionMessage = styled.div`
    font-size: 20px;
    text-align: center;
    color: ${colors.textBeige};
    margin-top: 20px;
    ${OswaldFontFamily}
`

const StyledP = styled.p`
    img {
        vertical-align: middle; // Align the image vertically in the middle
        margin-left: 5px; // Add some spacing between text and image
    }
`
const hoverAnimation = keyframes`
    0% {
        transform: scale(1);
        filter: drop-shadow(0px 0px 10px black);
    }
    100% {
        transform: scale(1.25);
        filter: drop-shadow(5px 5px 15px ${colors.dduGold});
    }
`


const hoverOutAnimation = keyframes`
    0% {
        transform: scale(1.25);
        filter: drop-shadow(5px 5px 15px ${colors.dduGold});
    }
    100% {
        transform: scale(1);
        filter: drop-shadow(0px 0px 10px black);
    }
`

const ArtContainer = styled.div`
& > * {
    filter: drop-shadow(0px 0px 10px black);
    animation: ${hoverOutAnimation} 200ms ease-in-out;
    &:hover {
        animation: ${hoverAnimation} 200ms ease-in-out;
        transform: scale(1.25);
        filter: drop-shadow(5px 5px 15px ${colors.dduGold});
        z-index: 10;
    }
} 
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

const isCollectionEmpty = (collectionItems: CollectionWithUIMetada): boolean => {
    return (
        collectionItems.adventurersOfThiolden.length < 1 && 
        collectionItems.grandMasterAdventurers.length < 1 && 
        collectionItems.pixelTiles.length < 1
    )
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
    const handleStakingContributionClick = () => {
        window.open("https://github.com/Drunken-Dragon-Games/ddu-ballots/blob/main/s1/001-passive-active-adventurers.md#passive-staking-earned-ds", '_blank')
    }

    return (
        <CollectibleContainer artType={artType}>
            <ArtContainer>
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
            </ArtContainer>
            <CollectibleInfo isMobile={isMobile}>
                <CollectibleName isMobile={isMobile}>{capitalizeFirstLetter(src.name)}</CollectibleName>
                {src.class !== 'furniture' && 
                    <StyledP>
                        <img src="https://cdn.ddu.gg/modules/ddu-app/s2Explorer/adventurer_data/athleticism.svg" alt="Athleticism"/> {`${src.aps[0]} `} 
                        <img src="https://cdn.ddu.gg/modules/ddu-app/s2Explorer/adventurer_data/intellect.svg" alt="Intellect"/> {`${src.aps[1]} `} 
                        <img src="https://cdn.ddu.gg/modules/ddu-app/s2Explorer/adventurer_data/charisma.svg" alt="Charisma"/> {`${src.aps[2]} `} 
                    </StyledP>
                    }
                {src.class !== 'furniture' &&  
                    <StyledP>
                        <img src={`https://cdn.ddu.gg/modules/ddu-app/s2Explorer/class/${src.class.toLowerCase()}.svg`} alt="Class Logo"/> {src.class}
                    </StyledP>
                }
                { Number(src.quantity) > 1 ? <p>Quantity: {src.quantity} </p> : <></>}
                <ClickableText onClick={handleStakingContributionClick}>{src.stakingContribution} <img src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/icons/dragon_silver_toClaim.svg" alt="DS Logo"/> / week</ClickableText>
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
        <DisplaylContainer isMobile={isMobile}>
        {isCollectionEmpty(collectionItems) ?
        <Section key={"Eternal Collection"} title="Eternal Collection" colums={isMobile ? 1 : 1}>
            <EmptyCollectionHeaderMessage>
            Press the Sync button on the dashboard to load your assets from the blockchain
            </EmptyCollectionHeaderMessage>
            <EmptyCollectionMessage>
            This actions is perfomed automatically every 24 hrs
            </EmptyCollectionMessage>
        </Section> : 
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
        }
        </DisplaylContainer>
    )
}