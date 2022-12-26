import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri, InteractButton, ConditionalRender } from "../../../../utils/components/basic_components"
import { Select, SelectCard } from "./"
import { useState, useRef } from "react"
import { useClickOutside } from "../../../../utils/hooks"
import { handleDiscordAuthAddAccount } from "../../features/addDiscord"
import { useRedirect } from "../../../../utils/hooks"
import { connectNami, connectEternl, walletConnection } from "../../features/walletsConnect"
import { useGeneralDispatch } from "../../../../../features/hooks"


const LinkedAccountUnitComponent = styled.div`
    display: inline-block;
    height: 2vw;
    max-height: 51.2px;
    margin-bottom: 2vw;
    position: relative;

    @media only screen and (min-width: 2560px) {
        margin-bottom: 1.5vw;
    }
`

const Flex = styled.div`
    display: flex;
`

const IconWrapper = styled.div`
    width: 2vw;
    height: 2vw;
    max-width: 51.2px;
    max-height: 51.2px;

    @media only screen and (max-width: 414px) {
        width: 5vw;
        height: 5vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-top: 13px;
    }
`

const TextWrapper = styled.div`
    margin: 0.2vw 0vw 0vw 1vw;
    width: 20vw;
    max-width: 512px;
    overflow: hidden;

    @media only screen and (max-width: 414px) {
        width: 35vw;
        margin: 0.6vw 0vw 0vw 3vw;
    }
`

const InteractButtonWrapper = styled.div`
    margin: 0.7vw 0vw 0vw 0.5vw;

    @media only screen and (max-width: 414px) {
        margin: 1.6vw 0vw 0vw 3vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-bottom: 1.5vw;
    }

`
const SelectWrapper = styled.div`
    position: absolute;
    top: 0vw;
    right: -9vw;
    z-index: 2;

    @media only screen and (max-width: 414px) {
        top: 5vw;
        right: -20vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-bottom: 1.5vw;
    }
`

interface linkedAccountUnit {
    is_linked: boolean
    children: string
    defaultTitle: string
}

const LinkedAccountUnit = ({is_linked, children, defaultTitle} : linkedAccountUnit) : JSX.Element => {

    const generalDispatch = useGeneralDispatch();
    const selector = useRef<HTMLDivElement>(null)

    const [selectOpen, setSelectOpen ] = useState<boolean>(false)

    const [ redirectPath, redirectUrl ] = useRedirect()


    useClickOutside(selector, () =>setSelectOpen(false) )

    return (<>
        <div>
            <LinkedAccountUnitComponent>
                <Flex>
                    <IconWrapper>
                        <Image src = {is_linked ? "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/account_settings/linked_account.svg" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/account_settings/add_account.svg"} alt = "drunken dragon entertainment" width = {50} height = {50} layout="responsive"/>
                    </IconWrapper>

                    <TextWrapper>
                        <TextElMessiri fontsize={1.823} color = {is_linked ? "#CAC6BE" : "#39424E"} fontsizeMobile ={ 4 } lineHeightMobil = {5}>{is_linked  ? children : defaultTitle}</TextElMessiri>
                    </TextWrapper>

                    <InteractButtonWrapper>
                        <InteractButton action = {() => setSelectOpen(!selectOpen)} disable={is_linked}/>
                    </InteractButtonWrapper>

                    <ConditionalRender condition = {selectOpen}>
                        <SelectWrapper ref={selector}>
                            <Select>

                                <ConditionalRender condition = {defaultTitle == "Discord"}>
                                    <SelectCard action = {() => redirectUrl(handleDiscordAuthAddAccount())}>Discord</SelectCard>
                                </ConditionalRender>

                                <ConditionalRender condition = {defaultTitle == "Stake Address"}>
                                    <SelectCard action = {() => generalDispatch(walletConnection("nami"))}>Nami</SelectCard>
                                    <SelectCard action = {() => generalDispatch(walletConnection("eternl"))}>eternl</SelectCard>
                                </ConditionalRender>
                                
                            </Select>
                        </SelectWrapper>
                    </ConditionalRender>
                </Flex>
            </LinkedAccountUnitComponent>
        </div>

    </>)
}

export default LinkedAccountUnit