import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri } from "../../../components/basic_components"


const FooterContent = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
`

const FooterImageContainer = styled.div`
    width: 15.625vw;
    height: 15.625vw;
    max-width: 400px;
    max-height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    @media only screen and (max-width: 414px) {
        width: 30%;
        height: auto;
        top: 0;
    }
`

const FooterTextContainer = styled.div`
    position: absolute;
    bottom: 13%;
    left: 50%;
    transform: translateX(-50%);

    @media only screen and (max-width: 414px) {
        width: 100%;
        bottom: 45%
    }    
`

const FooterContentComponent = ():JSX.Element => {
    return (<FooterContent>
        <FooterImageContainer>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/drunken-dragon-coin.png"
                width={1}
                height={1}
                layout="responsive"
            />
        </FooterImageContainer>
        <FooterTextContainer>
            <TextElMessiri textAlign="center" fontsize={1} color="white" fontsizeMobile={2.5}>Drunken Dragon Entertainment (c) 2022 | All rights reserved</TextElMessiri>
        </FooterTextContainer>
    </FooterContent>)
}

export default FooterContentComponent