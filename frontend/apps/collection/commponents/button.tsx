import Image from "next/image"
import styled from "styled-components"
import { useState } from "react"
import { TextOswald } from "../../utils/components/basic_components"

interface ButtonWrapperProps {
    size?: "big" | "regular" | "small";
    disabled: boolean;
  }

const ButtonWrapper = styled.div<ButtonWrapperProps>`
    width: 7.344vw;
    height: 1.8vw;
    ${props => props.size == "big" ? "width: 18.229vw !important; height: 4.740vw !important;" : ""};
    ${props => props.size == "big" ? "max-width: 466.66px !important; max-height: 121.34px !important;" : "max-width: 466.66px !important; max-height: 121.344 !important;"};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    opacity: ${(props) => (props.disabled ? "0.5" : "1")};
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 35vw;
        height: 8.58vw;

        ${props => props.size == "big" ? "width: 65vw !important; height: 15.94vw !important;" : ""};
    }
`

interface ImageWrapper{
    hover: boolean
}

const ImageWrapper = styled.div<ImageWrapper>`
    width: inherit;
    height: inherit;
    max-width: 466.66px; 
    max-height: 121.34px;
    visibility: ${props => props.hover ? "visible" : "hidden" };
    position: absolute;
`

const ImageWrapperT = styled.div <ImageWrapper>`
    width: inherit;
    height: inherit;
    max-width: 466.66px; 
    max-height: 121.34px;
    visibility: ${props => props.hover ? "hidden" : "visible" };
    position: absolute;
`

const TextWrapper = styled.div`
    position: absolute;
    top: 0vw;
    width: inherit;
    height: inherit;
    max-width: 466.66px; 
    max-height: 121.34px;
    display: flex;
`

const Center = styled.div`
    margin: auto;
`
interface ButtonProps {
    action: () => void;
    children: string;
    size?: "big" | "regular" | "small";
    disabled: boolean;
  }

export const Button = ({action, children, size, disabled } : ButtonProps): JSX.Element =>{

    const [hover, setHover] = useState<boolean>(false)
    return(<>
            <ButtonWrapper onClick={action} onMouseOver = {() => setHover(true)} onMouseLeave = {() => setHover(false)} size ={size} disabled={disabled}>
                <ImageWrapper hover ={hover && !disabled}>
                    <Image src ="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/button/button_hover.svg" alt="drunken dragon button" width={10.262} height={2.668} layout="responsive" />
                </ImageWrapper>

                <ImageWrapperT hover ={hover && !disabled}>
                    <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/button/button.svg" alt="drunken dragon button" width={10.262} height={2.668} layout="responsive" />
                </ImageWrapperT>
                
                <TextWrapper>
                    <Center>
                        <TextOswald fontsize={size == "big" ? 2 : 0.9} color="white" fontsizeMobile={size == "big" ? 8 : 4} lineHeightMobil={5}>{children}</TextOswald>
                    </Center>
                </TextWrapper>
            </ButtonWrapper>
    </>)
}