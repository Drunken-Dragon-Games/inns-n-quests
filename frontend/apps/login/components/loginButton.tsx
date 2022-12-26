import styled from "styled-components"
import { useState } from "react"
import Image from "next/image"
import { ConditionalRender } from "../../utils/components/basic_components"


interface buttonWrapper{
    reverse?: boolean
}

const ButtonWrapper = styled.div<buttonWrapper>`
    width: 5vw;
    height: 5vw;
    cursor: pointer;
    display: flex;
    background-Color: #0B1015;
    border-radius: ${props => props.reverse ? "0vw 1.7vw 0vw 1.7vw" : "1.7vw 0vw 1.7vw 0vw"};
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 15vw;
        height: 15vw;
    }
`
interface hover {
    hover: boolean
}

const ButtonWrapperImage = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
    visibility: ${props => props.hover ? "hidden" : "visible" };
`

const ButtonWrapperImageHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
    visibility: ${props => props.hover ? "visible" : "hidden"};
`

const ButtonTypeWrapper = styled.div<hover>`
width: inherit;
height: inherit;
    display: flex;
    position: absolute;
    visibility: ${props => props.hover ? "hidden" : "visible" };

   
`

const ButtonTypeWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    display: flex;
    position: absolute;
    visibility: ${props => props.hover ? "visible" : "hidden"};
`

const IconWrapper = styled.div`
    width: 2.8vw;
    height: 2.8vw;
    margin: auto;

    @media only screen and (max-width: 414px) {
        width: 7.8vw;
        height: 7.8vw;
    }
`

interface loginButton {
    action: () => void
    buttonType: "discord" | "nami" | "eternl"
    reverse?: boolean
}

const LogInButton = ({action, buttonType, reverse} : loginButton) : JSX.Element =>{

    const [hover, setHover] = useState<boolean>(false)

    return(<>
        <ButtonWrapper 
            onMouseOver = { () => setHover(true) } 
            onMouseLeave = { () => setHover(false) } 
            onClick ={action} 
            reverse = {reverse}
        >
            <ConditionalRender condition ={reverse == true}>
                <ButtonWrapperImage hover = {hover}>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/button/login_button_reverse.svg"
                        alt="login button drunken dragon" 
                        width={800} 
                        height={800} 
                        layout = "responsive"
                    />
                </ButtonWrapperImage>

                <ButtonWrapperImageHover hover = {hover} >
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/button/login_button_hover_reverse.svg" 
                        alt="login button drunken dragon" 
                        width={800} 
                        height={800} 
                        layout = "responsive"
                    />
                </ButtonWrapperImageHover>
            </ConditionalRender>

            <ConditionalRender condition ={reverse != true}>
               
                <ButtonWrapperImage hover = {hover}>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/button/login_button.svg"
                        alt="login button drunken dragon" 
                        width={800} 
                        height={800} 
                        layout = "responsive"
                    />
                </ButtonWrapperImage>

                <ButtonWrapperImageHover hover = {hover} >
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/button/login_button_hover.svg" 
                        alt="login button drunken dragon" 
                        width={800} 
                        height={800} 
                        layout = "responsive"
                    />
                </ButtonWrapperImageHover>

            </ConditionalRender>
   
             
            

            <ButtonTypeWrapper  hover = {hover}>
                <IconWrapper>
                    <Image 
                        src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/button/icons/${buttonType}.svg`}
                        alt="login button icon drunken dragon" 
                        width={800} 
                        height={800} 
                        layout = "responsive"
                    />
                </IconWrapper>
            </ButtonTypeWrapper>

            <ButtonTypeWrapperHover  hover = {hover}>
                <IconWrapper>
                    <Image 
                        src = { `https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/button/icons/${buttonType}_hover.svg` }
                        alt="login button icon drunken dragon" 
                        width={800} 
                        height={800} 
                        layout = "responsive"
                    />
                </IconWrapper>
            </ButtonTypeWrapperHover>

        </ButtonWrapper>
    </>)
}

export default LogInButton