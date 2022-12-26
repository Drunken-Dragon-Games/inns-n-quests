import styled from "styled-components"
import { gamesButtonSection } from "../../../../../setting"
import { TextElMessiri, TextOswald, SimpleButton, LinkDisable } from "../../../../utils/components/basic_components"
import Image from "next/image"


const IdleQuestsTextComponent = styled.div`
    display: block;
    width: 45%;
    position: relative;
    p {
        margin-bottom: 2.5vw;
    }
    p:first-child {
        margin-bottom: 0vw;
    }
    p:last-child {
        margin-bottom: 0;
    }
    

    @media only screen and (max-width: 414px) {
        width: 100%;
        margin-bottom: 30px;
    }

    @media only screen and (min-width: 2560px) {
        p {
            margin-bottom: 2vw;
        }
        p:first-child {
            margin-bottom: 0vw;
        }
        p:last-child {
            margin-bottom: 0;
        }
    }
`

const IdleQuestsTextWrapper = styled.div`
    display: block;
    position: relative;
    top: 35%;
    transform: translateY(-50%);

    margin: auto;
    @media only screen and (max-width: 414px) {
        position: static;
        top: 0;
        transform: none;
    }
`
const ImageWrapper = styled.div`
    img {
        top: 6.250vw !important;
    }

    @media only screen and (max-width: 414px) {
        img {
            top: 15vw !important;
        }
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;

    @media only screen and (max-width: 414px) {
        margin: 10vw 0vw;
    }
`

const Center = styled.div`
    margin: auto;
`

const IdleQuestsText = ():JSX.Element => {
    return (<IdleQuestsTextComponent>
        <IdleQuestsTextWrapper>  
            <ImageWrapper>
                <Image
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/text-decoration.svg"
                    width={3}
                    height={1}
                    layout="responsive"
                />
            </ImageWrapper>          
      
            <TextOswald children={"ADVENTURE AWAITS"} fontsize={2.656} color={"white"} textAlign="center" fontsizeMobile={5} lineHeightMobil={5.5}/>
            <TextElMessiri children={"Choose your best adventurers"} fontsize={2.188} color={"#CAC6BE"} textAlign="center" fontsizeMobile={5} lineHeightMobil={5.5}/>
            <TextElMessiri children={"Send them into quests"} fontsize={2.188} color={"#CAC6BE"} textAlign="center" fontsizeMobile={5} lineHeightMobil={5.5}/>
            <TextElMessiri children={"Gain Dragon Silver!"} fontsize={2.188} color={"#CAC6BE"} textAlign="center" fontsizeMobile={5} lineHeightMobil={5.5}/>  
            <ButtonWrapper>
                <Center>
                    <LinkDisable url={gamesButtonSection.quests} openExternal ={true}>
                        <SimpleButton action = {() => null}>Open Quest Board</SimpleButton>
                    </LinkDisable>
                </Center>
            </ButtonWrapper>          
        </IdleQuestsTextWrapper>
    </IdleQuestsTextComponent>)
}

export default IdleQuestsText