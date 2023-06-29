import styled from "styled-components"
import { colors } from "../common"
import Banner from "./components/banner"
import Header from "./components/header"
import { LeftLeaningSection, RightLeaningSection } from "./components/info-sections"

const bannerInfo = {
    title: "Unleashing Creativity Into An Epic Universe, Together",
    subtext: "The Drunken Dragon Universe is a decentralized fantasy franchise for indie creators, passionate fans, and visionaries, built with the tools and technologies required to revolutionize the entertainment industry and finally bring freedom to creativity, collaboration and storytelling."
}

const s1 = {
    title: "Open Epic Fantasy Franchise, Shaped by the Community, for the Future of Creative Freedom",
    content: [
        "We champion indie creators, offering them an expansive realm of open intellectual property on an epic fantasy universe. We don't just hear our fantasy fans; we value their insights and let them wield influence. This collaborative synergy is the cornerstone of a unique fantasy franchise that has never been seen before.",
        "Welcome to The Drunken Dragon Universe - a shared realm of epic fantasy to shape and enjoy together. Where every voice matters, every idea counts, and every dream adds to the collective narrative."
    ]
}

const s2 = {
    title: "Open Intellectual Property",
    content: [
        "We believe in the power of the emergent properties of a community based on creativity, freedom and love for fantasy; this is why the general intellectual property (IP) elements of the Drunken Dragon Universe are under creative commons. All characters, storylines, and places can be used by creators worldwide without asking for permission. However, individual products can still be protected to safeguard the interests of their creators."
    ]
}

const s3 = {
    title: "Decentralized Governance",
    content: [
        "We are establishing decentralised governance that allows fans and creators to vote on crucial aspects, such as deciding which products become official, allocating shared resources, and determining the future direction of the franchise; this is of such importance that no single party should have control over it, that is why we chose blockchain technology to develop governance that serves us all."
    ]
}

const s4 = {
    title: "A Marketplace for all Official Products",
    content: [
        "We aim to construct a decentralized marketplace where approved products, such as comics, art, games, and more, can be sold in a single location for fans to discover. Then, the marketplace commissions finance new projects voted by the community, creating new opportunities in an ever-growing epic fantasy universe."
    ]
}

const LandingAppContainer = styled.div`
    background-color: ${colors.dduBackground};
    width: 100vw;
    display: flex;
    flex-direction: column;
    #justify-content: center;
    align-items: center;
    overflow-x: hidden;

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
        <RightLeaningSection {...s4} />
    </LandingAppContainer>

export default LandingApp
