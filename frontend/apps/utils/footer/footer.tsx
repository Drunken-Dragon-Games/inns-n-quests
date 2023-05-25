import styled from "styled-components"
import Image from "next/image"
import { LinkDisable, TextElMessiri } from "../components/basic_components"
import { useState } from "react"
import { socialMedia } from "../../../setting"
import { MessiriFontFamily } from "../../common"

const IconContainer = styled.div`
    width: 2vw;
    height: 2vw;
    cursor: pointer;
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 5vw;
        height: 5vw;
    }
`
interface hover {
    hover: boolean
}

const ImageWrapper = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "hidden" : "visibility"};
`

const ImageWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "visibility" : "hidden"};
`

interface SocialMediaIcon{
    socialMedia: string
    url: string
}

const SocialMediaIcon = ({socialMedia, url}:SocialMediaIcon) : JSX.Element => {

    const [hover, setHover] = useState<boolean>(false)

    return (<>
            <LinkDisable url={url} openExternal={true}>
                <IconContainer onMouseOver={ () => setHover(true)} onMouseLeave = { () => setHover(false)}>

                    <ImageWrapper hover = {hover}>
                        <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/social_media/${socialMedia}.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                    </ImageWrapper>

                    <ImageWrapperHover hover = {hover}>
                        <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/social_media/${socialMedia}_hover.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                    </ImageWrapperHover>
                </IconContainer>
        
            </LinkDisable>
            
    </>)

}
const FooterContent = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;

    @media only screen and (max-width: 414px) {
        margin-top: 20vw;
    }
`

const FooterImageContainer = styled.div`
    width: 15.625vw;
    height: 15.625vw;
    max-width: 400px;
    max-height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    @media only screen and (max-width: 414px) {
        width: 30%;
        height: auto;
        top: 0;
    }
`

const FooterTextContainer = styled.div`
    position: absolute;
    bottom: 13%;
    left: 50%;
    transform: translateX(-50%);

    @media only screen and (max-width: 414px) {
        width: 100%;
        bottom: 45%
    }    
`

const FooterContentComponent = ():JSX.Element => {
    return (<FooterContent>
        <FooterImageContainer>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/drunken-dragon-coin.png"
                width={1}
                height={1}
                layout="responsive"
            />
        </FooterImageContainer>
        <FooterTextContainer>
            <TextElMessiri textAlign="center" fontsize={1} color="white" fontsizeMobile={2.5}>Drunken Dragon Entertainment (c) 2023 | All rights reserved</TextElMessiri>
        </FooterTextContainer>
    </FooterContent>)
}

const FooterBackgroundWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`

const FooterBackgroundComponent = ():JSX.Element => {
    return (<FooterBackgroundWrapper>
        <Image
            src={"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/footer-background.png"}
            layout="fill"
        />
    </FooterBackgroundWrapper>)
}

const SocialMediaFooterWrapper = styled.div`
    height: 3.802vw;
    width: 48.125vw;
    position: relative;
    display: flex;

    @media only screen and (max-width: 414px) {
        height: 6.330vw;
        width: 90.125vw;
    }
`

const SocialMediaOrnament = styled.div`
    width: inherit;
    height: inherit;
    position: absolute;
    top: 0vw;

`

const CenterMedia = styled.div`
    margin: auto;
    display: flex;
`

const Splitter = styled.div`
    width: 2vw;
    height: 2vw;
    margin: 0vw 2vw;

    @media only screen and (max-width: 414px) {
        width: 5vw;
        height: 5vw;
    }
`

const Flex = styled.div`
    display: flex;
`

const SocialMediaFooter = () : JSX.Element => {
    return(<>
        <SocialMediaFooterWrapper>
            <SocialMediaOrnament>
                <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/footer/footer_social_media.svg" alt ="social media container footer drunken dragon " height={73} width ={924} layout="responsive" />
            </SocialMediaOrnament>
            <CenterMedia>
            { socialMedia.map((el, index )=> {

                if(index == (socialMedia.length-1)){
                    return <SocialMediaIcon socialMedia = {el.icon} url={el.url}  key ={el.name}/>
                }

                return (<Flex key ={el.name}>

                        <SocialMediaIcon socialMedia = {el.icon} url={el.url} />
                        <Splitter>
                            <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/social_media/spliter.svg" layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                        </Splitter>
                </Flex>)

            })}
            </CenterMedia>
        </SocialMediaFooterWrapper>
    </>)
}

const Footer = styled.section`
    width: 100%;
    height: 42.396vw;
    max-height: 1085.338px;
    position: relative;
    background-color: #0B1015;
`

const SocialMediaContainer = styled.div`
    position: absolute;
    z-index: 1;
    display: flex;
    width: 100%;
  
    top: -1.7vw;

    @media only screen and (max-width: 414px) {
        top: 30vw;
    }
`

const Center = styled.div`
    margin: auto;
`

const Legal = styled.div`
    padding: 1vw;
    text-align: center;
    font-size: 12px;
    ${MessiriFontFamily}
    color: white;
    & > a {
        text-decoration: underline;
    }
`

const FooterComponent = ():JSX.Element => {
    return (
            <Footer>

                <SocialMediaContainer>
                    <Center>
                        <SocialMediaFooter/>
                    </Center>   
                </SocialMediaContainer>
               
                <FooterBackgroundComponent/>
                <FooterContentComponent/>

                <Legal>
                    <a href="https://app.termly.io/document/terms-of-service/3259c3d1-0941-4deb-9938-a66cabf5f9ae" target="_blank">Terms of Service</a> / 
                    <a href="https://app.termly.io/document/privacy-policy/4d95b343-9684-44c3-94cb-88a038c68b01" target="_blank"> Privacy Policy</a> 
                </Legal>
            </Footer>
    )
}

export default FooterComponent