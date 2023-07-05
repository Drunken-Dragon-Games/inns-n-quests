import styled from "styled-components"
import { OswaldFontFamily, Push, colors } from "../../common"
import { LandingPageSection } from "./common"

const BannerContainer = styled(LandingPageSection)`
    width: 100vw;
    height: 1044px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid black;
    overflow: hidden;
    
    @media (max-width: 1024px) {
        height: auto;
        justify-content: normal;
    }
`

const ProductButtonContainer = styled.a<{ bg: string }>`
    position: relative;
    display: block;
    filter: drop-shadow(0px 0px 5px black);
    width: 375px;
    height: 210px;
    background-image: url(${props => props.bg});
    background-size: cover;
    border: 1px solid black;
    color: ${colors.dduGold};

    &:hover {
        cursor: pointer;
        border: 1px solid ${colors.dduGold};
        color: white;
    }
`

const ProductInfoWrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%);

    h2 {
        margin-top: auto;
        ${OswaldFontFamily}
        font-size: 20px;
        filter: drop-shadow(0px 0px 5px black);
    };

    h2:hover {
        color: white;
    };
`

const ProductButton = (props: { title: string, image: string, href: string, alt: string }) => 
    <ProductButtonContainer bg={props.image} href={props.href} target="_blank">
        <ProductInfoWrapper>
            <Push />
            <h2>{props.title}</h2>
        </ProductInfoWrapper>
    </ProductButtonContainer>

const ProductsSectionContainer = styled(LandingPageSection)`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    padding: 50px 0px;
    z-index: 2;

    @media (max-width: 820px) {
        flex-direction: column;
        gap: 10px;
        margin-top: 50px;
        padding: 50px 0 0 0;
    }
`

const ProductsSection = () => 
    <ProductsSectionContainer>
        <ProductButton 
            href="https://ddu.gg/s2"
            title="Start Collecting"
            image="https://cdn.ddu.gg/modules/landing/product-aot.png" 
            alt="Adventurers of Thiolden Collection Product" />
        <ProductButton 
            href="https://www.amazon.com/Drunken-Dragon-Universe-Queen-Lockbox-ebook/dp/B0C6FSFLMT/ref=sr_1_1?crid=2JE2TKN03ZPK4&keywords=drunken+dragon+the+dead+queen&qid=1688516012&sprefix=%2Caps%2C131&sr=8-1"
            title="Start Reading"
            image="https://cdn.ddu.gg/modules/landing/product-comic.png" 
            alt="The Dead Queen Comic Product" />
        <ProductButton 
            href="https://ddu.gg/inq"
            title="Start Playing"
            image="https://cdn.ddu.gg/modules/landing/product-inq.png" 
            alt="Inns & Quests Game Product" />
    </ProductsSectionContainer>

const BannerVideo = styled.div`
    width: 2400px;
    height: 1044px;
    filter: blur(5px);
    position: absolute;
    overflow: hidden;
    z-index: 0;
    left: 50%;
    transform: translateX(-50%);

    video {
        width: 2400px;
        height: 1044px;
        overflow: hidden;
    }
`

const BannerContent = styled.div`
    width: 100vw;
    height: 1044px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;

    @media (max-width: 1024px) {
        height: auto;
        margin-top: 150px;
    }

    @media (max-width: 820px) {
        margin-top: 100px;
    }
`

const BannerText = styled.div`
    width: 100%;
    max-width: 700px;

    @media (max-width: 1024px) {
        margin-top: 0px;
        max-width: 100%;
    }

    h1 {
        ${OswaldFontFamily}
        color: white;
        font-size: 60px;
        margin-top: 100px;
        margin-bottom: 30px;
        font-weight: bold;
        text-shadow: 0px 0px 10px black;

        @media (max-width: 1024px) {
            margin-top: 0px;
            font-size: 40px;
            padding-left: 20px;
        }

        @media (max-width: 820px) {
            font-size: 30px;
        }
    }
    p {
        width: 100%;
        max-width: 600px;
        ${OswaldFontFamily}
        color: #ebdec2;
        font-size: 26px;
        font-weight: bold;
        padding: 10px;
        text-shadow: 2px 0px 20px black;
        filter: drop-shadow(0 0 10px black);

        @media (max-width: 1024px) {
            font-size: 24px;
            padding-left: 20px;
        }

        @media (max-width: 820px) {
            font-size: 20px;
        }
    }
`

const BannerWhiteSpace = styled.div`
    width: 100%;
    max-width: 500px;
    height: 100%;

    @media (max-width: 1024px) {
        max-width: 200px; 
    }
    
    @media (max-width: 820px) {
        max-width: 50px;
    }
`

const Banner = (props: { title: string, subtext: string }) =>
    <BannerContainer>
        <BannerVideo>
            <video autoPlay muted loop>
                <source src="https://cdn.ddu.gg/modules/landing/banner.mp4" type="video/mp4" />
            </video>
        </BannerVideo>
        <BannerContent>
            <BannerText>
                <h1>{props.title}</h1>
                <p>{props.subtext}</p>
            </BannerText>
            <BannerWhiteSpace/>
        </BannerContent>
        <ProductsSection />
    </BannerContainer>

export default Banner
