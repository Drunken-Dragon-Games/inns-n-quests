import styled from "styled-components"
import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import HomePage from "./homePage/homePage"
import Footer from "../utils/footer/footer"
import { MessiriFontFamily, colors } from "../common"

const HomeComponent = styled.div`
    width: 100vw;
`

const ConcentPreferences = styled.a`
    ${MessiriFontFamily}
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 5px;
    background-color: ${colors.dduGold};
    border-radius: 5px;
    color: white;
    font-size: 10px;
    z-index: 4;
    cursor: pointer;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0px 0px 5px black;
`

const HomeApp = () =>
    <HomeComponent>
        <ConcentPreferences href="#" onClick={() => {
            //@ts-ignore
            window.displayPreferenceModal()
            return false
        }} id="termly-consent-preferences">Consent Preferences</ConcentPreferences>
        <LateralBar/>
        <NavBarApp />
        <HomePage />
        <Footer />
    </HomeComponent>

export default HomeApp