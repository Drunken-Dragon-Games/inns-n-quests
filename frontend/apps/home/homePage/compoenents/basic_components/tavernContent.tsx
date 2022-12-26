import styled from "styled-components"
import HomeButtonComponent from "../../../../utils/components/homeButton"
import Image from "next/image"
import { TextElMessiri, SimpleButton, LinkDisable } from "../../../../utils/components/basic_components"

const TavernContentContainer = styled.div`
    position: relative;
`

const TavernImageContainer = styled.div`
    width: 80%;
    margin: auto;
    margin-bottom: 2.604vw;
    padding-top: 2vw;

    @media only screen and (max-width: 414px) {
        width: 95%;
        padding-top: 3.5vw;

    }

    @media only screen and (min-width: 2560px) {
        padding-top: 60px;
    }
`

const TavernImageOutline = styled.div`
    width: 82%;
    position: absolute;
    top: 0.5vw;
    left: 50%;
    transform: translateX(-50%);

    @media only screen and (max-width: 414px) {
        width: 100%;
        position: absolute;
        top: 0.5vw;
    }
`

const TavernTextContainer = styled.div`
    position: absolute;
    top: 40%;
    right: 0;
    transform: translateY(-50%);
    background-color: rgba(9, 9, 9, 0.7);
    box-shadow: 0 0 4.831vw 2.415vw #090909cc;
    padding: 0.781vw;

    @media only screen and (max-width: 414px) {
        position: static;
        width: fit-content;
        margin: auto;
        box-shadow: none;
        background-color: transparent;
        margin-top: 13.285vw;
        margin-bottom: -3.623vw
    }
`

const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;

    
    @media only screen and (max-width: 414px) {
        margin: 0vw 0vw 1vw 0vw;
    }
`

const Center = styled.div`
    margin: auto;
`

const TavernContent = ():JSX.Element => {
    return (<TavernContentContainer>
        <TavernImageOutline>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/tavern-outline.svg"
                width={7}
                height={4}
                layout="responsive"
            />
        </TavernImageOutline>
        <TavernImageContainer>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/tavern.webp"
                width={7.5}
                height={4}
                layout="responsive"
            />
        </TavernImageContainer>
        <TavernTextContainer>
            <TextElMessiri fontsize={2} color="white" textAlignMobile="center" fontsizeMobile={5} lineHeightMobil={5.5}>Place furniture</TextElMessiri>
            <TextElMessiri fontsize={2} color="white" textAlignMobile="center" fontsizeMobile={5} lineHeightMobil={5.5}>Gather your adventurers</TextElMessiri>
            <TextElMessiri fontsize={2} color="white" textAlignMobile="center" fontsizeMobile={5} lineHeightMobil={5.5}>Customize your new home</TextElMessiri>
        </TavernTextContainer>

        <ButtonWrapper>
            <Center>
                <LinkDisable url="https://drunken-dragon-games.itch.io/drunken-dragon-inns-n-quests" openExternal = {true}>
                    <SimpleButton action={() => null}>Open your Inn</SimpleButton>
                </LinkDisable>
            </Center>   
        </ButtonWrapper>
       
    </TavernContentContainer>)
}

export default TavernContent