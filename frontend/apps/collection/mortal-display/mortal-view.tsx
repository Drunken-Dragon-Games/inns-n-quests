import styled, { keyframes } from "styled-components"
import { CollectionFetchingState, CollectionPolicyNames, CollectionWithGameData, CollectionWithUIMetada, MortalCollectible } from "../collection-state-models"
import { MessiriFontFamily, PixelArtImage, Video, vmax1, colors, OswaldFontFamily, vmax } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"
import { CharacterSprite, FurnitureSprite } from "../display/sprites"
import { Section } from "../commponents"
import { Button } from "../../utils/components/basic_components"

const MortalContainer = styled.div<{isMobile: boolean}>`
  padding-right: ${(p)=>p.isMobile? "15px": "8vw"};
`

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
    min-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '350px')};
    max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '400px')};
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

const removeFromMortalCollection = (asset: MortalCollectible, policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers") => {
    collectionTransitions.modifyMortalCollection(asset, "remove", policy)
}


const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

const hasItemsInCategory = (items: any, category: string) => {
    return Object.values(items).some((itemsArray: any) => itemsArray.some((src: any) => src.class === category));
  };
  
  const hasItemsNotInCategory = (items: any, category: string) => {
    return Object.values(items).some((itemsArray: any) => itemsArray.some((src: any) => src.class !== category))
  };

  

export const MortalView = ({ collectionItems, mortalLocked, justLocked, isMobile}: { collectionItems: CollectionWithGameData, mortalLocked: boolean, justLocked: boolean, isMobile: boolean}) => {
    
    type PolicyName = "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"

    const renderAsset = (src: any, policyName: PolicyName, maxHeight?: string) => {
        const assetArray = [];
        for (let i = 0; i < Number(src.quantity); i++) {
          assetArray.push(
            <CollectibleContainer key={`${src.name}-${i}`} maxHeight={maxHeight}>
              <ArtContainer>
              <CharacterSprite 
                character={{
                  sprite: src.miniature,
                  collection: policyName,
                  class: src.class,
                  assetRef: src.assetRef,
                }}
                units={isMobile ? vmax(3) : vmax1}
              />
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
            </CollectibleInfo>
            {mortalLocked ? <></> : <Button action ={ () => removeFromMortalCollection(src, policyName)} size="regular">Remove</Button>}
            </CollectibleContainer>
          );
        }
        return assetArray;
      }

    return (
      !hasItemsNotInCategory(collectionItems, "furniture") && !hasItemsInCategory(collectionItems, "furniture") 
      ?
      <MortalContainer isMobile={isMobile}>
      <Section key="mortal-collection" title="Mortal Collection" colums={1} highlight={ !mortalLocked ? colors.dduGold : justLocked ? colors.successHigthlight : undefined}>
        <EmptyCollectionHeaderMessage>
          Select adventurers below to quest in the Mortal Realms.
        </EmptyCollectionHeaderMessage>
        <EmptyCollectionMessage>
          Select up to 5 adventurers and click "Lock".
        </EmptyCollectionMessage>
        <EmptyCollectionMessage>
          Once a week you can make changes to your Mortal Collection.
        </EmptyCollectionMessage>
      </Section>
      </MortalContainer>
      :
      <MortalContainer isMobile={isMobile}>
      <Section key="mortal-collection" title="Mortal Collection" colums={isMobile ? 1 : 5} highlight={ !mortalLocked ? colors.dduGold : justLocked ? colors.successHigthlight : undefined}>
        {hasItemsNotInCategory(collectionItems, "furniture") && (
          <>
            {Object.entries(collectionItems).map(([policyNameKey, itemsArray]) => {
              const policyName = policyNameKey as PolicyName;
              return itemsArray.map((src) => (
                src.class !== "furniture" && renderAsset(src, policyName)
              ))
            })}
          </>
        )
        }
    </Section>
    </MortalContainer>
    )
}

