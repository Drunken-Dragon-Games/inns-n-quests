import Image from "next/image"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { selectGeneralReducer } from "../../../features/generalReducer"
import { useGeneralDispatch, useGeneralSelector } from "../../../features/hooks"
import { AccountHeader } from "../../account"
import { Button } from "../components/basic_components"
import { useRedirect } from "../hooks"
import { useGetAuthenticationIcon } from '../navBar/hooks'
import { AuthenticationMethodIcon, TokenDisplayer } from "./basic_components"
import { ProfileInformation } from "./complex_components"
import { claimDragonSilver } from "./features/claimSilverDragon"
import { useErrorHandler, useGetUserData } from "./hooks"
import { MessiriFontFamily, colors } from "../../common"

const NavbarComponent = styled.nav`
    width: 100vw;
    background-color: #0B1015;

    @media only screen and (max-width: 414px) {
        position: fixed;
        z-index: 11;
    }
`

const HeaderBarContainer = styled.div`
    width: inherit;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vh 5vw;

    @media only screen and (max-width: 414px) {
        padding: 2vh 3vw;
    }
`

const EmptyDiv = styled.div`
    width: 1vw;
    height: 1vw;
`

const LogoWrapper = styled.div`
    position: relative;
    width: 210px;
    height: 75px;

    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const ProfileInformationWrapper = styled.div`
    display: flex;
`

const ProfileInformationPicture = styled.div`
    z-index: 2;
    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const PositionRelative = styled.div`
    position: relative;
    margin-left: auto;
    display: flex;
`

const TokenDisplayerPosition = styled.div`
    margin: auto 0vw;
    margin-right: 5vw;
    display: flex;
    z-index: 2;

    @media only screen and (max-width: 414px) {
        margin-right: 2vw;
    }
`

const IndividualTokenPosition = styled.div`
    margin: auto 0vw;    
    margin-left: 1.5vw;
    &: first-child{
        margin-left: 0vw;
    }
`

const LineOrnament = styled.div`
    border-bottom: 0.15vw solid #14212C;
    position: absolute;
    top: 5.7vh;
    right: 0vw;
    width: 90%;
    z-index: 1;

    @media only screen and (max-width: 414px) {
        border-bottom: 0.5vw solid #14212C;
        top: 3.8vh;
        width: 0%;
    }
`

const AuthenticationMethodIconPosition = styled.div`
    z-index: 2;
    margin: auto 0vw auto 2vw;
    width: 3vw;

    @media only screen and (max-width: 414px) {
        width: 6vw;
    }
`

const ProfileInformationPictureMobile = styled.div`
    z-index: 2;
    display: none;
    @media only screen and (max-width: 414px) {
        display: block;
        margin-right: 1vw;
    }
`

const TestnetBanner = styled.div`
    ${MessiriFontFamily}
    background-color: ${colors.dduGold};
    color: white;
    width: 100%;
    padding: 10px 0px 10px 60px;
    font-size: 14px;
` 

const Navbar = (): JSX.Element =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    /**
    const amountDragonSilver = generalSelector.userDataNavBar.data.DSTC
     
    const [redirectPath, redirectUrl] = useRedirect()
    
    const isDataUser = useGetUserData()

    const generalDispatch = useGeneralDispatch()

    const authenticationMethod = useGetAuthenticationIcon()
    */
    useErrorHandler()

    const [isAvailable, setIsAvailable] = useState<boolean>(true)

    useEffect(() => {
        if (isAvailable == false) {
            setTimeout(() => setIsAvailable(true), 5000)
        }
    }, [isAvailable])

    return (
        <NavbarComponent>
            <HeaderBarContainer>
                <EmptyDiv />
                {/*<GamesButton game="inns" url={gamesButtonSection.quests} toolTip="Inns" />*/}
                <LogoWrapper>
                    {/*<Logo />*/}
                    <Image 
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/drunken_logo.svg" 
                        alt="drunken dragon logo grey version ddu app" 
                        layout="fill"
                    />
                </LogoWrapper>

                <AccountHeader />

                {/* isDataUser == "fulfilled" ? 
                
                    <PositionRelative>
                        <ProfileInformationWrapper>
                            <TokenDisplayerPosition>

                                <ProfileInformationPictureMobile>
                                    <ProfileInformation nick_name={generalSelector.userDataNavBar.data.nickName!} profile_picture_url={generalSelector.userDataNavBar.data.imgLink!} />
                                </ProfileInformationPictureMobile>

                                <IndividualTokenPosition>
                                    <TokenDisplayer icon="collection_symbols" number={generalSelector.userDataNavBar.data.amountNFT} />
                                </IndividualTokenPosition>

                                <IndividualTokenPosition>
                                    <TokenDisplayer icon="dragon_silver" number={generalSelector.userDataNavBar.data.DS} />
                                </IndividualTokenPosition>

                                <IndividualTokenPosition>
                                    <TokenDisplayer
                                        icon="dragon_silver_toClaim"
                                        number={"+" + generalSelector.userDataNavBar.data.DSTC}
                                        optionalText="Claim"
                                        functionOnclick={isAvailable ? () => {
                                            generalDispatch(claimDragonSilver(amountDragonSilver, authenticationMethod))
                                            setIsAvailable(false)
                                        } : () => null}
                                    />
                                </IndividualTokenPosition>


                            </TokenDisplayerPosition>

                            <ProfileInformationPicture>
                                <ProfileInformation nick_name={generalSelector.userDataNavBar.data.nickName!} profile_picture_url={generalSelector.userDataNavBar.data.imgLink!} />
                            </ProfileInformationPicture>

                            <AuthenticationMethodIconPosition>
                                <AuthenticationMethodIcon />
                            </AuthenticationMethodIconPosition>

                        </ProfileInformationWrapper>
                        <LineOrnament />
                    </PositionRelative>
            
                : isDataUser == "rejected" ?

                    <Button action={() => redirectPath("/login")}>Sign Up/In</Button>

                                    : <></> */}
            </HeaderBarContainer>

        <TestnetBanner>Testnet <b>preprod</b> open beta.</TestnetBanner>
        </NavbarComponent>
    )
}

export default Navbar