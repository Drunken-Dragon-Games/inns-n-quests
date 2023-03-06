import Image from "next/image"
import React, { useState } from "react"
import styled from "styled-components"
import { If, Push, SansSerifFontFamily } from "../../../../common"
import Transitions from "../../inventory-transitions"
import { BigHopsButton } from "../../../../common"

const DragonSilverDisplayContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    padding: 0.8vh 1vh;
    background-color: rgba(20,20,20,0.5);
    align-items: center;
`

const CloseButton = styled.div`
    cursor: pointer;
    color: white;
    font-size: 2.5vh;
    font-weight: bold;
    ${SansSerifFontFamily}
    &:hover{ text-shadow: 0 0 0.5vh white; }
`

const DragonSilverWrapper = styled.div`
    margin-left: 1vh;
    margin-top: 0.3vh;
    display: flex;
`

const ClaimDragonSilverButtonWrapper = styled.div`
    margin-left: 1vh;
    margin-top: 0.3vh;
`

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


interface InventoryHeaderProps {
    className?: string,
}

const InventoryHeader = ({ className }: InventoryHeaderProps) =>
    <DragonSilverDisplayContainer className={className}>
        {/*<BigHopsButton onClick={Transitions.onRecruitCharacter} text="Recruit" />*/}
        <Push />
        <DragonSilverWrapper>
            <DragonSilverIcon
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver.png"
                dragonSilver={0}
                tooltip="Dragon Silver"
                toClaim={false}
            />
        </DragonSilverWrapper>

        <ClaimDragonSilverButtonWrapper>
            <DragonSilverIcon
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver_to_claim.png"
                dragonSilver={0}
                tooltip="Dragon Silver to Claim"
                toClaim={false}
            />
        </ClaimDragonSilverButtonWrapper>

        <CloseButton onClick={Transitions.onToggleInventory}>
            <span>X</span>
        </CloseButton>
    </DragonSilverDisplayContainer>

export default InventoryHeader
