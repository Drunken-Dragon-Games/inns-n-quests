import Image from "next/image"
import styled, { css } from "styled-components"

export const CrispPixelArtCss = css`
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

export const CrispPixelArtImage = styled(Image)`
    ${CrispPixelArtCss}
`

export const CrispPixelArtBackground = styled(Image)`
    position: absolute;
    z-index: -1;
    ${CrispPixelArtCss}
`