import styled from "styled-components";
import { DragonSilverIcon } from "../basic_components";
import { LinkDisable } from "../../../../../../utils/components/basic_components";
import { NoDragImage } from "../../../../../../utils";

const NavbarContainer = styled.div`
    display: flex;
    padding: 0.8vmax 1vmax;
`

const ImageWrapper = styled.div`
    display: block;
    height: 1.5vmax !important;
    position: relative;
    img{
        width: 1.5vmax !important;
        height: 1.5vmax !important;
    }
`

const BackWrapper = styled.div`
    margin-left: auto;
    cursor: pointer;

    background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/back.png");
    &:hover{
        opacity: 0.5;
    }
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

interface NavbarProps {
    dragonSilver: number,
    dragonSilverToClaim: number,
}

const DragonSilverDisplay = ({ dragonSilver, dragonSilverToClaim }: NavbarProps) =>
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

        <BackWrapper>
            <LinkDisable url={`${process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:3000/login"}`}>
                <NoDragImage 
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/logout.png" 
                    alt="Loagout icon" 
                    width={1.8} 
                    height={1.8} 
                />
            </LinkDisable>
        </BackWrapper>
    </NavbarContainer>

export default DragonSilverDisplay