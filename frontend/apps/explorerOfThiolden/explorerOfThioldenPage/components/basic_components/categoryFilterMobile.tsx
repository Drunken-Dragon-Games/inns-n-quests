import styled from "styled-components"
import Image from "next/image"
import { useEffect, useState } from "react"
import TextElMessiri from "./textElMessiri"
import ToggleSwitch from "./toggleSwitch"

const CategoryFilterWrapper = styled.div`
    position: relative;
    top: 7.246vw;
    width: 100%;
    margin-bottom: 7.246vw;
`
const HeaderContainer = styled.div`
    display: flex;
    height: 7.246vw;
    width: 100%;
    flex: 1;
    margin-left: 1.208vw;
`
const HeaderWrapper = styled.div`
    display: flex;
`

const IconContainer = styled.div`
    height: 100%;
    width: 9.662vw;
    margin-right: 2.415vw;
    padding: 1vw 1.449vw 1.449vw 1.449vw;
    border-left: 0.483vw solid #CBA044;
    border-right: 0.483vw solid #CBA044;
    border-top: 0.483vw solid #CBA044;
    border-radius: 7.246vw 7.246vw 0 0;
`

const TextContainer = styled.div`
    & {

    }
    & p {
        position: relative;
        top: 5.797vw;
    }
`

const ToggleContainer = styled.div`
    & {
        flex: 1;
    }
    & div {
        padding-left: 0.483vw;
    }
`

const FiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

interface CategoryFilter{
    name: string,
    iconSrc: string,
    children: JSX.Element[]
    onChange: any
    value: string
    selected: boolean
    title: string
    
}

const CategoryFilter =({name, iconSrc, children,onChange, value, selected, title }:CategoryFilter) =>{

       
    return(<CategoryFilterWrapper>
        <HeaderWrapper>
            <HeaderContainer>
                <IconContainer>
                    <Image
                        src = {iconSrc}
                        alt = "card drunken dragon"   
                        layout = "responsive" 
                        width={1.3} 
                        height={1.3}
                    >
                    </Image>
                </IconContainer>
                <TextContainer>
                    <TextElMessiri fontsize={0} fontsizeMobile={5} color="white">{title}</TextElMessiri>
                </TextContainer>
            </HeaderContainer>
            <ToggleContainer>
                <ToggleSwitch 
                    name={name}
                    value={value}
                    selected ={selected}
                    onChange={onChange}
                    >All</ToggleSwitch>
            </ToggleContainer>
        </HeaderWrapper>
        <FiltersContainer>
            {children}
        </FiltersContainer>
    </CategoryFilterWrapper>)
}

export default CategoryFilter