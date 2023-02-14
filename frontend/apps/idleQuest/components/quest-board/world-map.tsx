import styled from "styled-components"
import { useRef, useState } from "react"
import Image from "next/image"
import { useClickInside } from "../../../utils/hooks"
import MapButton from "./map-button"

const MapWrapper = styled.div<{closed: boolean}>`
    overflow: hidden;
    height: 40vw;
    width:  ${props => props.closed == true  ? "0"  : "60"}vw;
    transition: width 1s;
    position: relative;
`

const ImageWrapper = styled.div`
    height: 40vw;
    width: 60vw; 
`

const WrapperAnimation = styled.div`
    width: 60vw;
    height: 40vw;;
    position: relative;
`

const PaperAnimation = styled.div<{closed: boolean}>`
    width: ${props => props.closed == true  ? "60"  : "0"}vw;
    right: ${props => props.closed == true  ? "60"  : "0"}vw;
    height: 40vw;
    position: absolute;
    top: 0vw;
    background-color: #A57A46;  
    z-index: 10;
    transition: width 1s, right 1s;
`


const MapAnimationWrapper = styled.div`
    margin: auto;
    position: relative;
`

interface ShadowWrapper {
    closed: boolean
}


const ShadowWrapper = styled.section<ShadowWrapper>`
    position: fixed;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100vw;
    height: 100vh;
    z-index: 15;
    background-color: rgba(0,0,0,0.8);
    visibility: ${props => props.closed == true  ? "hidden"  : "visible "};
    opacity: ${props => props.closed == true  ? "0"  : "1"};
    transition: opacity 1s, visibility 0.8s;
`

export default () => {


    const drunkenDragonMap = useRef <HTMLDivElement>(null)
    const drunkenDragonMap1 = useRef <HTMLDivElement>(null)


    const [isOpen, setIsOpen] = useState<boolean>(false)
    

    // // ese hook agregan la referencia y si se clickeauera activa un booleano
    useClickInside(drunkenDragonMap, () => setIsOpen(false),drunkenDragonMap1 )

    return (
    <>

        <MapButton action={() => setIsOpen(currentIsOpen =>{ return !currentIsOpen})}/>

        <ShadowWrapper closed = {!isOpen} ref={drunkenDragonMap}>
            <MapAnimationWrapper ref={drunkenDragonMap}>
                <PaperAnimation closed = {!isOpen}/>
                <WrapperAnimation ref={drunkenDragonMap1}>
                    <MapWrapper closed = {!isOpen}>
                        <ImageWrapper>
                            <Image 
                                src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/map/drunken_dragon_map.webp"  
                                alt="druken dragon map" 
                                width={60} 
                                height={40} 
                                priority 
                                layout="responsive"
                            />
                        </ImageWrapper>
                    </MapWrapper>
                </WrapperAnimation>
            </MapAnimationWrapper>
        </ShadowWrapper>
    </>
    )
}
