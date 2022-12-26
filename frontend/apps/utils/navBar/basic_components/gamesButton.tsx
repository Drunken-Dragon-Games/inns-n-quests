import styled from "styled-components"
import Image from "next/image"
import { LinkDisable, Tooltip, TextElMessiri } from "../../components/basic_components"
import { useState } from "react"



const GamesButtonWrapper = styled.div`
    width: 3.246vw;
    height: 3.246vw;
    max-width:62.323px;
    max-height:62.323px;
    position: relative;

    @media only screen and (max-width: 414px) {
        display: none;
    }
`


const GamesButtonHover = styled.div`
    width: 3.125vw;
    height: 3.125vw;
    max-width:70px;
    max-height:70px;
    transition: width 0.2s, height 0.2s; 
    cursor: pointer;
    border-radius: 0.5vw;
    overflow: hidden;

    &: hover{
        width: 3.246vw;
        height: 3.246vw;
    }
`

const GamesButtonWrapperMobile = styled.div`
    display: none;

    @media only screen and (max-width: 414px) {
        width: 41.239vw;
        height: 9.998vw;
        position: relative;
        display: block;
    }
`

const GameIconMobile = styled.div`
    width: 9.783vw;
    height: 9.783vw;
    border-radius: 2vw;
    border: 0.5vw solid #CA9F44;
    overflow: hidden;
`

const TextWrapper = styled.div`
   
    top: 0vw;
    width: 58%;
    height: 100%;
`

const Flex = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`

const Center = styled.div`
    margin: auto;
`

const MobileIconAndTextWrapper = styled.div`
    display: flex;
    position: absolute;
    top: 0vw;
    width: 100%;
    height: 100%;
`

interface GamesButton{
    game: "inns" | "quests"
    url: string
    openExternal: boolean
    ToolTip: string [] | string
    textMobile?: string
}

const GamesButton = ({game, url, openExternal, ToolTip} : GamesButton) : JSX.Element => {


    const [hover, setHover] = useState<boolean>(false)

    return (<>
        <GamesButtonWrapper onMouseOver = {() => setHover(true)}  onMouseLeave = {() => setHover(false)}>

            <LinkDisable openExternal = {openExternal} url ={url}>
                <GamesButtonHover>
                    <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/game_icons/${game}.webp`} alt = "game button drunken dragon entertainment" width = {55} height = {55} layout = "responsive"/>
                </GamesButtonHover>
            </LinkDisable>

            <Tooltip hover={hover}>{ToolTip}</Tooltip>

        </GamesButtonWrapper>

        <GamesButtonWrapperMobile>
            <LinkDisable openExternal = {openExternal} url ={url}>
                <>
                    <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/game_icons/button_game_ornament.svg" alt = "game button drunken dragon entertainment" width = {170} height = {41} layout = "responsive"/>
                    <MobileIconAndTextWrapper>
                        <GameIconMobile>
                            <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/game_icons/${game}.webp`} alt = "game button drunken dragon entertainment" width = {55} height = {55} layout = "responsive"/>
                        </GameIconMobile>
                        <TextWrapper>
                            <Flex>
                                <Center>
                                    <TextElMessiri fontsize = {0.9} color = "white" fontsizeMobile={5} lineHeightMobil = {4.5}>{ToolTip}</TextElMessiri>
                                </Center>
                            </Flex>
                        </TextWrapper>
                    </MobileIconAndTextWrapper>
                    
                </>
            </LinkDisable>
        </GamesButtonWrapperMobile>

       
    </>)
}

export default GamesButton