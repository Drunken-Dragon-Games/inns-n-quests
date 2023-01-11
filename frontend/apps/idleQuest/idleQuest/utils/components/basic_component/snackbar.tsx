import styled, {keyframes} from "styled-components"

const fadein = keyframes`
    0% { bottom: 0; opacity: 0;}
    100% {bottom: 1.563vw; opacity: 1;}
`

const fadeout = keyframes`
    0% { bottom: 1.563vw; opacity: 1;}
    100% {bottom: 0; opacity: 0; visibility: hidden;}
`

interface SnackbarElement{
    status: string
}

const SnackbarElement = styled.div<SnackbarElement>`
    min-width: 13.021vw;
    margin-left: -6.510vw;
    background-color: ${props => props.status == "succeded" ?"#4CAF50" : ""} ${props => props.status == "rejected" ?"#D32F2F" : ""};
    margin-bottom : 1.042vw;
    color: white;
    text-align: center;
    border-radius: 0.104vw;
    padding: 0.833vw;
    font-family: arial;
    border-radius: 0.2vw;
    left: 50%;
    bottom: 1.563vw;
    font-size: 0.885vw;
   
    animation: ${fadein} 0.5s, ${fadeout} 0.5s forwards 2.5s;
`

interface snackbar{
    children: string
    status: string
}

const Snackbar = ({children, status}:snackbar) => {
    return(<>
        <SnackbarElement status= {status}>
            {children}
        </SnackbarElement>
    </>)
}

export default Snackbar