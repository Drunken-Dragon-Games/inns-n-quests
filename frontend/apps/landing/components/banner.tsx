import Image from "next/image"
import styled from "styled-components"
import { OswaldFontFamily, MessiriFontFamily, colors } from "../../common"
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

const ProductButtonContainer = styled.div`
    position: relative;
    filter: drop-shadow(0px 0px 5px black);
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
    position: absolute;
`

const ProductButton = (props: { title: string, ptype: string, src: string, alt: string }) => 
    <ProductButtonContainer>
        <ProductImage>
            <Image src={props.src} alt={props.alt} width="250" height="150" />
        </ProductImage>
        <ProductInfoWrapper ptype={props.ptype}>
            <h2>{props.title}</h2>
            {/*<p>{props.ptype}</p>*/}
        </ProductInfoWrapper>
    </ProductButtonContainer>

const ProductsSectionContainer = styled.section`
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
            title="Start Collecting"
            ptype="collection"
            src="/landing/product-aot.png" 
            alt="Adventurers of Thiolden Collection Product" />
        <ProductButton 
            title="Start Reading"
            ptype="comic"
            src="/landing/product-comic.png" 
            alt="The Dead Queen Comic Product" />
        <ProductButton 
            title="Start Playing"
            ptype="game"
            src="/landing/product-inq.png" 
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
