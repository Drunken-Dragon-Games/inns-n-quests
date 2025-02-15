import { default as NImage } from "next/image"
import { HTMLAttributes, useEffect, useState } from "react"
import styled, { css } from "styled-components"
import { Units, vmax1 } from "../units"

const imageSizesCache: Record<string, number> = {}

/**
 * Computes the height of an image based on its width and the original image's width and height
 * 
 * @param src The image source
 * @param desiredWidth The intended width of the image
 */
export const useComputeHeightFromOriginalImage = (src: string, desiredWidth: number): number => {
    const [desiredHeight, setHeight] = useState<number>(0)
    const cacheValue = imageSizesCache[`${src}-${desiredWidth}`]
    useEffect(() => {
        if (cacheValue) return
        const img = new Image()
        img.src = src
        const onLoad = () => {
            const height = (desiredWidth * img.height) / img.width
            const roundedHeight = Math.round(height * 10) / 10
            setHeight(roundedHeight)
            imageSizesCache[`${src}-${desiredWidth}`] = roundedHeight
        }
        img.addEventListener("load", onLoad)
        return () => img.removeEventListener("load", onLoad)
    }, [src, desiredWidth])
    return cacheValue ?? desiredHeight
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
    units: Units,
    max?: Units
}>`
    position: ${props => props.position};
    ${props => props.$fill ? "width: 100%; height: 100%;" : ""}
    ${props => props.height ? `height: ${props.units.u(props.height)}};` : ""}
    ${props => props.width ? `width: ${props.units.u(props.width)};` : ""}
    ${props => props.max ? `max-width: ${props.max.u(props.width)};` : ""}
    ${props => props.max ? `max-height: ${props.max.u(props.height)};` : ""}
    ${props => props.zIndex ? `z-index: ${props.zIndex};` : ""}
`

export interface NoDragImageProps extends HTMLAttributes<HTMLDivElement> {
    src: string,
    alt?: string,
    absolute?: boolean,
    fill?: boolean,
    height?: number,
    width?: number,
    units?: Units,
    max?: Units,
    zIndex?: number,
}

/**
 * Unselectable and undraggable Next Image.
 * Has better control over sizes than the standard Next Image.
 */
export const NoDragImage = ({ 
    src,
    alt,
    absolute,
    fill,
    height,
    width,
    units = vmax1,
    max,
    zIndex,
    ...rest
 }: NoDragImageProps) => {
    if (absolute) {
        return (
            <NoDragWrapper position="absolute" {...rest} $fill={fill} height={height} width={width} zIndex={zIndex} units={units} max={max}>
                <NoDragWrapper position="relative" className={rest.className} $fill={fill} height={height} width={width} zIndex={zIndex} units={units} max={max}>
                    <NoDragImageExt src={src} alt={src} layout="fill" />
                </NoDragWrapper>
            </NoDragWrapper>
        )
    } else {
        return (
            <NoDragWrapper position="relative" {...rest} $fill={fill} height={height} width={width} zIndex={zIndex} units={units} max={max}>
                <NoDragImageExt src={src} alt={src} layout="fill" />
            </NoDragWrapper>
        )
    }
}

/**
 * Makes an image pixelated, great for pixel art
 */
export const PixelArtCss = css`
    image-rendering: pixelated !important;
`

/**
 * Pixelated Next Image
 */
export const PixelArtImage = styled(NoDragImage)`
    image-rendering: pixelated !important;
`
