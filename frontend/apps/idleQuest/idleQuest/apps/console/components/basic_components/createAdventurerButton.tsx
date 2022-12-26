import styled from "styled-components"
import { useState } from "react"
import Image from "next/image"

const AdventuresButtonWrapper = styled.div`
    width: 100%;
    height: 5vw;
    position: relative;
    display: flex;
`



interface ImageWrapperHover {

    hover: boolean
}
const ImageWrapper = styled.div<ImageWrapperHover>`
    position: absolute; 
    visibility: ${props => props.hover ? "hidden" : "visible"};
    img{
        width: 20vw !important;
        height: 5vw !important;
        cursor: pointer;
    }
`

const ImageWrapperOnHover = styled.div<ImageWrapperHover>`
    position: absolute; 
    visibility: ${props => props.hover ? "visible" : "hidden"};
    img{
        width: 20vw !important;
        height: 5vw !important;
        cursor: pointer;
    }
`

interface TextWrapper{
    hover: boolean
}

const TextWrapper = styled.div<TextWrapper>`
    margin: auto;
    z-index: 2;
    cursor: pointer;
    p{
        
        font-family: El Messiri;
        font-size: ${props => props.hover ? "1.2vw" : "1.1vw"};
        color #14212C;
    }
`
const CrearteAdverturerButton = () =>{

   
    const [hover, setHover] = useState<boolean>(false)
    // FIXME: add action to the button
    return <>
        <AdventuresButtonWrapper onClick={()=> null}>
            <ImageWrapper hover = {hover} onMouseOver ={()=> setHover(true)}>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/create_adventures_button/boton_inactivo.webp"  alt="punt image" width={2000} height={1250} priority/>
            </ImageWrapper>
            <ImageWrapperOnHover hover = {hover} onMouseLeave ={ ()=> setHover(false) }>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/create_adventures_button/boton_activo.webp"  alt="punt image" width={2000} height={1250} priority />
            </ImageWrapperOnHover>
            <TextWrapper onMouseOver ={()=> setHover(true)}  hover = {hover}><p>Recruit</p></TextWrapper>
        </AdventuresButtonWrapper>
    </>
}

export default CrearteAdverturerButton