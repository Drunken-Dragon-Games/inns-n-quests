import styled from "styled-components"
import { MenuButton, AppsLabel, SocialMedia } from "./components/basic_components"
import { appsToShow, socialMedia } from "../../../setting"
import { useState } from "react"
import { useRouter } from 'next/router'

interface LateralBarComponent{
    isOpen: boolean
}

const LateralBarComponent = styled.section<LateralBarComponent>`

    max-width: ${props => props.isOpen ? " 332.8" : "110"}px;
    min-width: 49px;
    position: fixed;
    width: ${props => props.isOpen ? "12" : "3.8"}vw;
    height: 100vh;
    background-color: #020408;
    overflow: hidden;
    transition: width 0.5s, max-width 0.5s;
    z-index: 12;

    ::-webkit-scrollbar {
        width: 0.1vw;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #808080;
        border-radius: 0.1vw;
    }

    @media only screen and (max-width: 414px) {
        width: ${props => props.isOpen ? "50" : "0"}vw;
        overflow-y: scroll;
        min-width: 0px;
    }

    @media only screen and (min-width: 1930px) {
        overflow-y: scroll;
    }
`

const MenuButtonWrapper = styled.div`
    
    width: 12vw;
    height: 10vh;
    max-width: 307px;
    padding: max(1vw, 25.6px) max(0.9vw, 23.04px);

    @media only screen and (max-width: 414px) {
        width: 20vw;
        height: 8vh;
        padding: 4vw 5vw;
        position: fixed;
    }
`

const LineDivided = styled.div`
    border-bottom: 0.104vw solid #14212C;
    margin: 0vw max(0.8vw, 20.48px);

    @media only screen and (max-width: 414px) {
        border-bottom: 0.5vw solid #14212C;
        margin: 0vw 5vw;
    }
`

const AppsDisplay = styled.div`
    width: 15vw;
    max-width: 384px;
    padding: max(2vw) max(1vw, 25.6px);
    display: inline-block;

    @media only screen and (max-width: 414px) {
        width: 45vw;
        padding: 10vh 5vw 10vw 5vw;
    }
`

const AppWrapper = styled.div`
    margin-bottom: max(1.8vw);
    
    &: last-child{
        margin-bottom: 0vw;
    }

    @media only screen and (max-width: 414px) {
        margin-bottom: 8vw;
        height: 6vw;
        &: last-child{
            margin-bottom: 0vw;
        }
    }
`

const SocialMediaDisplay = styled.div`
    max-width: 307px;
    width: 12vw;
    display: inline-block;
    padding: max(2vw) max(1vw, 25.6px);

    @media only screen and (max-width: 414px) {
        width: 45vw;
        padding: 4vh 5vw 10vw 5vw;
    }
`

const SocialMediaWrapper = styled.div`
    display: flex;
    margin-bottom: max(1.5vw);
    &: last-child{
        margin-bottom: 1.5vw;
    }

    @media only screen and (max-width: 414px) {
        margin-bottom: 8vw;
        height: 6vw;
        &: last-child{
            margin-bottom: 0vw;
        }
    }
`

const LateralBar = (): JSX.Element => {

    const [isOpen, setIsOpen] =useState<boolean>(false)
    const router = useRouter()
    
    return (<>
            <LateralBarComponent isOpen ={isOpen}>
                <MenuButtonWrapper>
                    <MenuButton action={ () => setIsOpen(!isOpen) }/>
                </MenuButtonWrapper>

                <LineDivided/>

                <AppsDisplay>

                    {appsToShow.map((el => {
                        return (
                            <AppWrapper key={el.name}>
                                <AppsLabel url={el.url} active ={el.url == router.pathname } app = {el.icon} disable = {el.disable}>{el.name}</AppsLabel>
                            </AppWrapper>
                        )
                    }))}
                   
                </AppsDisplay>

                <LineDivided/>
                
                <SocialMediaDisplay>

                    {socialMedia.map((el => {
                            return (
                                <SocialMediaWrapper key ={el.name}>
                                    <SocialMedia url = {el.url} isOpen = {isOpen} socialMedia = {el.name} >{el.name}</SocialMedia>
                                </SocialMediaWrapper>
                            )
                    }))}
                   
                </SocialMediaDisplay>

            </LateralBarComponent>
    </>)
}

export default LateralBar