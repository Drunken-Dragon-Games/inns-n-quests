import styled from "styled-components"
import TavernSection from "./compoenents/complex/tavernSection"
import { BannerSection, IdleQuestsSection, DeadQueenSection, CollectionsSection, SocialMediaSection, RoadMapSection } from "./compoenents/complex"

const HomePageComponent = styled.section`
    background-color: #0B1015;
    width: 100vw;

    @media only screen and (max-width: 414px) {
        padding-top: 16vh;
    }
`

const HomePage = (): JSX.Element =>
    <HomePageComponent>
        <BannerSection />
        <SocialMediaSection />
        {/* <RoadMapSection/> */}
        <TavernSection />
        <IdleQuestsSection />
        <CollectionsSection />
        <DeadQueenSection />
    </HomePageComponent>

export default HomePage