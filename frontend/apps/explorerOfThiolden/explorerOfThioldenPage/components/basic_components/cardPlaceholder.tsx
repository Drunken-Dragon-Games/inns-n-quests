import styled from "styled-components"
import Image from "next/image"
import { useEffect, useState } from "react"
 

interface CardComponent{
    data :position
    selected: boolean
}

const CardComponent = styled.div<CardComponent>`
    width: 27.135vw;
    height: 36.344vw;
    // ${props => props.selected ? "-webkit-box-reflect: below 0.5vw linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4));" : ""}
    position: absolute;
    filter: brightness(${props => props.data.brightness}); 
    top: ${props => props.data.top}vw;
    left:  ${props => props.data.left}vw;
    z-index: ${props => props.data.index};
    opacity: ${props => props.data.opacity};
    transition: top 1s, left 1s, filter 1s, z-index 0.5s, opacity 0.5s;
    
    @media only screen and (max-width: 414px) {
        width: 70vw;
        height: 90vw;
    }
`


interface Card{
    index: number
    mobile: boolean
}

interface position{
    top?: number
    left?: number
    brightness? : number
    index?: number
    opacity: number   
}

const CardPlaceHolder =({index, mobile}:Card) =>{

    const [artificialIndex, setArtificialIndex] = useState<number>(index)
  
    useEffect(() =>{
        setArtificialIndex(index)
    },[index])

    
    const position: position [] = [
        {top: 20, left: 50, brightness: 1, index: 6, opacity: 0},
        {top: 20, left: 50, brightness: 1, index: 5, opacity: 0},
        {top: 10, left: 17.433, brightness: 1, index: 4, opacity: 1},
        {top: 8, left: 15.433, brightness: 0.5, index: 3, opacity: 1},
        {top: 6, left: 12.533, brightness: 0.25 , index: 2, opacity: 1},
        {top: 4, left: 9.666, brightness: 0.1 , index: 1, opacity: 1},
        {top: 4, left: 9.666, brightness: 0.1 , index: 0, opacity: 1},
        {top: 4, left: 9.666, brightness: 0.1 , index: -1, opacity: 1},
    ] 

    const positionMobile: position [] = [
        {top: 10, left: 28, brightness: 0.25, index: 2, opacity: 1},
        {top: 10, left: 28, brightness: 0.5, index: 3, opacity: 1},
        {top: 10, left: 17.433, brightness: 1, index: 10, opacity: 1},
        {top: 10, left: 3, brightness: 0.5, index: 3, opacity: 1},
        {top: 10, left: 3, brightness: 0.25 , index: 2, opacity: 1},
        {top: 10, left: 3, brightness: 0.1 , index: 1, opacity: 1},
        {top: 10, left: 3, brightness: 0.1 , index: 0, opacity: 1},
        {top: 10, left: 3, brightness: 0.1 , index: -1, opacity: 1},
    ] 

       
    return(<>
        <CardComponent 
            data = {mobile == true ?positionMobile[artificialIndex] :position[artificialIndex]}
            selected = {index == 2}
        >     
             <Image 
                src = "/images/placeholder/placeholder.png"
                alt = "card placeholder"   
                layout = "responsive" 
                width={200} 
                height={267}
                priority
            />            
        </CardComponent>
        
    </>)
}

export default CardPlaceHolder