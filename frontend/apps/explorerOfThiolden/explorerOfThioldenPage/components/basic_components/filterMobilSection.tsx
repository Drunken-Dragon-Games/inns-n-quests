import styled from "styled-components"
import { TextElMessiri } from "."
import Image from "next/image"
import { FiltersMobile } from "../complex"
import { useState } from "react"


const ButtonContainerWrapper= styled.div`
    width: 100%;
    height: 30vw;
    display: flex;
    overflow: hidden;
    margin-top:-20vw;
`

const Button = styled.div`
    width: 35.990vw;
    height: 9.903vw;
    border: 0.8vw solid #CA9F44;
    border-radius: 5vw;
    position: relative;
    margin: auto;
    transition: background-color 0.5s;
    &:hover{
        background-color: #CA9F44;
        p{
            color: white !important;
        }
    }
`

interface TextPosition {
    isFilterMobile: boolean
}
const TextPosition = styled.div<TextPosition>`
    position: absolute;
    top: 2.5vw;
    left: ${props => props.isFilterMobile ?"10" : "5"}vw;
`

const ImageWrapper = styled.div`
    width: 5vw;
    height: 5vw;
    position: absolute;
    right: 4vw;
    top: 2.5vw;
`

interface FiltersMobilePosition{
    isActive: boolean
}

const FiltersMobilePosition = styled.div<FiltersMobilePosition>`
    overflow: hidden;
    height: ${props => props.isActive ? "240" : "0"}vw;
    transition: height 1s;
`


const FilterMobilSection = () =>{

    const [ isFilterMobile, setIsFilterMobile] =useState<boolean>(false)

    return(<>
        <ButtonContainerWrapper>
            <Button onClick={() => setIsFilterMobile(!isFilterMobile)}>
                <TextPosition isFilterMobile={isFilterMobile}>
                    <TextElMessiri color="#B39D7C" fontsize={0.565} fontsizeMobile={4} lineHeightMobil ={4.2}>{isFilterMobile == true ? "Close" : "Search By"}</TextElMessiri>
                </TextPosition>
                <ImageWrapper>
                    <Image 
                            src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/icons/search_by.png"
                            alt = "ornament drunken dragon"   
                            layout = "responsive" 
                            width={34} 
                            height={23}
                    />
                </ImageWrapper>
            </Button>
        </ButtonContainerWrapper>
        <FiltersMobilePosition isActive={isFilterMobile}>
            <FiltersMobile/>
        </FiltersMobilePosition>
        
    </>)
}

export default FilterMobilSection