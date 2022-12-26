import Image from "next/image"
import styled from "styled-components"
import { useState } from "react"

const MenuButtonComponent = styled.div`

    width: 2vw;
    height: 2vw;
    max-width: 51px;
    max-height: 51px;
    cursor: pointer;
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 8vw;
        height: 8vw;
    }
`

interface hover {
    hover: boolean
}
const ImageWrapper = styled.div<hover>`
    width: inherit;
    height: inherit;
    max-width: 51px;
    max-height: 51px;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "hidden" : "visibility"};
`

const ImageWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    max-width: 51px;
    max-height: 51px;
    position: absolute;
    top : 0vw;
    visibility: ${props => props.hover ? "visibility" : "hidden"};
`
interface menuButton {
    action: () => void
}
const MenuButton = ({action} : menuButton): JSX.Element =>{

    const [hover, setHover] = useState<boolean>(false)

    return(<>
            <MenuButtonComponent 
                onMouseOver = {() => setHover(true)} 
                onMouseLeave = { () => setHover(false)} 
                onClick = {action}
            >
                <ImageWrapper hover={hover}>
                    <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar/menu_button.svg" layout="responsive" width={50} height={50} alt = "hamburguer menu icon drunken dragon"/>
                </ImageWrapper>

                <ImageWrapperHover hover={hover}>
                    <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar/menu_button_hover.svg"  layout="responsive" width={50} height={50} alt = "hamburguer menu icon drunken dragon"/>
                </ImageWrapperHover>
                
            </MenuButtonComponent>
    </>)
}

export default MenuButton