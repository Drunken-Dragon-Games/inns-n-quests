import { Logo, TokenDisplayer, AuthenticationMethodIcon, GamesButton} from "./basic_components"
import { ProfileInformation } from "./complex_components"
import styled from "styled-components"
import {  useGeneralSelector } from "../../../features/hooks" 
import { selectGeneralReducer } from "../../../features/generalReducer"
import { ConditionalRender,  Button, TextOswald } from "../components/basic_components"
import {  useRedirect } from "../hooks"
import { useGetUserData } from "./hooks"
import { gamesButtonSection } from "../../../setting"
import { useErrorHandler } from "./hooks"


const NavbarComponent = styled.nav`
    width: 100vw;
    height: 12vh;
    background-color: #0B1015;

    @media only screen and (max-width: 414px) {
        height: 16vh;
        position: fixed;
        z-index: 11;
    }
`

const Flex = styled.div`
    width: inherit;
    height: inherit;
    display: flex;

    @media only screen and (max-width: 414px) {
        height: 8vh;
    }
`

const LogoPosition = styled.div`
    margin: auto 0vw;
    margin-left: max(13vw, 249.6px);

    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const ProfileInformationPosition = styled.div`
    display: flex;
    margin: auto 3vw auto auto;    
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

const ButtonPosition = styled.div`
    margin: auto 5vw auto auto;
    display: flex;
`

const TextWrapper = styled.div`
    margin: auto 1vw;

    @media only screen and (max-width: 414px) {
        margin: auto 3vw;
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

const GamesButtonsSections = styled.div`
    display: flex;
    margin: auto max(10vw, 192px) auto max(5vw, 96px);

    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const GameIconsPosition = styled.div`
    margin-right: 1.5vw;
    
    &:last-child{
        margin-right: 0vw;
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

const GameIconsMobile = styled.div`

    display: none;

    @media only screen and (max-width: 414px) {
        display: flex;
    }
`

const GameIconsPositionMobile = styled.div`
    margin: auto;
`

const Navbar = (): JSX.Element =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const [redirectPath, redirectUrl] = useRedirect()
    
    const isDataUser = useGetUserData()

    useErrorHandler()
    
    return (<>
      
        <NavbarComponent>

            <Flex>
            
            <LogoPosition>
                <Logo/>
            </LogoPosition>

            <GamesButtonsSections>

                <GameIconsPosition>
                    <GamesButton game="inns" url = {gamesButtonSection.inns} openExternal = {true} ToolTip ="Inns"/>
                </GameIconsPosition>

                <GameIconsPosition>
                    <GamesButton game = "quests" url = {gamesButtonSection.quests} openExternal = {false} ToolTip = "Quests"/>
                </GameIconsPosition>
                
            </GamesButtonsSections>
            

            
            <ConditionalRender condition ={isDataUser == "fulfilled"}>
       
                <PositionRelative>
                    
                    <ProfileInformationPosition>

                    
                            <TokenDisplayerPosition>

                                <ProfileInformationPictureMobile>
                                    <ProfileInformation nick_name={generalSelector.userDataNavBar.data.nickName!} profile_picture_url={generalSelector.userDataNavBar.data.imgLink!}/>
                                </ProfileInformationPictureMobile>

                                <IndividualTokenPosition>
                                    <TokenDisplayer icon="collection_symbols" number = {generalSelector.userDataNavBar.data.amountNFT} />
                                </IndividualTokenPosition>

                                <IndividualTokenPosition>
                                    <TokenDisplayer icon="dragon_silver" number={generalSelector.userDataNavBar.data.DS}  />
                                </IndividualTokenPosition>

                                <IndividualTokenPosition>
                                    <TokenDisplayer icon="dragon_silver_toClaim" number={ "+" + generalSelector.userDataNavBar.data.DSTC}optionalText="Claim" />
                                </IndividualTokenPosition>
                                
                                
                            </TokenDisplayerPosition>
                            
                            <ProfileInformationPicture>
                                <ProfileInformation nick_name={generalSelector.userDataNavBar.data.nickName!} profile_picture_url={generalSelector.userDataNavBar.data.imgLink!}/>
                            </ProfileInformationPicture>

                            <AuthenticationMethodIconPosition>
                                <AuthenticationMethodIcon/>
                            </AuthenticationMethodIconPosition>
                          
                    </ProfileInformationPosition>
                    <LineOrnament/>
                </PositionRelative>

                
            </ConditionalRender>

          
            
            <ConditionalRender condition={isDataUser == "rejected"}>
    
                <ButtonPosition>
                    <TextWrapper>
                        <TextOswald fontsize={0.9} color="#CAC6BE" fontsizeMobile={5} lineHeightMobil = {6}>
                            Join us!
                        </TextOswald>
                    </TextWrapper>
                    
                    <Button action={() => redirectPath("/login") }>Sign Up/In</Button>
                </ButtonPosition>
            </ConditionalRender>
           
            
            </Flex>
           
           <GameIconsMobile>
                <GameIconsPositionMobile>
                    <GamesButton game="inns" url = {gamesButtonSection.inns} openExternal = {true} ToolTip ="Inns" textMobile ="Inns"/>
                </GameIconsPositionMobile>

                <GameIconsPositionMobile>
                    <GamesButton game = "quests" url = {gamesButtonSection.quests} openExternal = {true} ToolTip = "Quests"/>
                </GameIconsPositionMobile>
           </GameIconsMobile>

        </NavbarComponent>
    </>)
}

export default Navbar