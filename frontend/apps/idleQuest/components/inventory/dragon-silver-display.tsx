import Link from "next/link"
import React from "react"
import styled from "styled-components"
import { NoDragImage } from "../../../utils"
import { OswaldFontFamily, SansSerifFontFamily } from "../common-css"
import BigHopsButton from "./big-hops-button"
import DragonSilverIcon from "./dragon-silver-icon"

const DragonSilverDisplayContainer = styled.div`
    display: flex;
    padding: 0.8vmax 1vmax;
    width: 100%;
    background-color: rgba(20,20,20,0.5);
    display: flex-inline;
    align-items: right;
`

const Push = styled.div`
    flex: 1;
`

const BackLink = styled.div`
    cursor: pointer;
    color: white;
    font-size: 1.5vmax;
    font-weight: bold;
    ${SansSerifFontFamily}
    &:hover{ text-shadow: 0 0 0.5vmax white; }
`

const DragonSilverWrapper = styled.div`
    margin-left: 1vmax;
    margin-top: 0.3vmax;
    display: flex;
    
`

const ClaimDragonSilverButtonWrapper = styled.div`
    margin-left: 1vmax;
    margin-top: 0.3vmax;
`

const ReturnButton = React.forwardRef(() => 
    <NoDragImage
        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/logout.png"
        alt="Loagout icon"
        width={1.8}
        height={1.8}
    />
)

interface NavbarProps {
    dragonSilver: number,
    dragonSilverToClaim: number,
    onClickClose: () => void,
    onAdventurerRecruit: () => void
}

const DragonSilverDisplay = ({ dragonSilver, dragonSilverToClaim, onClickClose, onAdventurerRecruit }: NavbarProps) => {
    const returnLink = process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:3000/login"
    return (
        <DragonSilverDisplayContainer>
            <BigHopsButton onClick={onAdventurerRecruit} text="Recruit"/>
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

            <BackLink onClick={onClickClose}>
                <span>X</span>
            </BackLink>
        </DragonSilverDisplayContainer>
    )
}

export default DragonSilverDisplay