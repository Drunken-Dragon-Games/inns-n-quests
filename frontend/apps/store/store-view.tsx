import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import { Provider } from "react-redux"
import { StoreStore } from "./store-state"
import styled from "styled-components"
import { useState } from "react"

const Container = styled.div<{ isMobile: boolean }>`
  width: 100vw;
  position: relative;
  margin-left: ${(props) => (props.isMobile ? "15px" : "105px")};
  margin-bottom: 75px;
  min-height: ${(props) => (props.isMobile ? "auto" : "850px")};
  display: ${(props) => (props.isMobile ? "block" : "grid")};
  grid-template-columns: ${(props) => (props.isMobile ? "none" : "11vw 1fr")};
  ${(props) => (props.isMobile ? "padding-top: 16vh;" : "")}
`;

const StoreComponent = () => {
    const [isMobile, setIsMobile] = useState(false)
    return (
        <Container isMobile={isMobile}>
            <h1>Store</h1>
        </Container>)
}

const StoreView = ():JSX.Element =>{ 
    
    return(
    <>   
      <LateralBar/>
      <NavBarApp/>
      <Provider store={StoreStore}>
          <StoreComponent/>
      </Provider>
      <Footer/>
    </>)
}

export default StoreView