import styled from "styled-components"
import { TextOswald } from "../../../components/basic_components"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"


const SocialMediaWrapper = styled.div`
    display: inline-block;
    height: 1.3vw;
    max-width: 12vw;  

    @media only screen and (max-width: 414px) {
        max-width: 50vw; 
    }
`

const Flex = styled.div`
    display: flex;
`

const IconWrapper = styled.div`
    width: 1.3vw;
    height: inherit;
    margin-right: 1.8vw;
    cursor: pointer;
    position: relative;
    @media only screen and (max-width: 414px) {
        width: 6vw;
        margin-right: 3vw;
    }
`


const TextWrapper = styled.div`
    margin: auto 0vw;  
    height: inherit; 
    cursor: pointer;
`

interface hover {
    hover: boolean
}

const IconWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
`

const IconWrapperRegular = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
    visibility: ${props => props.hover ? "hidden" : "visibility"};
`

interface SocialMedia{
    url: string
    children: string
    socialMedia: string
    isOpen: boolean
}

const SocialMedia = ({children, isOpen, url, socialMedia}: SocialMedia): JSX.Element =>{

    const [hover, setHover] = useState<boolean>(false)

    return(<>

        <SocialMediaWrapper>
            <Link href={url}>
                <a target="_blank">
                    <Flex>
                        <IconWrapper onMouseOver= { () => setHover(true) } onMouseLeave={ () => setHover(false) }> 
                            
                            <IconWrapperHover hover={hover}>
                                <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/social_media/${socialMedia}_hover.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                            </IconWrapperHover>

                            <IconWrapperRegular hover={hover}>
                                <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/social_media/${socialMedia}.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                            </IconWrapperRegular>
                            
                        </IconWrapper>

                        <TextWrapper onMouseOver= { () => setHover(true) } onMouseLeave={ () => setHover(false) }>
                            <TextOswald
                                fontsize={0.938}
                                color = { hover ? "#ffffff" : "#CA9F44" }
                                fontsizeMobile ={4}
                                lineHeightMobil = {5}
                            > {children} </TextOswald>
                        </TextWrapper>
                    </Flex>
                </a>
            </Link>               
        </SocialMediaWrapper>
       
         
    
    </>)
}

export default  SocialMedia