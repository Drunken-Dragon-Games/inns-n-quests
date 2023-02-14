import Link from "next/link"
import React from "react"
import styled from "styled-components"
import { NoDragImage } from "../../../utils"
import DragonSilverIcon from "./dragon-silver-icon"

const NavbarContainer = styled.div`
    display: flex;
    padding: 0.8vmax 1vmax;
`

const BackLink = styled.div`
    cursor: pointer;
    &:hover{ opacity: 0.5; }
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
}

const DragonSilverDisplay = ({ dragonSilver, dragonSilverToClaim }: NavbarProps) => {
    const returnLink = process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:3000/login"
    return (
        <NavbarContainer>
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

            <BackLink>
                <Link href={returnLink} passHref><ReturnButton /></Link>
            </BackLink>
        </NavbarContainer>
    )
}

export default DragonSilverDisplay