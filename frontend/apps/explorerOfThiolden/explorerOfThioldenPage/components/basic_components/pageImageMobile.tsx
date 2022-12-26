import styled from "styled-components"
import Image from "next/image"
import { useDispatch } from "react-redux"
// import { setPage } from "../../features/generalState"

interface pageWrapperAnimation{
    isActive: boolean
}

const PageWrapperAnimation = styled.div<pageWrapperAnimation>`
    position: fixed;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100vw;
    min-height: 100vh;
    z-index: 13;
    background-color: #090E14;
    opacity: ${props => props.isActive ? "1": "0"};
    visibility: ${props => props.isActive ? "visible": "hidden"};
    transition: opacity 0.8s, visibility 0.8s;
    
`

const CloseWrapper = styled.div`
    width: 10vw;
    height: 10vw;
    cursor: pointer;
    position: absolute;
    top: 7.8vw;
    right: 10vw;
    z-index: 2;
`

interface pageContainer{
    width: number
    height: number
}

const PageContainer = styled.div<pageContainer>`
    margin: auto;
    width: ${props => props.width}vw;
    height: ${props => props.height}vw;
`

interface PageImageMobile {
    children: JSX.Element
    isActive: boolean
    width: number
    height: number
}
const PageImageMobile = ({children, isActive, width,  height} : PageImageMobile ) =>{

    const dispatch = useDispatch()

    return (<>
         {/* <PageWrapperAnimation isActive={isActive} >
            <CloseWrapper onClick = {() => dispatch(setPage("none"))}>
                <Image 
                    src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/icons/close_button.svg" 
                    alt = "Drunken dragon cerrar logo"   
                    layout = "responsive" 
                    width={100} 
                    height={100}
                    priority
                />
            </CloseWrapper>

            <PageContainer width={width} height ={height}>
                {children}
            </PageContainer>
         </PageWrapperAnimation> */}
    </>)
}

export default PageImageMobile