import { useMemo } from "react"
import styled from "styled-components"
import { Furniture, PixelArtImage, Units, useComputeHeightFromOriginalImage, vmax1 } from "../../../common"

const ptMeasures = (assetRef: string): [number, [number,number]] => {
    const ptNum = assetRef.split("PixelTile")[1]
    // Tables
    if (["4", "5", "6", "7", "8", "9"].includes(ptNum)) 
        return [10, [0,0]]
    // Hearths
    else if (["10", "18", "19"].includes(ptNum))
        return [11, [0,0]]
    // Small Tables
    else if (["28", "29"].includes(ptNum))
        return [6, [0,0]]
    // Bar Barrels
    else if (["14", "15", "16", "17"].includes(ptNum))
        return [11, [0,0]]
    // Bars 
    else if (["34", "35", "36", "37"].includes(ptNum))
        return [9, [2,0]]
    // Banners
    else if (["25", "26"].includes(ptNum))
        return [7, [-4,0]]
    // Torch & Quest Board
    else if (["38", "39"].includes(ptNum))
        return [9, [-5,0]]
    // Banks & Barrel
    else if (["20", "40"].includes(ptNum))
        return [6, [1,0]]
    // Common Props
    else if (["27", "30"].includes(ptNum))
        return [6, [0,0]]
    // Rug
    else 
        return [14, [0.5,0]]
}

const FurnitureSpriteContainer = styled.div<{ dimensions: Dimensions}>`
    position: relative;
    overflow: visible;
    width: ${props => props.dimensions.units.u(5)};
    height: ${props => props.dimensions.units.u(5)};
    overflow: visible;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    height: ${props => props.dimensions.units.u(props.dimensions.height)};
`

const FurnitureImageContainer = styled.div<{ dimensions: Dimensions }>`
    position: absolute;
    overflow: visible;
    width: ${props => props.dimensions.units.u(props.dimensions.width)};
    height: ${props => props.dimensions.units.u(props.dimensions.height)};
    margin-bottom: ${props => props.dimensions.units.u(props.dimensions.offset[0])};
    margin-left: ${props => props.dimensions.units.u(props.dimensions.offset[1])};
`

interface Dimensions {
    width: number
    height: number
    units: Units
    offset: [number, number]
}

type CollectionFurniture = {
    sprite: string, 
    assetRef: string,
    name: string
}

const useFurnitureSpriteState = (furniture: CollectionFurniture, units: Units): Dimensions => {
    const [width, offset] = ptMeasures(furniture.assetRef) 
    const dimensions = { width, height: 0, units, offset: offset as [number,number] }
    return {...dimensions, height: useComputeHeightFromOriginalImage(furniture.sprite, dimensions.width) }
}

interface FurnitureSpriteProps {
    className?: string
    furniture: CollectionFurniture
    units?: Units
}

const FurnitureSprite = ({ className, furniture, units = vmax1 }: FurnitureSpriteProps) => {
    const dimensions = useFurnitureSpriteState(furniture, units)
    return (
        <FurnitureSpriteContainer className={className} dimensions={dimensions}>
            <FurnitureImageContainer dimensions={dimensions}>
                <PixelArtImage
                    src={furniture.sprite}
                    alt={furniture.name}
                    width={dimensions.width}
                    height={dimensions.height}
                    units={dimensions.units}
                />
            </FurnitureImageContainer>
        </FurnitureSpriteContainer>
    )
}

export default FurnitureSprite
