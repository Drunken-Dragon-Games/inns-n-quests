import Image from "next/image"
import { useState } from "react"
import styled from "styled-components"
import { If } from "../../../common-components"

const DragonSilverIconContainer = styled.div`
    display: flex;
    width: 4vw;
    p{
        margin-left: 0.5vw;
        margin-top: 0.12vw;
    }
`

const ImageWrapper = styled.div`
    display: block;
    width: 1.5vw;
    height: 1.5vw;
    position: relative;
`

const ToolTipDragonSilverToClaim = styled.span<{ $hover: boolean }>`
    position: absolute;
    background-color: white;
    padding: 0.2vw 0.5vw 0.1vw 0.5vw;
    border-radius: 0.5vw;
    top: 0vw;
    left: 2vw;
    width: 6vw;
    visibility: ${props => props.$hover ? "visible": "hidden"};
    opacity: ${props => props.$hover ? "1": "0"};
    transition: opacity 0.5s, visibility 0.5s;
    z-index: 2;
`

interface DragonSilverIconProps{
    src: string
    dragonSilver: number
    tooltip: string
    toClaim?: boolean
}

const DragonSilverIcon = ({ src, dragonSilver, tooltip, toClaim }: DragonSilverIconProps) => {
    const [onHoverDragonSilverToClaim, setOnHoverDragonSilverToClaim] = useState<boolean>(false)
    return (
        <DragonSilverIconContainer>
            <ImageWrapper>
                <Image
                    src={src}
                    alt="Dragon silver to claim icon"
                    width={30}
                    height={30}
                    layout="responsive"
                    onMouseOver={() => setOnHoverDragonSilverToClaim(true)}
                    onMouseLeave={() => setOnHoverDragonSilverToClaim(false)}
                />
                <ToolTipDragonSilverToClaim $hover={onHoverDragonSilverToClaim}><p>{tooltip}</p></ToolTipDragonSilverToClaim>
            </ImageWrapper>

            <If $if={!toClaim}>
                <p>{dragonSilver}</p>
            </If>

        </DragonSilverIconContainer>
    )
}

export default DragonSilverIcon