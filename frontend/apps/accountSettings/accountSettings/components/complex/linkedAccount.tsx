import styled from "styled-components"
import { LinkedAccountUnit } from "../basic_components"
import {  TitleOswald, TextElMessiri } from "../../../../utils/components/basic_components"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"


const LinkedAccountWrapper = styled.div`
    background-color: #0B1015;
    width: 100%;
    padding: 1vw 0vw 2.083vw 0vw;
    height: inherit;
    max-height: inherit;

    @media only screen and (max-width: 414px) {
        padding: 8vw 0vw 2.083vw 0vw;
    }

    
`

const Flex = styled.div`
    height: inherit;
    max-height: inherit;
    width: 100%;
    display: flex;
`
const Center = styled.div`
    margin: auto;

    @media only screen and (min-width: 2560px) {
        margin: auto;
    }
`

const MarginBottom = styled.div`
    margin-bottom: 0vw;

    @media only screen and (max-width: 414px) {
        margin-bottom: 4vw;
    }
`

const ErrorWrapper = styled.div`

    width: 20vw;

    @media only screen and (max-width: 414px) {
        width: 70vw;
    }
`


const LinkedAccount = (): JSX.Element => {
    
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const DiscordName = generalSelector.accountData.data.discordUserName
    const StakeAddressesArray = generalSelector.accountData.data.stakeAddresses

    const errorAddWallet = generalSelector.wallet.connectWalletStatus.error
    const errorAddStakeAddress = generalSelector.authentication.status.fetchSignedMessagePostStatus.error
    const errorDiscord = generalSelector.addDiscord.status.connectDiscord.error

    return (<>
        <LinkedAccountWrapper>
            <TitleOswald fontsize={1.5} color = "#4A5362" textAlign="center" fontsizeMobile={6} lineHeightMobil ={7}>
                Linked Accounts
            </TitleOswald>

            <Flex>
                <Center>
                    <MarginBottom>
                        <LinkedAccountUnit is_linked = {typeof(DiscordName) == "string"} defaultTitle= "Discord">Discord</LinkedAccountUnit>
                    </MarginBottom>
                    
                    <MarginBottom>
                        <LinkedAccountUnit is_linked = {StakeAddressesArray[0] != undefined} defaultTitle= "Stake Address">{StakeAddressesArray[0]}</LinkedAccountUnit>
                    </MarginBottom>

                    <ErrorWrapper>
                        <TextElMessiri 
                            fontsize={0.9} 
                            color="#CAC6BE" 
                            textAlign='left'
                            fontsizeMobile={4} 
                            lineHeightMobil={5}
                            textAlignMobile="center" 
                        >
                            {typeof errorAddWallet != "string"  ? "" : errorAddWallet}
                            {typeof errorAddStakeAddress != "string"  ? "" : errorAddStakeAddress}
                            {typeof errorDiscord != "string"  ? "" : errorDiscord}
                        </TextElMessiri>
                    </ErrorWrapper>

                    
                </Center>
            </Flex>

        </LinkedAccountWrapper>
    </>)
}

export default LinkedAccount