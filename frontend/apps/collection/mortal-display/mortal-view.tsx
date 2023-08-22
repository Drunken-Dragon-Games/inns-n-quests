import styled from "styled-components"
import { CollectionFetchingState, CollectionPolicyNames, CollectionWithGameData, CollectionWithUIMetada } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"
import { CharacterSprite, FurnitureSprite } from "../display/sprites"

const MortalCollectionContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
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
const CollectibleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
`;

const CollectibleInfo = styled.div`
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
    text-align: center;
`

const FaucetContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const StyledButton = styled.button`
    height: 80px;
    margin: 0 5px;
`;


const removeFromMortalCollection = (assetRef: string, policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers") => {
    collectionTransitions.modifyMortalCollection(assetRef, "remove", policy)
}


const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

export const MortalView = ({ collectionItems, status }: { collectionItems: CollectionWithGameData, status: CollectionFetchingState}) => {
    
    type PolicyName = "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"

    const renderAsset = (src: any, policyName: PolicyName) => {
        const assetArray = [];
        for (let i = 0; i < Number(src.quantity); i++) {
          assetArray.push(
            <CollectibleContainer key={`${src.name}-${i}`}>
              <CharacterSprite 
                character={{
                  sprite: src.miniature,
                  collection: policyName,
                  class: src.class,
                  assetRef: src.assetRef,
                }}
              />
              <CollectibleInfo>
                <p>{capitalizeFirstLetter(src.name)}</p>
                <p>Class: {src.class}</p>
                {src.class !== 'furniture' && <p>APS: {src.aps.join(', ')}</p>}
              </CollectibleInfo>
              <button onClick={() => removeFromMortalCollection(src.assetRef, policyName)}>Remove</button>
            </CollectibleContainer>
          );
        }
        return assetArray;
      };
      

    return (<>
        <FaucetContainer>
            <h2 style={{ color: 'white' }}>{JSON.stringify(status)}</h2>
            <ButtonContainer>
                <StyledButton onClick={() => collectionTransitions.grantTestCollection("Nami")}>
                    Get Collection on Nami
                </StyledButton>
                <StyledButton onClick={() => collectionTransitions.grantTestCollection("Eternl")}>
                    Get Collection on Eternl
                </StyledButton>
            </ButtonContainer>
        </FaucetContainer>

        <MortalCollectionContainer>
            <Header>
                <Title>Mortal Collection</Title>
            </Header>
            <Header>
                <Title>Adventurers</Title>
            </Header>
            {Object.entries(collectionItems).map(([policyNameKey, itemsArray]) => {
                const policyName = policyNameKey as PolicyName
                return itemsArray.map((src) => (
                    src.class !== "furniture" && renderAsset(src, policyName)
                ));
            })}
            
            <Header>
                <Title>Furniture</Title>
            </Header>
            {Object.entries(collectionItems).map(([policyNameKey, itemsArray]) => {
                const policyName = policyNameKey as PolicyName
                return itemsArray.map((src) => (
                    src.class === "furniture" && renderAsset(src, policyName)
                ));
            })}
        </MortalCollectionContainer>
        </>
    )
}

