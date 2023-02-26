import { useMemo } from "react"
import styled from "styled-components"
import { Furniture } from "../dsl/furniture"
import {
    PixelArtImage, Units,
    useComputeHeightFromOriginalImage
} from "../utils"

const ptMeasures = (furniture: Furniture): [number, [number,number]] => {
    const ptNum = furniture.assetRef.split("PixelTile")[1]
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
        return [9, [-1,0]]
    // Banners
    else if (["25", "26"].includes(ptNum))
        return [7, [3,0]]
    // Torch & Quest Board
    else if (["38", "39"].includes(ptNum))
        return [9, [5,0]]
    // Banks & Barrel
    else if (["20", "40"].includes(ptNum))
        return [6, [-1,0]]
    // Common Props
    else if (["20", "25", "26", "27", "30", "38", "39", "40"].includes(ptNum))
        return [6, [0,0]]
    // Rug
    else 
        return [14, [-1,0]]
}

const FurnitureSpriteContainer = styled.div<{ dimensions: Dimensions }>`
    position: relative;
    width: ${props => props.dimensions.units.u(props.dimensions.width)};
    height: ${props => props.dimensions.units.u(props.dimensions.height)};
`

const FurnitureImageContainer = styled.div<{ dimensions: Dimensions }>`
    position: absolute;
    margin-top: ${props => props.dimensions.units.u(props.dimensions.offset[0])};
    margin-left: ${props => props.dimensions.units.u(props.dimensions.offset[1])};
`

interface Dimensions {
    width: number
    height: number
    units: Units
    offset: [number, number]
}

const useFurnitureSpriteState = (furniture: Furniture, units: Units): Dimensions => {
    const dimensions = useMemo(() => {
        const [width, offset] =
            ptMeasures(furniture) 
        return { width, height: 0, units, offset: offset as [number,number] }
    }, [furniture, units])
    return {...dimensions, height: useComputeHeightFromOriginalImage(furniture.sprite, dimensions.width) }
}

interface FurnitureSpriteProps {
    className?: string
    furniture: Furniture
    units: Units
}

const FurnitureSprite = ({ className, furniture, units }: FurnitureSpriteProps) => {
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
