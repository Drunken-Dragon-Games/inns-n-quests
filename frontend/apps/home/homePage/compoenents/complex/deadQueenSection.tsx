import styled from "styled-components"
import DeadQueenBackground from "../basic_components/deadQueenBackground"
import DeadQueenVideo from "../basic_components/deadQueenVideo"
import { SimpleButton, LinkDisable } from "../../../../utils/components/basic_components"

const DeadQueenSectionWrapper = styled.div`
    padding: 5vw 10vw 5vw 11.8vw;
    display: flex;
    height: 100%;
    max-width: 2560px;
    position: relative;
    margin: auto;

    @media only screen and (max-width: 414px) {
        display: block;
        padding: 10vw 5vw 39vw 5vw;
    }
`

const DeadQueenSectionContainer = styled.section`
    width: 100%;
    position: relative;
    margin-top: 0vw;
    height: 57vw;
    max-height: 1459.2px;

    @media only screen and (max-width: 414px) {
        height: 120vw;
    }
`
const DeadQueenButtonContainer = styled.div`
    position: absolute;
    top: 40%;
    right: 5%;


    @media only screen and (max-width: 414px) {
        position: static;
        top: -10vw;
        width: fit-content;
        margin: auto;
    }
`

const MarginButton = styled.div`
    margin-bottom: 2vw;
    &:last-child{
        margin-bottom: 0vw;
    }

    @media only screen and (max-width: 414px) {
        margin-bottom: 5vw;
        &:last-child{
            margin-bottom: 0vw;
        }
    }
`

const DeadQueenSection = ():JSX.Element => {
    return (
        <DeadQueenSectionContainer>
            <DeadQueenBackground/>
            <DeadQueenSectionWrapper>

                <DeadQueenVideo/>

                <DeadQueenButtonContainer>
                    
                    <MarginButton>
                        <LinkDisable url="https://encyclopedia.drunkendragon.games/" openExternal={true}>
                            <SimpleButton action = {() => null}>Learn More</SimpleButton>
                        </LinkDisable>
                    </MarginButton>
                    <LinkDisable url="https://s2.drunkendragon.games/" openExternal={true}>
                        <SimpleButton action = {() => null}>Explore Collection</SimpleButton>
                    </LinkDisable>
                    
                </DeadQueenButtonContainer>
                
            </DeadQueenSectionWrapper>
        </DeadQueenSectionContainer>)
}

export default DeadQueenSection