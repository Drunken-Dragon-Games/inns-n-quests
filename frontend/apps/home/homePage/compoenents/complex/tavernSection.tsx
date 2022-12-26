import styled from "styled-components"
import TavernHeader from "../basic_components/tavernHeaderComponent"
import TavernContent from "../basic_components/tavernContent"

const TavernSectionContainer = styled.section`
    padding: 5vw 10vw 5vw 11.8vw;
    background-color: #0B1015;

    @media only screen and (max-width: 414px) {
        margin-bottom: 16.908vw;
        padding: 5vw;
    }
`


const Center = styled.div`
    width: 100%;
    max-width: 2000px;    

    @media only screen and (min-width: 2560px) {
        margin: auto;
    }

`

const TavernSection = ():JSX.Element => {
    return (<TavernSectionContainer>
        <Center>
            <TavernHeader>OWN A TAVERN</TavernHeader>
            <TavernContent/>
        </Center>
    </TavernSectionContainer>)
}

export default TavernSection