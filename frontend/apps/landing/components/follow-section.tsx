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
    gap: 30px;

    h2 {
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

    a {
        filter: drop-shadow(0px 0px 5px black);
    }
    a:hover {
        filter: brightness(0) invert(1);
    }
`

const FollowSection = () =>
    <FollowSectionContainer>
        <Background>
            <h2>FOLLOW</h2>
            <SocialMediaWrapper>
                <a href="https://discord.com/invite/cY5ePtVJ57" target="_blank">
                    <Image src="https://cdn.ddu.gg/modules/ddu-app/utils/social_media/discord.svg" width={30} height={30} />
                </a>
                <a href="https://twitter.com/DrunkenDragnEnt" target="_blank">
                    <Image src="https://cdn.ddu.gg/modules/ddu-app/utils/social_media/twitter.svg" width={30} height={30} />
                </a>
                <a href="https://www.instagram.com/drunkendragonentertainment/" target="_blank">
                    <Image src="https://cdn.ddu.gg/modules/ddu-app/utils/social_media/instagram.svg" width={30} height={30} />
                </a>
                <a href="https://www.reddit.com/r/DrunkenDragonGames/" target="_blank">
                    <Image src="https://cdn.ddu.gg/modules/ddu-app/utils/social_media/reddit.svg" width={30} height={30} />
                </a>
                <a href="https://www.facebook.com/DrunkenDragonEntertainment" target="_blank">
                    <Image src="https://cdn.ddu.gg/modules/ddu-app/utils/social_media/facebook.svg" width={30} height={30} />
                </a>
            </SocialMediaWrapper>
        </Background>
    </FollowSectionContainer>

export default FollowSection
