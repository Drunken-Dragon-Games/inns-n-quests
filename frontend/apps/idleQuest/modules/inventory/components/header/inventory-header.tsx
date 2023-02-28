import React from "react"
import styled from "styled-components"
import { Push, SansSerifFontFamily } from "../../../../common"
import Transitions from "../../inventory-transitions"
import BigHopsButton from "./big-hops-button"
import DragonSilverIcon from "./dragon-silver-icon"

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

interface InventoryHeaderProps {
    className?: string,
}

const InventoryHeader = ({ className }: InventoryHeaderProps) =>
    <DragonSilverDisplayContainer className={className}>
        <BigHopsButton onClick={Transitions.onRecruitAdventurer} text="Recruit" />
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
