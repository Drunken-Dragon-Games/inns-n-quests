import React from "react"
import styled from "styled-components"
import { Push } from "../../utils"
import { SansSerifFontFamily } from "../common-css"
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

interface DragonSilverDisplayProps {
    className?: string,
    dragonSilver: number,
    dragonSilverToClaim: number,
    onClickClose: () => void,
    onAdventurerRecruit: () => void
}

const DragonSilverDisplay = ({ className, dragonSilver, dragonSilverToClaim, onClickClose, onAdventurerRecruit }: DragonSilverDisplayProps) =>
    <DragonSilverDisplayContainer className={className}>
        <BigHopsButton onClick={onAdventurerRecruit} text="Recruit" />
        <Push />
        <DragonSilverWrapper>
            <DragonSilverIcon
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver.png"
                dragonSilver={dragonSilver}
                tooltip="Dragon Silver"
                toClaim={false}
            />
        </DragonSilverWrapper>

        <ClaimDragonSilverButtonWrapper>
            <DragonSilverIcon
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver_to_claim.png"
                dragonSilver={dragonSilverToClaim}
                tooltip="Dragon Silver to Claim"
                toClaim={false}
            />
        </ClaimDragonSilverButtonWrapper>

        <CloseButton onClick={onClickClose}>
            <span>X</span>
        </CloseButton>
    </DragonSilverDisplayContainer>

export default DragonSilverDisplay