import Image from "next/image";
import { useState } from "react"
import styled from "styled-components"

const MapWrapper = styled.div`
    position: absolute;
    display: flex;
    z-index: 2;
    width: 5vw;
    height: 5vw;
    
    top: 1vw;
    right: 3vw;
    z-index: 6;
    img{
        width: 4vw !important;
        height: 4vw !important;
        z-index: 2;
        cursor: pointer;
    }
`

const Center = styled.div`
    margin: auto;
`


interface MapOnHover {
    hover: boolean
}

const MapOnHover = styled.div<MapOnHover>`
    position: absolute;
    top: 0.3vw;
    right: 0.4vw;
    z-index: 1;
    opacity: ${props => props.hover ? "1" : "0"};
    transition: opacity 0.2s;
    img{
        width: 4.2vw !important;
        height: 4.2vw !important;
        z-index: 2;
    }

`

interface MapButton {
    action: () => void
}

const MapButton = ({action}:MapButton) => {

    const [onHover, setOnHover] = useState(false)

    return(
    <>
            <MapWrapper >
                <Center>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/map_button/map_button.webp" 
                        alt="map button" 
                        width={80} 
                        height={80} 
                        onClick = {action} 
                        onMouseEnter={()=>setOnHover(true)} 
                        onMouseLeave={()=>setOnHover(false)}  
                    />
                    <MapOnHover hover = {onHover}>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/map_button/map_button_onhover.webp" alt="map button hover" width={100} height={100} />
                    </MapOnHover>
                </Center>
            </MapWrapper>
    </>
    )
}

export default MapButton