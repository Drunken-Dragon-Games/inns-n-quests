import styled from "styled-components"
import { FooterContentComponent, FooterBackgroundComponent, SocialMediaFooter} from "./components/complex"

const Footer = styled.section`
    width: 100%;
    height: 42.396vw;
    max-height: 1085.338px;
    position: relative;
    background-color: #0B1015;
`

const SocialMediaContainer = styled.div`
    position: absolute;
    z-index: 1;
    display: flex;
    width: 100%;
  
    top: -1.7vw;

    @media only screen and (max-width: 414px) {
        top: 30vw;
    }
`

const Center = styled.div`
    margin: auto;
`
const FooterComponent = ():JSX.Element => {
    return (
            <Footer>

                <SocialMediaContainer>
                    <Center>
                        <SocialMediaFooter/>
                    </Center>   
                </SocialMediaContainer>
               
                <FooterBackgroundComponent/>
                <FooterContentComponent/>
            </Footer>
    )
}

export default FooterComponent