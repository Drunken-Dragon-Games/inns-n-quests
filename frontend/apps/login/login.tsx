import styled from 'styled-components';
import Image from 'next/image';
import { LoginButton } from './components';
import { TitleElMessiri, TextElMessiri } from '../utils/components/basic_components';
import { useRedirect} from '../utils/hooks';
import { useRedirectRoute } from './hooks';
import { selectLoginPageReducer } from './features/appLogin';
import { useLoginDispatch, useLoginSelector } from './features/hooks';
import { connectNami, connectEternl, walletConnection} from './features/walletsConnect';
import { handleDiscordAuth } from './features/discordConnect';
import { useRedirectLogin } from './hooks';
 
 const LogInWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    background-color: #0B1015;
    background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/texture.svg");
    z-index: 0;
`


const OrnamentImage = styled.div`
    width: 16vw;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;

    @media only screen and (max-width: 414px) {
        width: 50vw;
    }
`

const LogoImage = styled.div`
    width: 15vw;
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);

    
    @media only screen and (max-width: 414px) {
        width: 60vw;
        
    }
`

const ButtonSection = styled.section`
    margin: auto;
    z-index: 2;
    h1{
        margin-bottom: 1vw;

        @media only screen and (max-width: 414px) {
            margin-bottom: 5vw;
        }
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 0.5vw;
    margin-top: 5vw;
    
    & > div{
        margin-right: 2vw;

        @media only screen and (max-width: 414px) {
            margin-top: 12vw;
            margin-right: 5vw;
            margin-bottom: 1vw;
        }

        &: last-child{
            margin-right: 0vw;
        }
    }

`

const ErrorWrapper = styled.div`

    width: 50vw;

    @media only screen and (max-width: 414px) {
        width: 70vw;
    }
`

const LoginApp = (): JSX.Element =>{

    const LoginDispatch = useLoginDispatch()


    const loginSelector = useLoginSelector(selectLoginPageReducer)
    
    const walletError = loginSelector.wallet.connectWalletStatus.error
    
    const [ redirectPath, redirectUrl ] = useRedirect()

    const route = useRedirectRoute()

    useRedirectLogin(route)

    return (
        <>
            <LogInWrapper>

                <ButtonSection>
                   
                    <ButtonWrapper>
                        <LoginButton action={() => redirectUrl(handleDiscordAuth())} buttonType='discord'/>
                        <LoginButton  action={() => LoginDispatch(walletConnection("nami"))} buttonType='nami' reverse={true}/>
                        <LoginButton action={() => LoginDispatch(walletConnection("eternl"))} buttonType='eternl'/>
                    </ButtonWrapper>

                    <TitleElMessiri 
                        fontsize={2.5} 
                        color="#CA9F44" 
                        textAlign='center' 
                        fontsizeMobile={9} 
                        lineHeightMobil={10}
                        textAlignMobile="center" 
                    >Sign Up/In</TitleElMessiri>


                    <ErrorWrapper>
                        <TextElMessiri 
                            fontsize={1.2} 
                            color="#CAC6BE" 
                            textAlign='center'
                            fontsizeMobile={4} 
                            lineHeightMobil={5}
                            textAlignMobile="center" 
                        >
                            {typeof walletError != "string"  ? "" : walletError}
                        </TextElMessiri>
                    </ErrorWrapper>
                    

                </ButtonSection>


                <OrnamentImage>
                    <Image 
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/decorative_shape.svg"
                        alt="ornament drunken dragon" 
                        width={400} 
                        height={800} 
                        priority
                        layout = "responsive"
                    />
                </OrnamentImage>

                <LogoImage>
                    <Image 
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/login/logo.svg"
                        alt="ornament drunken dragon" 
                        width={400} 
                        height={100} 
                        priority
                        layout = "responsive"
                    />
                </LogoImage>
            

            </LogInWrapper>
        </>
    )
    }


export default LoginApp