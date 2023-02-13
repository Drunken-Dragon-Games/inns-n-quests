import Image from "next/image"
import styled, { css } from "styled-components"

export const CrispPixelArtCss = css`
    user-select: none;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  

    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;

    img {
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
    }
`

export const CrispPixelArtImage = styled(Image)`
    ${CrispPixelArtCss}
`

export const CrispPixelArtBackground = styled(Image)`
    position: absolute;
    z-index: -1;
    ${CrispPixelArtCss}
`