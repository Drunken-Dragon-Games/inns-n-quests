import styled from "styled-components"
import Image from "next/image"
import TextElMessiri from "./textElMessiri"


const RarityTypeColumn = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 414px) {
        margin-bottom: 4vw;
    }
    
`
const TitleWrapper = styled.div`
    display: flex;
    width: 100%;
    height: inherit;
    @media only screen and (max-width: 414px) {
        margin-bottom: 1.563vw;
    }
`

const ImageContainer = styled.div`
    width: 0.95vw;
    height: 0.95vw;
    margin-right: 0.5vw;
    @media only screen and (max-width: 414px) {
        margin-right: 0.781vw;
        width: 6vw;
        position: relative;
        top: -0.833vw;
    }
`

const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 100%;
    width: 100%;
    @media only screen and (max-width: 414px) {
        margin: 0 1.563vw;
        width: auto;
        margin-bottom: 1.563vw
    }
`


interface RarityTypeColumn{
    columnName: string,
    iconSrc: string,
    children: JSX.Element[]
}

const RarityColumn =({columnName, iconSrc, children}:RarityTypeColumn) =>{
    return(<ColumnWrapper>
        <TitleWrapper>
            <ImageContainer>
            <Image src={iconSrc}
                   alt = "card drunken dragon"   
                   layout = "responsive" 
                   width={100} 
                   height={100}/>
            </ImageContainer>
            <TextElMessiri fontsize={1} color={"#ffffff"} fontsizeMobile={5} lineHeightMobil ={5.2}>{columnName}</TextElMessiri>
        </TitleWrapper>
        <RarityTypeColumn>
            {children}
        </RarityTypeColumn>
    </ColumnWrapper>)
}

export default RarityColumn