import styled from "styled-components"
import Image from "next/image"
import { useEffect, useState } from "react"
import TextElMessiri from "./textElMessiri"

const RaritySlotWrapper = styled.div`
    margin-bottom: 0px;    
    width: 100%;
    height: 2.083vw;
    display: flex;
    align-items: center;
    position: relative;
    @media only screen and (max-width: 414px) {
        margin-bottom: 0.521vw; 
        height: fit-content;
    }  
`

const RarityImageWrapper = styled.div`
    height: 1.302vw;
    width: 1.302vw;
    @media only screen and (max-width: 414px) {
        width: 11vw;
        height: fit-content;
    }  
`

const RarityTypeWrapper = styled.div`
    margin-left: 10px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    position: relative;
    top: 0.260vw;
    width: 100;
    @media only screen and (max-width: 414px) {
        margin-left: auto;
    }
`
const TextMargin = styled.div`
    margin-bottom: -0.104vw;
    @media only screen and (max-width: 414px) {
        margin-bottom: 1.042vw;
    }
`

interface RaritySlot{
    name: string,
    amount: number,
    src: string
}

const RaritySlot =({name, amount, src}:RaritySlot) =>{
       
    return(<>
    <RaritySlotWrapper>
        <RarityImageWrapper>
            <Image 
                src = {src}
                alt = "card drunken dragon"   
                layout = "responsive" 
                width={0.895} 
                height={1.158}
                priority
            />
        </RarityImageWrapper>
        <RarityTypeWrapper>
            <TextMargin>
            <TextElMessiri fontsize={0.65} fontsizeMobile={4.5} lineHeightMobil ={4.7} color={"#C0BAB1"}>{name}</TextElMessiri>
            </TextMargin>
            <TextElMessiri fontsize={0.65} fontsizeMobile={4.5}  lineHeightMobil ={4.7} color={"#C0BAB1"}  textAlignMobile="right" >{`${amount}%`}</TextElMessiri>
        </RarityTypeWrapper>
    </RaritySlotWrapper>
    </>)
}

export default RaritySlot