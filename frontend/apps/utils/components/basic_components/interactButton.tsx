import styled from "styled-components"
import Image from "next/image"
import { useState } from "react"

interface InteractButtonWrapper {

    big_size?: boolean
    disable? :boolean
}

const InteractButtonWrapper = styled.div<InteractButtonWrapper>`
    width: ${props => props.big_size ? "3.5" : "2"}vw;
    height: ${props => props.big_size ? "1.75" : "1"}vw;
    max-width: ${props => props.big_size ? "89.6" : "51.2"}px;
    max-height: ${props => props.big_size ? "89.6" : "51.2"}px;
    display: inline-block; 
    ${ props => props.disable ? "" : "cursor: pointer;"}
    ${ props => props.disable ? "filter: grayscale(100%);" : ""}


    @media only screen and (max-width: 414px) {
        width: ${props => props.big_size ? "11.5" : "7.5"}vw;
        height: ${props => props.big_size ? "5.75" : "3.75"}vw;
    }
`

interface InteractButton{
    action: () => void
    big_size?: boolean
    disable?: boolean
}

const InteractButton = ({action, big_size, disable } : InteractButton): JSX.Element =>{

    const [hover, setHover] = useState<boolean>(false)

    return (<>
                <InteractButtonWrapper 
                    onMouseOver = {disable == true ? () => null : () => setHover(true) } 
                    onMouseLeave = { disable == true ? () => null : () => setHover(false) } 
                    onClick = { disable == true ? () => null : action}
                    big_size = {big_size}
                    disable = {disable}
                >
                    <Image src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/interactButton/interact_button${hover ? "_hover": ""}.svg` }alt = "drunken dragon icons" layout="responsive" width={34} height={11}/>
                </InteractButtonWrapper>
    </>)
}

export default InteractButton