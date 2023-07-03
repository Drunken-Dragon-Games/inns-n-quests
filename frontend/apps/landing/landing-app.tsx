import styled from "styled-components"
import { colors } from "../common"
import Banner from "./components/banner"
import Header from "./components/header"
import { LeftLeaningSection, RightLeaningSection } from "./components/info-sections"
import FollowSection from "./components/follow-section"
import CardsSection from "./components/cards-section"
import ComicSection from "./components/comic-section"

const bannerInfo = {
    title: "Unleashing Creativity Into An Epic Universe, Together",
    subtext: "The Drunken Dragon Universe is a decentralized fantasy franchise for indie creators, passionate fans, and visionaries, built with the tools and technologies required to revolutionize the entertainment industry and finally bring freedom to creativity, collaboration and storytelling."
}

const s1 = {
    title: "Open Epic Fantasy Franchise, Shaped by the Community, for the Future of Creative Freedom",
    content: [
        "We champion indie creators. All Drunken Dragon Universe general IP is under creative commons. All characters, storylines, and places can be used without asking for permission. And individual products can still be protected.",
    ],
    image: "/landing/section-1.png",
    borderColor: "#be8d5b"
}

const s2 = {
    title: "Decentralized Governance",
    content: [
        "We are establishing a system that allows fans and creators to vote on crucial aspects, such as deciding which products become official, allocating shared resources, and determining the future direction of the franchise. No single party should have control over it, that is why we chose Cardano blockchain technology to develop governance that serves us all."
    ],
    image: "/landing/section-2.png",
    borderColor: "#b3cafe"
}

const s3 = {
    title: "A Marketplace for all Official Products",
    content: [
        "We aim to construct a decentralized marketplace where official products approved by the community, such as comics, art, games, and more, can be sold in a single location for fans to discover. Then, the marketplace commissions finance new projects voted by the community, creating new opportunities in an ever-growing epic fantasy universe."
    ],
    image: "/landing/section-3.png",
    borderColor: "#353535"
}

const gameSection = {
    title: "Open An Inn For Your Adventurers And Go On a Quest",
    content: [
        ""
    ],
    image: "/landing/section-game.png",
    borderColor: "#ffc500",
    link: {
        href: "",
        text: "Play Now"
    }
}

const LandingAppContainer = styled.div`
    background-color: ${colors.dduBackground};
    width: 100vw;
    display: flex;
    flex-direction: column;
    #justify-content: center;
    align-items: center;
    overflow-x: hidden;
    gap: 3px;

    @media only screen and (max-width: 414px) {
        padding-top: 16vh;
    }
`
const LandingApp = () => 
    <LandingAppContainer>
        <Header />
        <Banner {...bannerInfo} />
        <LeftLeaningSection {...s1} />
        <RightLeaningSection {...s2} />
        <LeftLeaningSection {...s3} />
        <FollowSection />
        <RightLeaningSection {...gameSection} />
        <CardsSection />
        <ComicSection />
    </LandingAppContainer>

export default LandingApp
