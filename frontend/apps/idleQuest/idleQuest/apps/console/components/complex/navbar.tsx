import Image from "next/image"
import styled from "styled-components";
import { DragonSilverIcon } from "../basic_components";
import { LinkDisable } from "../../../../../../utils/components/basic_components";

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

const Navbar = ({ dragonSilver, dragonSilverToClaim }: NavbarProps) =>
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
                <ImageWrapper>
                    <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/logout.png" alt="Loagout icon" width={30} height={30} />
                </ImageWrapper>
            </LinkDisable>
        </BackWrapper>
    </NavbarContainer>

export default Navbar