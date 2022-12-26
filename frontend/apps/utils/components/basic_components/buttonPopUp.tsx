import styled from "styled-components"
import TextOswaldStyle from "./textOswald"
import { useState } from "react"

const ButtonPopUpComponent = styled.div`
    border: 0.15vw solid #CA9F44;
    width: 6vw;
    border-radius: 5vw;
    padding: 0.3vw 0.5vw;
    display: flex;
    cursor: pointer;
    &:hover{
        border-color: white;
    }

    @media only screen and (max-width: 414px) {
        width: 20vw;
        padding: 0.2vw 0.5vw 0.3vw 0.5vw;
    }
`

const Center = styled.div`
    margin: auto;

    
`

interface ButtonPopUp{
    children: string
    action?: () => void
}

const ButtonPopUp = ({children, action}: ButtonPopUp) : JSX.Element => {

    const [hover, setHover] = useState<boolean>(false)

    return (<>
        <ButtonPopUpComponent onMouseOver={ () => setHover(true)} onMouseLeave = {() => setHover(false)} onClick={action}>
            <Center>
                <TextOswaldStyle fontsize={1} color = {hover ? "white" : "#CA9F44"} fontsizeMobile ={4} lineHeightMobil ={5}>{children}</TextOswaldStyle> 
            </Center>
        </ButtonPopUpComponent>
    
    </>)
}

export default ButtonPopUp