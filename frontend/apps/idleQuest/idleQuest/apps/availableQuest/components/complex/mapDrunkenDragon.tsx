import styled from "styled-components"
import { useRef, useState } from "react";
import { useClickInside } from "../../../../../../utils/hooks";
import Image from "next/image"
import { MapButton } from "../basic_components";


interface animation {
    isClose: boolean
}

const MapWrapper = styled.div<animation>`
    overflow: hidden;
    height: 40vw;
    width:  ${props => props.isClose == true  ? "0"  : "60"}vw;
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

const PaperAnimation = styled.div<animation>`
    width: ${props => props.isClose == true  ? "60"  : "0"}vw;
    right: ${props => props.isClose == true  ? "60"  : "0"}vw;
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
    isClose: boolean
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
    visibility: ${props => props.isClose == true  ? "hidden"  : "visible "};
    opacity: ${props => props.isClose == true  ? "0"  : "1"};
    transition: opacity 1s, visibility 0.8s;
`

const MapDrunkenDragon = ( ) => {


    const drunkenDragonMap = useRef <HTMLDivElement>(null)
    const drunkenDragonMap1 = useRef <HTMLDivElement>(null)


    const [isOpen, setIsOpen] = useState<boolean>(false)
    

    // // ese hook agregan la referencia y si se clickeauera activa un booleano
    useClickInside(drunkenDragonMap, () =>  setIsOpen(false),drunkenDragonMap1 )

    return (
    <>

        <MapButton action={() => setIsOpen(currentIsOpen =>{ return !currentIsOpen})}/>

        <ShadowWrapper isClose = {!isOpen} ref={drunkenDragonMap}>
            <MapAnimationWrapper ref={drunkenDragonMap}>
                <PaperAnimation isClose = {!isOpen}/>
                <WrapperAnimation ref={drunkenDragonMap1}>
                    <MapWrapper isClose = {!isOpen}>
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

export default MapDrunkenDragon