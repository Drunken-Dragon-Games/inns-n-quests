import Image from "next/image"
import React, { useState } from "react"
import styled from "styled-components"
import { If, OswaldFontFamily, Push, SansSerifFontFamily } from "../../../../common"
import Transitions from "../../inventory-transitions"
import { BigHopsButton } from "../../../../common"

const DragonSilverDisplayContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    padding: 15px;
    background-color: rgba(20,20,20,0.5);
    align-items: center;
`

const CloseButton = styled.div`
    cursor: pointer;
    color: white;
    font-size: 30px;
    font-weight: bold;
    ${SansSerifFontFamily}
    &:hover{ text-shadow: 0 0 0.5vh white; }
`

const DragonSilverWrapper = styled.div`
    margin-left: 10px;
    margin-top: 0;
    display: flex;
`

const ClaimDragonSilverButtonWrapper = styled.div`
    margin-left: 1vh;
    margin-top: 0.3vh;
`

const DragonSilverIconContainer = styled.div`
    display: flex;
    margin-right: 40px;
    align-items: center;
    & > * {
        ${OswaldFontFamily}
        color: white;
        margin-left: 20px;
        font-size: 20px;
        border-weight: bold;
    }
`

const ImageWrapper = styled.div`
    display: block;
    width: 25px;
    height: 25px;
    position: relative;
`

const ToolTipDragonSilverToClaim = styled.span<{ $hover: boolean }>`
    position: absolute;
    color: #1e1e1e;
    font-size: 10px;
    text-align: center;
    background-color: white;
    padding: 3px;
    border-radius: 2px;
    bottom: -50px;
    left: -70%;
    width 60px;
    visibility: ${props => props.$hover ? "visible": "hidden"};
    opacity: ${props => props.$hover ? "1": "0"};
    transition: opacity 0.5s, visibility 0.5s;
    z-index: 10;
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
            <span>{dragonSilver}</span>
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
        </DragonSilverIconContainer>
    )
}


interface InventoryHeaderProps {
    className?: string,
}

const InventoryHeader = ({ className }: InventoryHeaderProps) =>
    <DragonSilverDisplayContainer className={className}>
        <BigHopsButton onClick={Transitions.onRecruitCharacter} text="Recruit" />
        <Push />
        <DragonSilverWrapper>
            <DragonSilverIcon
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver.png"
                dragonSilver={0}
                    tooltip="Claimable Dragon Silver"
                toClaim={false}
            />
        </DragonSilverWrapper>

        {/*
        <ClaimDragonSilverButtonWrapper>
            <DragonSilverIcon
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver_to_claim.png"
                dragonSilver={0}
                tooltip="Dragon Silver to Claim"
                toClaim={false}
            />
        </ClaimDragonSilverButtonWrapper>
        */}

        <CloseButton onClick={Transitions.onToggleInventory}>
            <span>X</span>
        </CloseButton>
    </DragonSilverDisplayContainer>

export default InventoryHeader
