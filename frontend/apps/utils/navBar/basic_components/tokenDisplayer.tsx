import styled from "styled-components"
import { TextOswald, ConditionalRender } from "../../components/basic_components"
import Image from "next/image"
import { useState } from "react"

const TokenDisplayerComponent = styled.div`
    border: 0.105vw solid #14212C;
    border-radius: 5vw;
    display: inline-block; 
    padding: 0.1vw 0.7vw 0.1vw 0.2vw;
    background-color: #0B1015;
    
    @media only screen and (max-width: 414px) {
        border: 0.5vw solid #14212C;
        padding: 0.5vw 2vw 0.5vw 0.8vw;
    }

` 

const Flex = styled.div`
    display: flex;
`

const IconWrapper = styled.div`
    width: 1.3vw;
    height: 1.3vw;
    max-width: 33.28px;
    max-height: 33.28px;
    margin: auto;
    margin-right: 0.3vw;

    @media only screen and (max-width: 414px) {
        width: 6vw;
        height: 6vw;
        margin-right: 1.5vw;
    }
`

const TextWrapper = styled.div`
    margin: auto 0vw;
`

interface TextWrapperNewType{
    disable: boolean
}

const TextWrapperNew = styled.div<TextWrapperNewType>`
    margin: auto 0vw;
    margin-left: 0.4vw;
    cursor: pointer;
    ${props => props.disable ? 'filter: grayscale(100%);' : ''}

    &:hover{
        ${props => props.disable ? '' : 'opacity: 0.8;'} 
    }

    @media only screen and (max-width: 414px) {
        margin-left: 1vw;
    }
`
interface TokenDisplayer{
    icon: string
    number: number | string
    optionalText?: string
    disable?: boolean
    functionOnclick?: () => void
}

const TokenDisplayer = ({ icon, number, optionalText, disable = false, functionOnclick = () => null }:TokenDisplayer): JSX.Element => {

    const [hover, setHover] = useState<boolean>(false)

    return (<>
        <TokenDisplayerComponent>
            <Flex>

                <IconWrapper>
                    <Image 
                        src ={`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/icons/${icon}.svg`} 
                        width = {1000} 
                        height = {1000} 
                        layout="responsive" 
                        alt = "token drunken dragon icon" 
                    />
                </IconWrapper>
                
                <TextWrapper>
                    <TextOswald fontsize = {1} color = "#CAC6BE" fontsizeMobile = {3.5} lineHeightMobil={4.5}>{number}</TextOswald>
                </TextWrapper>

                <ConditionalRender condition = {optionalText !== undefined}>

                    <TextWrapperNew 
                        disable = {disable}
                        onClick = {functionOnclick}
                    >
                        <TextOswald fontsize = {1} color = "#CA9F44" fontsizeMobile = {3.5} colorMobile= "#A2A2A2"  lineHeightMobil={4.5}>{optionalText!}</TextOswald>
                    </TextWrapperNew>
                    
                </ConditionalRender>
                
            </Flex>
        </TokenDisplayerComponent> 
        
    </>)
}

export default TokenDisplayer