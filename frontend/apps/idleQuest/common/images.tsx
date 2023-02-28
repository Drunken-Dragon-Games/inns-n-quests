import { default as NImage } from "next/image"
import { MouseEventHandler, useEffect, useState } from "react"
import styled, { css } from "styled-components"
import { Units, vmax1 } from "../utils/units"

/**
 * Computes the height of an image based on its width and the original image's width and height
 * 
 * @param src The image source
 * @param desiredWidth The intended width of the image
 */
export const useComputeHeightFromOriginalImage = (src: string, desiredWidth: number): number => {
    const [desiredHeight, setHeight] = useState<number>(0)
    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            const height = (desiredWidth * img.height) / img.width
            setHeight(Math.round(height * 10) / 10)
        }
    }, [src])
    return desiredHeight
}

/**
 * Makes an image unselectable and undraggable
 */
export const NoDragImageCss = css`
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
`

/**
 * Unselectable and undraggable Next Image
 */
const NoDragImageExt = styled(NImage)`
    ${NoDragImageCss}
`

/**
 * Wrapper needed to control Next Images
 */
const NoDragWrapper = styled.div<{ 
    position: "absolute" | "relative",
    $fill?: boolean,
    height?: number,
    width?: number,
    zIndex?: number,
    units: Units 
}>`
    position: ${props => props.position};
    ${props => props.$fill ? "width: 100%; height: 100%;" : ""}
    ${props => props.height ? `height: ${props.units.u(props.height)}};` : ""}
    ${props => props.width ? `width: ${props.units.u(props.width)};` : ""}
    ${props => props.zIndex ? `z-index: ${props.zIndex};` : ""}
`

/**
 * Unselectable and undraggable Next Image.
 * Has better control over sizes than the standard Next Image.
 */
export const NoDragImage = (props: {
    className?: string,
    src: string,
    alt?: string,
    absolute?: boolean,
    fill?: boolean,
    height?: number,
    width?: number,
    units?: Units,
    zIndex?: number,
    onClick?: MouseEventHandler<HTMLDivElement>
}) => {
    const units = props.units ?? vmax1
    if (props.absolute) {
        return (
            <NoDragWrapper position="absolute" className={props.className} $fill={props.fill} height={props.height} width={props.width} zIndex={props.zIndex} units={units} onClick={props.onClick}>
                <NoDragWrapper position="relative" $fill={props.fill} height={props.height} width={props.width} zIndex={props.zIndex} units={units}>
                    <NoDragImageExt src={props.src} alt={props.src} layout="fill" />
                </NoDragWrapper>
            </NoDragWrapper>
        )
    } else {
        return (
            <NoDragWrapper position="relative" className={props.className} $fill={props.fill} height={props.height} width={props.width} zIndex={props.zIndex} units={units} onClick={props.onClick}>
                <NoDragImageExt src={props.src} alt={props.src} layout="fill" />
            </NoDragWrapper>
        )
    }
}

/**
 * Makes an image pixelated, great for pixel art
 */
export const PixelArtCss = css`
    user-select: none;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

/**
 * Pixelated Next Image
 */
export const PixelArtImage = styled(NoDragImage)`
    ${PixelArtCss}
`
