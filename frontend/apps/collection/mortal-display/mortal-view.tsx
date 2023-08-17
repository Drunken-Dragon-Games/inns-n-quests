import styled from "styled-components"
import { CollectionPolicyNames, CollectionWithGameData, CollectionWithUIMetada } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
import { useState } from "react"
import { collectionTransitions } from "../collection-transitions"

const MortalCollectionContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px; /* reduced from 20px */
    margin-bottom: 10px; /* reduced from 20px */
    margin-left: 25vw; /* reduced from 9.5vw */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px; /* reduced from 20px */
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

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 10px 0px 10px 0px;
`

const MirroredPixelArtImage = styled(PixelArtImage)`
  transform: scaleX(-1);
`

const removeFromMortalCollection = (assetRef: string, policy: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers") => {
    collectionTransitions.modifyMortalCollection(assetRef, "remove", policy)
}


const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

export const MortalView = ({ collectionItems }: { collectionItems: CollectionWithGameData }) => {
    const dimensionsMap = {
        "pixelTiles": {height: 10.5 * 0.5,  width: 6.75 * 0.5 },
        "grandMasterAdventurers": { height: 12 * 0.5, width: 9.6 * 0.5 },
        "adventurersOfThiolden": {height: 12 * 0.5,  width: 9 * 0.5 }
    }
    
    type PolicyName = "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"

    const renderAsset = (src: any, policyName: PolicyName) => {
        const assetArray = [];
        for (let i = 0; i < Number(src.quantity); i++) {
            assetArray.push(
                <CollectibleContainer key={`${src.name}-${i}`}>
                    <MirroredPixelArtImage
                        src={src.miniature}
                        alt={src.name}
                        height={dimensionsMap[policyName].height}
                        width={dimensionsMap[policyName].width * (policyName === 'pixelTiles'&& src.class === 'furniture'? 1.5 : 1)}
                    />
                    <CollectibleInfo>
                        <p>{capitalizeFirstLetter(src.name)}</p>
                        <p>Class: {src.class}</p>
                        {src.class !== 'furniture' && <p>APS: {src.aps.join(', ')}</p>}
                    </CollectibleInfo>
                    <button onClick={() => removeFromMortalCollection(src.assetRef, policyName)} >Remove</button>
                </CollectibleContainer>
            )
        }
        return assetArray;
    }

    return (<>
        <MortalCollectionContainer>
        { process.env["NEXT_PUBLIC_ENVIROMENT"] === "development" ? 
                <ButtonContainer>
                    <button onClick = {() => collectionTransitions.grantTestCollection("Nami")}>Get Collection on Nami</button>
                    <button onClick = {() => collectionTransitions.grantTestCollection("Eternl")}>Get Collection on Eternl</button>
                </ButtonContainer>
                : 
                <></>
            }
        </MortalCollectionContainer>
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

