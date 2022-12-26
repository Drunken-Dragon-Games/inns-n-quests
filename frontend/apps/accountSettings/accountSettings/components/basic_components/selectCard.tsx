import styled from "styled-components"
import { TextOswald } from "../../../../utils/components/basic_components"
import { useState } from "react"

const SelectCardComponent = styled.div`
    width: 7vw;
    height: 3vw;
    cursor: pointer;
    margin-bottom: 0.5vw;
    position: relative;
    &:hover{
        background-color: #0B1015;
        border-radius: 0vw 7vw 0vw 0vw;
    }
    &:last-child{
        margin-bottom: 0vw;
    }

    @media only screen and (max-width: 414px) {
        width: 20vw;
        height: 9vw;
    }
`

const BorderHover = styled.div`
    
    position: absolute;
    width: inherit;
    height: inherit;
    left: 0vw;
    top: 0vw;
    padding: 0.5vw 0vw 0.5vw 1vw;
    border: 0.25vw solid  #14212C;

    &:hover{
        border: 0.25vw solid  #0B1015;
    }

    @media only screen and (max-width: 414px) {
        padding: 1vw 0vw 1vw 1vw;
    }
`
interface SelectCard{
    children : string
    action: () => void
}

const SelectCard = ({ children, action } : SelectCard ) : JSX.Element =>{


    return(<>
            <SelectCardComponent onClick={action}>
                <BorderHover>
                    <TextOswald fontsize={1.3} color = "white" fontsizeMobile = {5} lineHeightMobil = {6}>{children}</TextOswald>
                </BorderHover>
            </SelectCardComponent>
    </>)
}

export default SelectCard