import styled from "styled-components"
import { CollectionFetchingState, CollectionPolicyNames, CollectionWithGameData, CollectionWithUIMetada } from "../collection-state-models"
import { MessiriFontFamily, PixelArtImage, Video, vmax1, colors, OswaldFontFamily } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"
import { CharacterSprite, FurnitureSprite } from "../display/sprites"
import { Section } from "../commponents"
import { Button } from "../../utils/components/basic_components"

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: span 5;
`;

const Title = styled.h2`
    color: #fff;
    text-align: center;
    grid-column: span 5;
    margin: 0;
`
const CollectibleContainer = styled.div<{ maxHeight?: string | number}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    min-height: 180px;
    max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '300px')};
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
    color: ${colors.textGray};  // Assuming you import this from your colors file
    ${OswaldFontFamily};  // Assuming you import this font family from your styles file
    font-weight: bold;
    margin-bottom: 10px;
`

const removeFromMortalCollection = (assetRef: string, policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers") => {
    collectionTransitions.modifyMortalCollection(assetRef, "remove", policy)
}


const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

const hasItemsInCategory = (items: any, category: string) => {
    return Object.values(items).some((itemsArray: any) => itemsArray.some((src: any) => src.class === category));
  };
  
  const hasItemsNotInCategory = (items: any, category: string) => {
    return Object.values(items).some((itemsArray: any) => itemsArray.some((src: any) => src.class !== category));
  };


export const MortalView = ({ collectionItems}: { collectionItems: CollectionWithGameData}) => {
    
    type PolicyName = "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"

    const renderAsset = (src: any, policyName: PolicyName, maxHeight?: string) => {
        const assetArray = [];
        for (let i = 0; i < Number(src.quantity); i++) {
          assetArray.push(
            <CollectibleContainer key={`${src.name}-${i}`} maxHeight={maxHeight}>
              <CharacterSprite 
                character={{
                  sprite: src.miniature,
                  collection: policyName,
                  class: src.class,
                  assetRef: src.assetRef,
                }}
              />
              <CollectibleInfo>
                <CollectibleName>{capitalizeFirstLetter(src.name)}</CollectibleName>
                <p>Class: {src.class}</p>
                {src.class !== 'furniture' && <p>APS: {src.aps.join(', ')}</p>}
            </CollectibleInfo>
            <Button action ={ () => removeFromMortalCollection(src.assetRef, policyName)} size="regular">Remove</Button>
            </CollectibleContainer>
          );
        }
        return assetArray;
      }

    return (
    <Section  key="mortal-collection" title="Mortal Collection" colums={5}>
      {(
        <>
          {hasItemsNotInCategory(collectionItems, "furniture") && (
            <>
              {Object.entries(collectionItems).map(([policyNameKey, itemsArray]) => {
                  const policyName = policyNameKey as PolicyName
                  return itemsArray.map((src) => (
                      src.class !== "furniture" && renderAsset(src, policyName)
                  ));
              })}
            </>
          )}
          
          {hasItemsInCategory(collectionItems, "furniture") && (
            <>
              <Header>
                  <Title>Furniture</Title>
              </Header>
              {Object.entries(collectionItems).map(([policyNameKey, itemsArray]) => {
                  const policyName = policyNameKey as PolicyName
                  return itemsArray.map((src) => (
                      src.class === "furniture" && renderAsset(src, policyName, "180")
                  ));
              })}
            </>
          )}
        </>
      )}
    </Section>
  )
}

