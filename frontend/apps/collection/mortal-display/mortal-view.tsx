import styled from "styled-components"
import { CollectionPolicyNames, CollectionWithGameData, CollectionWithUIMetada } from "../collection-state-models"
import { PixelArtImage, Video, vmax1 } from "../../common"
import { useState } from "react"

const MortalCollectionContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    margin-left: 9.5vw;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
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
    gap: 10px;
`;

const CollectibleInfo = styled.div`
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
    text-align: center;
`;

const MirroredPixelArtImage = styled(PixelArtImage)`
  transform: scaleX(-1);
`;

const capitalizeFirstLetter = (input: string): string => {
    if (input.length === 0) return ''
    return input.charAt(0).toUpperCase() + input.slice(1)
}

export const MortalView = ({ collectionItems }: { collectionItems: CollectionWithGameData }) => {
    const dimensionsMap = {
        "pixelTiles": {height: 10.5,  width: 6.75 },
        "grandMasterAdventurers": { height: 12,width: 9.6 },
        "adventurersOfThiolden": {height: 12,  width: 9 }
    }
    type PolicyName = "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers"
    return(
    <MortalCollectionContainer>
        <Header>
            <Title>Mortal Collection</Title>
        </Header>
        {Object.entries(collectionItems).map(([policyNameKey, itemsArray]) => {
            const policyName = policyNameKey as PolicyName
            return itemsArray.map((src, index) => (
                <CollectibleContainer key={index}>
                <MirroredPixelArtImage
                    src={src.miniature}
                    alt={src.name}
                    height={dimensionsMap[policyName].height}
                    width={dimensionsMap[policyName].width}
                />
                <CollectibleInfo>
                    <p>{capitalizeFirstLetter(src.name)}</p>
                    <p>Class: {src.class}</p>
                    <p>APS: {src.aps.join(", ")}</p>
                </CollectibleInfo>
                </CollectibleContainer>
            ));
            })
        }

    </MortalCollectionContainer>
    )
}