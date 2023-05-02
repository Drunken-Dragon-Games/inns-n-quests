import styled from "styled-components"
import TavernSection from "./compoenents/complex/tavernSection"
import { BannerSection, IdleQuestsSection, DeadQueenSection, CollectionsSection, SocialMediaSection, RoadMapSection } from "./compoenents/complex"
import { AccountApi, DashboardView } from "../../account"
import { GamesButton } from "../../utils/navBar/basic_components"
import { gamesButtonSection } from "../../../setting"
import CookieConsentBanner from "../../common/components/cookie-consent-component"
import BuySlimeSection from "./compoenents/complex/buySlimeSection"
import { colors } from "../../common"

const HomePageComponent = styled.section`
    background-color: #0B1015;
    width: 100vw;

    @media only screen and (max-width: 414px) {
        padding-top: 16vh;
    }
`

const HomePage = (): JSX.Element => {
    const signedin = AccountApi.signed()
    return (
        <>
            <HomePageComponent>
                <DashboardView /> 
                <BannerSection />
                <SocialMediaSection />
                {/* <RoadMapSection/> */}
                <TavernSection />
                <IdleQuestsSection />
                <BuySlimeSection />
                <CollectionsSection />
                <DeadQueenSection />
            </HomePageComponent>
            <CookieConsentBanner />
        </>
    )
}

export default HomePage