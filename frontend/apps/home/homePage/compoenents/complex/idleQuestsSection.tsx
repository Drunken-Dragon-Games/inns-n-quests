import styled from "styled-components"
//import TextOswaldStyle from "../../../../utils/components/textOswald"
import IdleQuestsText from "../basic_components/idleQuestsText"
import IdleQuestsImage from "../basic_components/idleQuestsImage"

const IdleQuestsSectionWrapper = styled.section`
    padding: 5vw 10vw 5vw 11.8vw;
    display: flex;
    background-color: #0B1015;

    @media only screen and (max-width: 414px) {
        display: block;
        padding: 5vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-bottom: 6vw;
    }
`

const Center = styled.div`
    width: 100%;
    max-width: 2000px;
    display: flex;
    

    @media only screen and (min-width: 2560px) {
        margin: auto;
    }

`
const IdleQuestsSection = (): JSX.Element => {
    return (<>
        <IdleQuestsSectionWrapper>
            <Center>
                <IdleQuestsText />
                <IdleQuestsImage />
            </Center>
        </IdleQuestsSectionWrapper>
    </>)
}

export default IdleQuestsSection