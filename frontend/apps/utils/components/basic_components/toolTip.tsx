import styled from "styled-components"
import { TextElMessiri } from "."


interface ToolTipContent {
    hover: boolean
   
}

const ToolTipContent= styled.div<ToolTipContent>`
    position: absolute;
    background-color: white;
    padding: 0.2vw 0.5vw 0.1vw 0.5vw;
    border-radius: 0.5vw;
    bottom: -3vw;
    left: -1.5vw;
    min-width: 6vw;
    visibility: ${props => props.hover ? "visible": "hidden"};
    opacity: ${props => props.hover ? "1": "0"};
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 2;
    display: inline-block;
`

interface ToolTip {
    hover: boolean
    children: string [] | string
   
}

const ToolTip = ({hover, children}: ToolTip) : JSX.Element => {
    return (<>
        <ToolTipContent hover ={hover}>
           <TextElMessiri fontsize={1} color =" #23303B" textAlign="center">{children}</TextElMessiri> 
        </ToolTipContent>
    </>)
}

export default ToolTip