import styled from "styled-components"
import { OswaldFontFamily, MessiriFontFamily, colors, Push } from "../../common"
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
`

const ProductButtonContainer = styled.div<{ bg: string }>`
    position: relative;
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

const ProductButton = (props: { title: string, image: string, alt: string }) => 
    <ProductButtonContainer bg={props.image}>
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
`

const ProductsSection = () => 
    <ProductsSectionContainer>
        <ProductButton 
            title="Start Collecting"
            image="/landing/product-aot.png" 
            alt="Adventurers of Thiolden Collection Product" />
        <ProductButton 
            title="Start Reading"
            image="/landing/product-comic.png" 
            alt="The Dead Queen Comic Product" />
        <ProductButton 
            title="Start Playing"
            image="/landing/product-inq.png" 
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
`

const BannerText = styled.div`
    width: 100%;
    max-width: 700px;

    h1 {
        ${OswaldFontFamily}
        color: white;
        font-size: 60px;
        margin-top: 100px;
        margin-bottom: 30px;
        font-weight: bold;
        text-shadow: 0px 0px 10px black;
    }
    p {
        width: 100%;
        max-width: 600px;
        #${MessiriFontFamily}
        ${OswaldFontFamily}
        #color: ${colors.dduGold};
        color: #ebdec2;
        font-size: 26px;
        font-weight: bold;
        padding: 10px;
        text-shadow: 2px 0px 20px black;
        filter: drop-shadow(0 0 10px black);
    }
`

const BannerWhiteSpace = styled.div`
    width: 100%;
    max-width: 500px;
    height: 100%;
`

const Banner = (props: { title: string, subtext: string }) =>
    <BannerContainer>
        <BannerVideo>
            <video autoPlay muted loop>
                <source src="/landing/banner.mp4" type="video/mp4" />
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
