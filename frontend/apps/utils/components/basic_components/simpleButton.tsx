import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri } from "."
import { useState } from "react"

const SimpleButtonComponent = styled.div`
    width: 13.021vw;
    height: 3.487vw;
    max-width: 333.338px;
    max-height: 89.267px;
    position: relative;
    cursor: pointer;

    @media only screen and (max-width: 414px) {
        width: 50vw;
        height: 13vw;
       
    }
`

const TextWrapper = styled.div`
    position: absolute;
    top: 0vw;
    width: inherit;
    height: inherit;
    max-width: 333.338px;
    max-height: 89.267px;
    display: flex;
    padding-top: 0.3vw;

    @media only screen and (max-width: 414px) {
        padding-top: 1.3vw;
    }
`

const Center = styled.div`
    margin: auto;
`

interface hover {
    hover: boolean
}
const ImageWrapper = styled.div<hover>`
    width: inherit;
    height: inherit;
    max-width: 333.338px;
    max-height: 89.267px;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "hidden" : "visibility"};
`

const ImageWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    max-width: 333.338px;
    max-height: 89.267px;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "visibility" : "hidden"};
`
interface SimpleButton {
    children: string | string []
    action: () => void
}
const SimpleButton = ({ children, action } : SimpleButton) : JSX.Element =>{

    const [ hover, setHover ] = useState<boolean>(false)
    return (<>
        <SimpleButtonComponent onMouseOver = {() => setHover(true)} onMouseLeave = {() => setHover(false)} onClick = {action}>

            <ImageWrapperHover hover = {hover}>
                <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/simple_button/simple_button_hover.svg"alt = "simple button drunken dragon" width={288} height = {77} layout = "responsive"/>
            </ImageWrapperHover>

            <ImageWrapper hover = {hover}>
                <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/simple_button/simple_button.svg" alt = "simple button drunken dragon" width={288} height = {77} layout = "responsive"/>
            </ImageWrapper>
            

            <TextWrapper>
                <Center>
                    <TextElMessiri fontsize={1.1} color="white" fontsizeMobile={4} lineHeightMobil={4}>{children}</TextElMessiri>
                </Center>
            </TextWrapper>
        </SimpleButtonComponent>
    </>)
}

export default SimpleButton