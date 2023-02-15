import Image from "next/image"
import styled, { css } from "styled-components"

export const NoDragImageCss = css`
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
`

export const NoDragImageExt = styled(Image)`
    ${NoDragImageCss}
`

const Wrapper = styled.div<{ position: "absolute" | "relative", $fill?: boolean, height?: number, width?: number, zIndex?: number, units?: string }>`
    position: ${props => props.position};
    ${props => props.$fill ? "width: 100%; height: 100%;" : ""}
    ${props => props.height ? `height: ${props.height}${props.units ? props.units : "vmax"};` : ""}
    ${props => props.width ? `width: ${props.width}${props.units ? props.units : "vmax"};` : ""}
    ${props => props.zIndex ? `z-index: ${props.zIndex};` : ""}
`

export const NoDragImage = (props: {
    className?: string,
    src: string,
    alt?: string,
    absolute?: boolean,
    fill?: boolean,
    height?: number,
    width?: number,
    units?: string,
    zIndex?: number,
}) => {
    if (props.absolute) {
        return (
            <Wrapper position="absolute" className={props.className} $fill={props.fill} height={props.height} width={props.width} zIndex={props.zIndex} units={props.units}>
                <Wrapper position="relative" $fill={props.fill} height={props.height} width={props.width} zIndex={props.zIndex} units={props.units}>
                    <NoDragImageExt src={props.src} alt={props.src} layout="fill" />
                </Wrapper>
            </Wrapper>
        )
    } else {
        return (
            <Wrapper position="relative" className={props.className} $fill={props.fill} height={props.height} width={props.width} zIndex={props.zIndex} units={props.units}>
                <NoDragImageExt src={props.src} alt={props.src} layout="fill" />
            </Wrapper>
        )
    }
}

export const PixelArtCss = css`
    user-select: none;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

export const PixelArtImage = styled(NoDragImage)`
    ${PixelArtCss}
`