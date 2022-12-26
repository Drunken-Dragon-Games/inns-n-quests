import styled from "styled-components"
import { useClickOutside } from "../../../../utils/hooks" 
import { useRef, useEffect, useState } from "react"

interface ShadowWrapperAnimation{
    isActive: boolean
}

const ShadowWrapperAnimation = styled.div<ShadowWrapperAnimation>`
    position: fixed;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100vw;
    height: 100vh;
    z-index: 12;
    background-color: rgba(0,0,0, 0.8);
    opacity: ${props => props.isActive ? "1": "0"};
    visibility: ${props => props.isActive ? "visible": "hidden"};
    transition: opacity 0.8s, visibility 0.8s;

`

interface ShadowContainer{
    width: number
    height: number
}

const ShadowContainer = styled.div<ShadowContainer>`
    margin: auto;
    width: ${props => props.width}vw;
    height: ${props => props.height}vw;
`


interface ShadowWrapper{
    children: JSX.Element
    isActive: boolean
    clickOutsideAction: () => void
    width: number
    height: number
}
const ShadowWrapper = ({ children, isActive, clickOutsideAction, width, height }: ShadowWrapper) =>{

    const shadowWrapperRef = useRef<HTMLDivElement>(null)
    useClickOutside(shadowWrapperRef, clickOutsideAction)
 
    
    return(<>
        <ShadowWrapperAnimation isActive={isActive} >
            <ShadowContainer ref={shadowWrapperRef} width={width} height ={height}>
                {children}
            </ShadowContainer>
        </ShadowWrapperAnimation>
    </>)
}

export default ShadowWrapper