import Image from "next/image"
import styled from "styled-components"
import { MessiriFontFamily, OswaldFontFamily, colors } from "../common"
import Link from "next/link"

const LandingAppContainer = styled.div`
    background-color: #eee;
    width: 100vw;

    @media only screen and (max-width: 414px) {
        padding-top: 16vh;
    }
`

const HeaderContainer = styled.header`
    width: 100vw;
    padding: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Header = () =>
    <HeaderContainer>
        <Image src="/landing/logo-universe-s.png" alt="Drunken Dragon Universe Logo" width="185" height="62" />
    </HeaderContainer>

const BannerContainer = styled.section`
    background-color: #0B1015;
    width: 100vw;
    padding: 50px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const BannerText = styled.div`
    width: 100%;
    max-width: 600px;

    h1 {
        ${OswaldFontFamily}
        color: ${colors.dduGold};
        color: white;
        font-size: 60px;
        margin-top: 100px;
        margin-bottom: 30px;
    }
    p {
        width: 100%;
        max-width: 450px;
        ${MessiriFontFamily}
        color: white;
        font-size: 18px;
    }
`

const BannerWhiteSpace = styled.div`
    width: 100%;
    max-width: 500px;
    height: 100%;
`

const Banner = () =>
    <BannerContainer>
        <BannerText>
            <h1>Unleashing Creativity Into An Epic Universe, Together</h1>
            <p>The Drunken Dragon Universe is a decentralized fantasy franchise for indie creators, passionate fans, and visionaries, built with the tools and technologies required to revolutionize the entertainment industry and finally bring freedom to creativity and storytelling.</p>
        </BannerText>
        <BannerWhiteSpace/>
    </BannerContainer>

const ProductButtonContainer = styled.div`
    padding: 20px;
    display: flex;
    gap: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const ProductInfoWrapper = styled.div<{ ptype: string }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
        ${MessiriFontFamily}
        color: ${colors.dduBackground};
        font-size: 30px;
        margin-bottom: 10px;
    }
    p {
        ${OswaldFontFamily}
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        background-color: ${ props => props.ptype === "collection" ? colors.dduGold : props.ptype === "comic" ? "red" : "green" };
        padding: 3px 15px;
        border-radius: 20px;
    }
`

const ProductImage = styled.div`
    border-radius: 10px;
    overflow: hidden;
    filter: drop-shadow(0px 0px 5px black);
`

const ProductButton = (props: { title: string, ptype: string, src: string, alt: string }) => 
    <ProductButtonContainer>
        <ProductImage>
            <Image src={props.src} alt={props.alt} width="250" height="150" />
        </ProductImage>
        <ProductInfoWrapper ptype={props.ptype}>
            <h2>{props.title}</h2>
            <p>{props.ptype}</p>
        </ProductInfoWrapper>
    </ProductButtonContainer>

const ProductsSectionContainer = styled.section`
    background-color: #eee;
    width: 100vw;
    padding: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
`

const ProductsSection = () => 
    <ProductsSectionContainer>
        <ProductButton 
            title="Adventurers of Thiolden"
            ptype="collection"
            src="/landing/product-aot.png" 
            alt="Adventurers of Thiolden Collection Product" />
        <ProductButton 
            title="The Dead Queen"
            ptype="comic"
            src="/landing/product-comic.png" 
            alt="The Dead Queen Comic Product" />
        <ProductButton 
            title="Inns & Quests"
            ptype="game"
            src="/landing/product-inq.png" 
            alt="Inns & Quests Game Product" />
    </ProductsSectionContainer>

const SectionContainer = styled.section`
    background-color: #eee;
    width: 100vw;
    height: 500px;
    display: flex;
    justify-content: center;
    padding: 50px 0px;
`

const SectionTitleWrapper = styled.div`
    width: 100%;
    max-width: 590px;
    padding: 20px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 50px;

    h3 {
        display: block;
        ${OswaldFontFamily}
        color: ${colors.dduBackground};
        font-size: 36px;
        width: 100%;
        text-align: center;
    }
`

const SectionDescriptionWrapper = styled.div`
    width: 100%;
    max-width: 590px;
    padding: 20px;
    
    p {
        ${MessiriFontFamily}
        color: ${colors.dduBackground};
        font-size: 18px;
        width: 100%;
        margin-bottom: 20px;
    }
`

const SectionTitle = (props: { title: string }) =>
    <SectionTitleWrapper>
        <h3>{props.title}</h3>
        <Image src="/landing/decoration.png" width="100" height="50" />
    </SectionTitleWrapper>

const SectionDescription = (props: { content: string[] }) =>
    <SectionDescriptionWrapper>
        { props.content.map((c, i) => <p key={i}>{c}</p>) }
    </SectionDescriptionWrapper>

const LeftLeaningSection = (props: { title: string, content: string[] }) =>
    <SectionContainer>
        <SectionTitle title={props.title} />
        <SectionDescription content={props.content} />
    </SectionContainer>

const RightLeaningSection = (props: { title: string, content: string[] }) =>
    <SectionContainer>
        <SectionDescription content={props.content} />
        <SectionTitle title={props.title} />
    </SectionContainer>

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

const LandingApp = () => 
    <LandingAppContainer>
        <Header />
        <Banner />
        <ProductsSection />
        <LeftLeaningSection {...s1} />
        <RightLeaningSection {...s2} />
        <LeftLeaningSection {...s3} />
        <RightLeaningSection {...s4} />
    </LandingAppContainer>

export default LandingApp
