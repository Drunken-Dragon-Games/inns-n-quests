import Image from "next/image"
import styled from "styled-components"
import { LandingPageSection } from "./common"
import { useWindowWidth } from "@react-hook/window-size"

const HeaderContainer = styled(LandingPageSection)`
    width: 100vw;
    max-width: 2600px;
    position: fixed;
    padding: 20px;
    z-index: 10;

    @media (max-width: 1024px) {
        position: absolute;
    }

    @media (max-width: 820px) {
        padding: 0px;
    }
`

const HeaderContent = styled.div`
    width: 100%;
    border-radius: 10px;
    height: 100%;
    padding: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(202,198,190, 0.8);
    filter: drop-shadow(5px 0px 5px black);

    @media (max-width: 820px) {
        width: 100%;    
        border-radius: 0px;
    }
`

const Header = () => {
    const windowWidth = useWindowWidth()
    const logoWidth = windowWidth > 1024 ? 185 : 185 * 0.7
    const logoHeight = windowWidth > 1024 ? 62 : 62 * 0.7
    return <HeaderContainer>
        <HeaderContent>
            <Image src="/landing/logo-universe-s.png" alt="Drunken Dragon Universe Logo" width={logoWidth} height={logoHeight} />
        </HeaderContent>
    </HeaderContainer>
}

export default Header
