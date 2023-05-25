import { useMemo } from "react"
import styled from "styled-components"
import { Furniture, PixelArtImage, Units, useComputeHeightFromOriginalImage } from "../../../../../common"

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

export type SpriteRenderOptions = "normal" | "disabled" | "hovered"

const FurnitureSpriteContainer = styled.div<{ dimensions: Dimensions, render: SpriteRenderOptions }>`
    position: relative;
    overflow: visible;
    width: ${props => props.dimensions.units.u(5)};
    height: ${props => props.dimensions.units.u(5)};
    overflow: visible;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;

    ${({ render }) => { switch (render) {
        case "disabled":
            return "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
        case "hovered":
            return `
                @-webkit-keyframes hovered-animation {
                    0%, 20%, 50%, 80%, 100% {-webkit-transform: translateY(0);}
                    40% {-webkit-transform: translateY(-15px);}
                    60% {-webkit-transform: translateY(-5px);}
                }
                @keyframes hovered-animation {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-15px);}
                    60% {transform: translateY(-5px);}
                }
                -webkit-animation-name: hovered-animation; 
                animation-name: hovered-animation; 
                -webkit-animation-duration: 0.5s;
                animation-duration: 0.5s; 
                -webkit-animation-fill-mode: both; 
                animation-fill-mode: both;
                overflow: visible; 
                filter: drop-shadow(0px 10px 5px rgba(0,0,0,0.5)); /* IE6-9 */ 
                -webkit-filter: drop-shadow(0px 10px 5px rgba(0,0,0,0.5)); /* Google Chrome, Safari 6+ & Opera 15+ */ 
            `
        default:
            return ""
    }}}
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
    render?: SpriteRenderOptions
    units: Units
}

const FurnitureSprite = ({ className, furniture, render = "normal", units }: FurnitureSpriteProps) => {
    const dimensions = useFurnitureSpriteState(furniture, units)
    return (
        <FurnitureSpriteContainer className={className} dimensions={dimensions} render={render}>
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
