import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import { Provider } from "react-redux"
import { StoreStore } from "./store-state"
import styled from "styled-components"
import { useEffect, useState } from "react"
import { AotOrderView } from "./order/store-aot-order-view"

const Container = styled.div<{ isMobile: boolean }>`
  width: 100vw;
  position: relative;
  margin-left: ${(props) => (props.isMobile ? "15px" : "105px")};
  margin-bottom: 75px;
  min-height: ${(props) => (props.isMobile ? "auto" : "850px")};
  display: block;
  ${(props) => (props.isMobile ? "padding-top: 16vh;" : "")}
`;

const StoreComponent = () => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
      setIsMobile(window.innerWidth <= 768)
      const handleResize = () => setIsMobile(window.innerWidth <= 768)
      window.addEventListener("resize", handleResize)
      return () => {window.removeEventListener("resize", handleResize)}
    }, [])
    return (
        <Container isMobile={isMobile}>
            <AotOrderView/>
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