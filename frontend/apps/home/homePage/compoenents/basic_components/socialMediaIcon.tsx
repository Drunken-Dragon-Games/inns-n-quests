import styled from "styled-components"
import Image from "next/image"
import { useState } from "react"
import { LinkDisable } from "../../../../utils/components/basic_components"

const IconContainer = styled.div`
    width: 3vw;
    height: 3vw;
    max-width: 76.8px;
    max-height: 76.8px;
    cursor: pointer;
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 5.5vw;
        height: 5.5vw;
    }
`

interface hover {
    hover: boolean
}
const ImageWrapper = styled.div<hover>`
    width: inherit;
    height: inherit;
    max-width: 76.8px;
    max-height: 76.8px;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "hidden" : "visibility"};
`

const ImageWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    max-width: 76.8px;
    max-height: 76.8px;
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
            <LinkDisable url={url}>
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

export default SocialMediaIcon
