import styled from "styled-components"
import Image from "next/image"
import { useState } from "react"
// import { socialMedia } from "../../data/socialMedia"
import { TextElMessiri, TextOswald } from "../basic_components"
// import { setPage } from "../../features/generalState"
import { useDispatch } from "react-redux"
import Link from "next/link"


const SocialMediaNameWrapper = styled.div`
    width: 24vw;
    margin-left: auto;
`
interface socialMediaName{
    element: element
}

interface element{
    name: string
    url: string
}

const SocialMediaName = ({element}: socialMediaName) => {

    return(<>
        <SocialMediaNameWrapper>
            <Link href={element.url} passHref={true}>
                <a target="_blank">
                    <TextElMessiri
                        fontsizeMobile={5}
                        textAlignMobile="right"
                        color="#CA9F44"
                        fontsize={1}
                        lineHeightMobil ={10}
                    >
                        {element.name}
                    </TextElMessiri>
                </a>
            </Link>
        </SocialMediaNameWrapper>
    </>)
}


interface selectElementWrapper{
    clickable: boolean
}

const SelectElementWrapper = styled.div<selectElementWrapper>`
    border-bottom: 0.2vw solid ${props => props.clickable ? "#CA9F44" : "#E7BE6D"};
    width: 30vw;
    margin-left: auto;
`

interface selectElement{
    children: string
    clickable: boolean
    onClick?: () => void
}
const SelectElement = ({children, clickable, onClick}:selectElement) =>{
    return (<>
        <SelectElementWrapper clickable ={clickable} onClick ={onClick}>
            <TextOswald
                fontsizeMobile={5}
                textAlignMobile="right"
                color={clickable ? "#CA9F44" : "#E7BE6D"}
                fontsize={1}
                lineHeightMobil ={10}  
            >
                {children}
            </TextOswald>
        </SelectElementWrapper>
    </>)
}
const HeaderWrapper =styled.div`
    width: 100%;
    height: 25vw;
    display: flex;
    background-color: #090E14;
    padding: 0vw 10vw;
    z-index: 12;
    position: relative;
`

const Logo = styled.div`
    margin: auto auto auto 0vw;
    width: 38vw;   
`

const HomeButtonWrapper = styled.div`
    width: 10vw;
    height: 10vw;
    margin: auto 0vw;
`
interface menu {
    active: boolean
}

const Menu = styled.div<menu>`
    position: absolute;
    width: 100vw;
    background-color:  #090E14;
    z-index: 11;
    top: ${props => props.active ? "15": "-85"}vw;
    transition: top 1s;
    padding: 10vw 10vw;
`

const NavBarMobile = () =>{

    const dispatch = useDispatch()
    const [isActive, setIsActive] = useState<boolean>(false)
    
    return (<>
        {/* <HeaderWrapper>
            <Logo>
                <Image 
                    src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/logo/logo.svg"
                    alt = "Drunken dragon logo"   
                    layout = "responsive" 
                    width={134} 
                    height={46}
                    priority
                />
            </Logo>
            <HomeButtonWrapper onClick={ () => setIsActive(!isActive)}>
                <Image 
                    src = {isActive ? "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/icons/close_button.svg" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/icons/menu_button.svg"}
                    alt = "Drunken dragon menu logo"   
                    layout = "responsive" 
                    width={100} 
                    height={100}
                    priority
                />
            </HomeButtonWrapper>
      
        </HeaderWrapper>
        <Menu active = {isActive}>
            <SelectElement clickable = {true} onClick = {() => dispatch(setPage("roster"))}>Roster</SelectElement>
            <SelectElement clickable = {true} onClick = {() => dispatch(setPage("rarity_chart"))}>Rarity Chart</SelectElement>
            <SelectElement clickable = {false}>Join Us</SelectElement>

            {socialMedia.map(el => {
                return <SocialMediaName element={el} key={el.name}/>
            })}
        </Menu> */}
    
    </>)
}

export default NavBarMobile