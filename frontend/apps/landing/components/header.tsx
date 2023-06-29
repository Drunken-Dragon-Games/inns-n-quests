import Image from "next/image"
import styled from "styled-components"
import { LandingPageSection } from "./common"

const HeaderContainer = styled(LandingPageSection)`
    max-width: 2600px;
    position: fixed;
    padding: 20px;
    z-index: 10;
`

const HeaderContent = styled.div`
    width: calc(100% - 20px);
    border-radius: 10px;
    height: 100%;
    padding: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(202,198,190, 0.8);
    filter: drop-shadow(5px 0px 5px black);
`

const Header = () =>
    <HeaderContainer>
        <HeaderContent>
            <Image src="/landing/logo-universe-s.png" alt="Drunken Dragon Universe Logo" width="185" height="62" />
        </HeaderContent>
    </HeaderContainer>

export default Header
