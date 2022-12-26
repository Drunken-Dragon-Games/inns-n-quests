import styled from "styled-components"
import Image from "next/image"
import { useState } from "react"

interface ArrowComponent{
    clickAble: boolean
}

const ArrowComponent= styled.div<ArrowComponent>`
    position: relative;
    cursor: pointer${props => props.clickAble ? "": "pointer"};
`

const ArrowImage = styled.div`
    width: 2.099vw;
    height: 1.949vw;
    position: absolute;
    z-index: 2;

    @media only screen and (max-width: 414px) {
        width: 10.099vw;
        height: 9.949vw;
    }
`

interface ArrowOnHover{
    hover: boolean
}
const ArrowOnHover = styled.div<ArrowOnHover>`
    width: 2.203vw;
    height: 2.053vw;
    position: absolute;
    z-index: 1;
    top: -0.05vw;
    opacity: ${props => props.hover ? "1" : "0"};
    transition: opacity 0.2s;
    @media only screen and (max-width: 414px) {
        width: 10.203vw;
        height: 9.053vw;
    }
    
`

interface ArrowForward{
    onClick: () => void
    clickAble: boolean
}

const ArrowBackward = ({onClick, clickAble}:ArrowForward) =>{

    const [hover, setHover] = useState<boolean>(false)
    return(<>
        <ArrowComponent 
            onMouseLeave={() => clickAble == true ? setHover(false) : null} 
            onMouseOver = { () => clickAble == true ? setHover(true) : null}
            onClick={onClick}
            clickAble={clickAble}
        >
            <ArrowImage>
                <Image 
                    src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/arrows/backward.svg"
                    alt = "arrow backward drunken dragon"   
                    layout = "responsive" 
                    width={40.3} 
                    height={37.42}
                    priority
                />
            </ArrowImage>
            <ArrowOnHover hover ={hover}>
                <Image 
                    src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/arrows/backward_onhover.png"
                    alt = "arrow backward drunken dragon"   
                    layout = "responsive" 
                    width={42.3} 
                    height={39.42}
                />
            </ArrowOnHover>
        </ArrowComponent>
    </>)
}

export default ArrowBackward