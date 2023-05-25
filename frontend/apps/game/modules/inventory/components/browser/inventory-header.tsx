import Image from "next/image"
import React, { useState } from "react"
import styled from "styled-components"
import { AnimatedNumberMedal, If, NoDragImage, OswaldFontFamily, Push, px1, SansSerifFontFamily } from "../../../../../common"
import Transitions from "../../inventory-transitions"
import { useSelector } from "react-redux"
import { InventoryState } from "../../inventory-state"

const DragonSilverDisplayContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: rgba(20,20,20,0.5);
    align-items: center;

    color: white;
    ${OswaldFontFamily}
    font-size: 20px;
`

const CloseButton = styled.div`
    cursor: pointer;
    color: white;
    font-size: 30px;
    font-weight: bold;
    ${SansSerifFontFamily}
    &:hover{ text-shadow: 0 0 0.5vh white; }
`

const DragonSilverMedal = styled(AnimatedNumberMedal)`
    gap: 10px;
    margin-right: 30px;
    background-color: rgba(20,20,20,0.8);
    padding: 3px 20px;
    border-radius: 20px;
    filter: drop-shadow(0px 0px 5px black);
`

interface InventoryHeaderProps {
    className?: string,
}

const InventoryHeader = ({ className }: InventoryHeaderProps) => {
    const dragonSilver = useSelector((state: InventoryState) => state.dragonSilver)
    return (
        <DragonSilverDisplayContainer className={className}>
            {/*<BigHopsButton onClick={Transitions.onRecruitCharacter} text="Recruit" />*/}
            <Push />
            <DragonSilverMedal amount={dragonSilver} animate>
                <NoDragImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver.png"
                    alt="Claimable Dragon Silver"
                    width={25}
                    height={25}
                    units={px1}
                />
            </DragonSilverMedal>

            <CloseButton onClick={Transitions.onToggleInventory}>
                <span>X</span>
            </CloseButton>
        </DragonSilverDisplayContainer>
    )
}

export default InventoryHeader
