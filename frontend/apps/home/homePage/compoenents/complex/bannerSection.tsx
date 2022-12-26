import styled from "styled-components"
import { SimpleSlider } from "../../../../utils/components/basic_components"
import { BannerCard, BannerCardMobile } from "../basic_components"
import Image from "next/image"
import { Button, LinkDisable, SimpleButton } from "../../../../utils/components/basic_components"

const BannerSectionComponent = styled.section`
    width: 100vw;
    padding: 5vw 8.2vw 5vw 11.8vw;
    @media only screen and (max-width: 414px) {
        padding: 0vw;
    }

    @media only screen and (min-width: 2560px) {
        padding:  0vw;
        display: flex;
        margin-top: 5vw; 
    }
`

const PositionRelative = styled.div`
    position: relative;
    margin: auto;
`

const Banner = styled.div`
    width: 80vw;
    height: 28.4vw;
    max-width: 2048px;
    max-height: 727.04px;
    
    border: 0.2vw solid #cbc7bf;
    padding: 0vw 0vw 0vw 0.08vw;
    position: relative;

    .slick-dots{

        button::before{
            color: white !important;

        }

        .slick-active{
            button::before{
                color: #E6C982 !important;
            }
            
        }
    }

    @media only screen and (max-width: 414px) {
        display: none;
    }

  
`
const BannerMobile = styled.div`
    display: none;

    @media only screen and (max-width: 414px) {
        width: 100vw;
        height: 160vw;
        display: block;
    }
`


const CornerOrnament = styled.div`
    position: absolute;
    width: 2.2vw;
    height: 2.2vw;
    top:-0.7vw;
    z-index: 1;
    right: -0.7vw;
`

const ButtonPosition = styled.div`
    position: absolute;
    bottom: -2.3vw;
    right: 14.2vw;
    z-index: 4;

    @media only screen and (max-width: 414px) {
        right: 16vw;
        bottom: 2.5vw;
    }

    @media only screen and (min-width: 2560px) {
        right: 360px;
        bottom: -60px;
    }
`
const BannerSection = (): JSX.Element => {
   
    return(<>
            <BannerSectionComponent>
                <PositionRelative>
                <Banner>  
                    <CornerOrnament>
                        <Image src ="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/banner_ornament.svg" alt = "drunken dragon ornament" width = {100} height = {100} layout ="responsive"/>
                    </CornerOrnament>
                    
                    <SimpleSlider>
                        <BannerCard src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/banner.png"/>
                    </SimpleSlider>
                </Banner>

                <BannerMobile>
                    <BannerCardMobile/>
                </BannerMobile>

                <ButtonPosition>
                    <LinkDisable url="https://www.jpg.store/collection/drunkendragon?tab=minting" openExternal = {true}>
                        <Button size="big"  action={() => null}>Mint Now</Button>
                    </LinkDisable>
                </ButtonPosition>
                </PositionRelative>
            </BannerSectionComponent>
    </>)
}

export default BannerSection