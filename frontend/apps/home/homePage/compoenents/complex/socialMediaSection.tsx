import styled from "styled-components"
import{ socialMedia } from "../../../../../setting"
import { SocialMediaIcon } from "../basic_components"
import Image from "next/image"

const SocialMediaSectionContainer = styled.section`
    display: flex;
    width: 100vw;
    height: 6vw;
    margin-top: 1vw;
    
    
    @media only screen and (max-width: 414px) {
        height: 15vw;
        margin-top: 8vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-top: 5vw;
    }
`

const Center = styled.div`
    margin: auto;
    display: flex;
`

const Splitter = styled.div`
    width: 3.5vw;
    height: 3.5vw;
    max-width: 89.6px;
    max-height: 89.6px;
    margin: 0vw 2vw;

    @media only screen and (max-width: 414px) {
        width: 6vw;
        height: 6vw;
    }
`

const Flex = styled.div`
    display: flex;
`

const SocialMediaSection = () : JSX.Element =>{
    return (<>
            <SocialMediaSectionContainer>
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
            </SocialMediaSectionContainer>
    </>)
}

export default SocialMediaSection