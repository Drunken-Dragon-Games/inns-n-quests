import styled from "styled-components"
import { TextElMessiri } from "./basic_components"

interface HomeButton{
    children: JSX.Element,
    width: string
}

const HomeButton = styled.div<HomeButton>`
    border: 0.104vw solid #CA9F44;
    width: ${props => props.width};
    margin: auto;
    padding: .7vw 1.302vw .45vw 1.302vw;
    border-radius: 2vw;
    cursor: pointer;

    @media only screen and (max-width: 414px) {
        padding: 4vw 5vw 3vw 5vw;
        border-radius: 6vw;
    }
`

interface HomeButtonComponent{
    children: string | string [],
    width: string
}

const HomeButtonComponent = ({children, width}: HomeButtonComponent):JSX.Element => {
    return (<HomeButton width={width}>
        <TextElMessiri fontsize={1.198} fontsizeMobile={5.5} color={"#CA9F44"} textAlign="center">{children}</TextElMessiri>           
    </HomeButton>)
}

export default HomeButtonComponent