import Image from "next/image"
import styled from "styled-components"
import { MessiriFontFamily, colors } from "../../common"
import { LandingPageSection } from "./common"

const FollowSectionContainer = styled(LandingPageSection)`
    height: 100px;
`

const Background = styled.div`
    background-image: url(https://cdn.ddu.gg/modules/landing/section-follow.png);
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    border: 1px solid #461d0a;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        filter: drop-shadow(0px 0px 5px black);
    }
    a:hover {
        filter: drop-shadow(0px 0px 5px white);
    }

    a > h2 {
        padding-top: 5px;
        ${MessiriFontFamily}
        font-size: 30px;
        color: ${colors.dduGold};
        font-weight: bold;
    }
`

const SocialMediaWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`

const WhitepaperSection = () =>
    <FollowSectionContainer>
        <Background>
            <a href="https://www.drunkendragon.games/assets/pdf/Drunken_Dragon_Universe__a_Decentralized_Intellectual_Property_and_Fantasy_Franchise.pdf" target="_blank">
            <h2>READ WHITE PAPER</h2>
            <SocialMediaWrapper>
                    <Image src="https://cdn.ddu.gg/modules/landing/pdf-icon.png" width={50} height={50} />
            </SocialMediaWrapper>
            </a>
        </Background>
    </FollowSectionContainer>

export default WhitepaperSection 
