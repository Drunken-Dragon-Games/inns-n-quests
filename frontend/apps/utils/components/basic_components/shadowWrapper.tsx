
import styled from "styled-components"


const ShadowWrapperComponent = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(4, 4, 4 ,0.6);
    top: 0vw;
    left: 0vw;
    z-index: 5;
    display: flex;
`

const Center = styled.div`
    margin: auto;
`

interface ShadowWrapper{
    children: JSX.Element | JSX.Element
}

const ShadowWrapper = ({ children } : ShadowWrapper) : JSX.Element => {
    return (<>
        <ShadowWrapperComponent>
            <Center>
                {children}
            </Center>
        </ShadowWrapperComponent>
    
    </>)
}

export default ShadowWrapper