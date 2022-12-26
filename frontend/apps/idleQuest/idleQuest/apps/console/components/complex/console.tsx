import styled from "styled-components";
import Image from 'next/image'
import { QuestButtonsContainer, Navbar, Pages } from "./"

const AdventuresConsoleContainer =styled.div`
    width: 15%;
    height: 100vh;
    background-color: #14212C;
    z-index: 0;
    position: relative;
`
interface IProps_adventureConsole {
    children:  JSX.Element [] | JSX.Element,
}

const ImageWrapper = styled.div`
    position: absolute;
    z-index: -1;
    display: flex;
    width: 100%;
    height: 100%;

    div{
        margin: auto;
    }

    img{
        width: 16vw !important;
        height: 36vw !important;
    }
`
const PaddingVertical = styled.div`
    padding: 0vw 0px 2vw 0vw;
`

const Console = (): JSX.Element =>{
    return(<>
        <AdventuresConsoleContainer>

            <ImageWrapper>
                <div>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/adventurers_console.png"  alt="ornament" width={300} height={700} />
                </div>
            </ImageWrapper>

            <PaddingVertical>
                <Navbar/>
                <QuestButtonsContainer/>
                <Pages/>
            </PaddingVertical>
            
        </AdventuresConsoleContainer>
    </>)
}

export default Console