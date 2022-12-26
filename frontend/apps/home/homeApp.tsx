import styled from "styled-components"
import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import HomePage from "./homePage/homePage"
import Footer from "../utils/footer/footer"

const HomeComponent = styled.div`
    width: 100vw;
`


const HomeApp = () =>{
    return (<>
            <HomeComponent>
                <LateralBar/>
                <NavBarApp/>
                <HomePage/>
                <Footer/>
            </HomeComponent>
    </>)
}

export default HomeApp