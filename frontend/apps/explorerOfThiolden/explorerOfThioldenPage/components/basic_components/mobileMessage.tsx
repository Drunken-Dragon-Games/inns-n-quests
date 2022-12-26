import styled from "styled-components"
import { TextElMessiri } from "."


const FullScreen = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
`

const CenterContainer = styled.div`
    margin: auto;
`
const MobileMessage = () =>{
    return (<>
        <FullScreen>
                <CenterContainer>
                    <TextElMessiri fontsize={16} color ="white" textAlign="center">Work In Progress</TextElMessiri>
                </CenterContainer>
        </FullScreen>
    </>)
}

export default MobileMessage