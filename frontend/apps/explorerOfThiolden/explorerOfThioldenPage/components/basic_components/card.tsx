import styled from "styled-components"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useIsChroma } from "../../hooks"

interface CardComponent{
    data :position
    selected: boolean
}

const CardComponent = styled.div<CardComponent>`
    width: 27.135vw;
    height: 36.344vw;
    position: absolute;
    filter: brightness(${props => props.data.brightness}); 
    top: ${props => props.data.top}vw;
    left:  ${props => props.data.left}vw;
    z-index: ${props => props.data.index};
    opacity: ${props => props.data.opacity};
    transition: top 1s, left 1s, filter 1s, z-index 0.5s, opacity 0.5s;
    border-radius: 0.5vw;
    overflow: hidden;

    @media only screen and (max-width: 414px) {
        width: 70vw;
        height: 91.8vw;
        border-radius: 1.5vw;
    }
    
`
const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`
interface visibility{
    visible: boolean
}

const Visibility = styled.div<visibility>`
    visibility : ${props => props.visible ? "visible": "hidden"};
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0vw;
    opacity:  ${props => props.visible ? "1": "0"};
    transition: all 1s;
`


interface VisibilityVideo {
    zIndex: number
}

const VisibilityVideo = styled.div<VisibilityVideo>`
    
    visibility: visible;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0vw;
    z-index: ${props => props.zIndex}
`


interface Card{
    index: number
    src: string
    movement: string
    mobile: boolean
}

interface position{
    top?: number
    left?: number
    brightness? : number
    index?: number
    opacity: number   
}

const Card =({index, src, movement, mobile}:Card) =>{
    
    const isChroma = useIsChroma(src)

    const [artificialIndex, setArtificialIndex] = useState<number>(index)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    
    const name =  src.split("_")[0]
    
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

    
    useEffect(() => {
        if(movement == "left"){
            setArtificialIndex(artificialIndex -1)
        }
        if(movement == "right"){
            setArtificialIndex(artificialIndex + 1)
        }  
    }, [movement])

       
    return(<>
        <CardComponent 
            data = {mobile == true ?positionMobile[artificialIndex] :position[artificialIndex]} 
            selected = {index == 2}
        >
            {isChroma == false && (name !== "rei" && name !== "thelas"  && name !== "arin")
                ?
                    <Relative>
                        <Visibility visible = {isLoaded}>
                                <Image 
                                        src = {`https://d1f9hywwzs4bxo.cloudfront.net/adv-of-thiolden/web/${src}.webp`}
                                        alt = "card drunken dragon"   
                                        layout = "responsive" 
                                        width={200} 
                                        height={267}
                                        priority
                                        onLoad={event => {
                                            setIsLoaded(true)
                                        }}
                                    />
                        </Visibility>
                        <Visibility visible = {!isLoaded}>
                            <Image 
                                src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/placeholder/placeholder.png"
                                alt = "card drunken dragon"   
                                layout = "responsive" 
                                width={200} 
                                height={267}
                                priority
                            />
                        </Visibility>
                    </Relative>
                : null
            }

            {isChroma == true || (name == "rei" || name == "thelas"  || name == "arin")

                ?
                    
                    <Relative>
                        <VisibilityVideo zIndex={5}>
                            <video 
                                width="2000" 
                                height="2678" 
                                autoPlay 
                                loop 
                                preload={'auto'}
                            >
                                <source src={`https://d1f9hywwzs4bxo.cloudfront.net/adv-of-thiolden/web/${src}.mp4`} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </VisibilityVideo>
                        <VisibilityVideo zIndex={0}>
                            <Image 
                                src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/placeholder/placeholder.png"
                                alt = "card drunken dragon"   
                                layout = "responsive" 
                                width={200} 
                                height={267}
                                priority
                            />
                        </VisibilityVideo>
                    </Relative>
                : null  
                
            }
        
        </CardComponent>
        
    </>)
}

export default Card