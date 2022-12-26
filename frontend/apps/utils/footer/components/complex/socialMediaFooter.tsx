import styled from "styled-components"
import Image from "next/image"
import { socialMedia } from "../../../../../setting"
import { SocialMediaIcon } from "../basic_components"
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

const Center = styled.div`
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
            <Center>
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
            </Center>
        </SocialMediaFooterWrapper>
    </>)
}

export default SocialMediaFooter