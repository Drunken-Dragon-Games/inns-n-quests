import styled from "styled-components"
import { TextOswald } from "../../../../utils/components/basic_components"
import Image from "next/image"

const TextDecorationSeparation = 31

const TavernHeaderContainer = styled.div`
    width: 100%;
    position: relative;

    @media only screen and (max-width: 414px) {
        margin-bottom: 6.039vw
    }
`

const TavernHeaderDecorationLeft = styled.div`
    width: 5.208vw;
    height: 5.208vw;

    position: absolute;
    top: -20%;
    left: ${TextDecorationSeparation}%;

    @media only screen and (max-width: 414px) {
        width: 13vw;
        position: absolute;
        top: -100%;
        left: 3%;
    }
`

const TavernHeaderDecorationRight = styled.div`
    width: 5.208vw;
    height: 5.208vw;

    position: absolute;
    top: -20%;
    right: ${TextDecorationSeparation}%;

    @media only screen and (max-width: 414px) {
        width: 13vw;
        position: absolute;
        top: -100%;
        right: 3%;
    }
`

interface TavernHeader{
    children: string
}

const TavernHeader = ({children}: TavernHeader):JSX.Element => {
    return (<TavernHeaderContainer>
        <TavernHeaderDecorationLeft>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/tavern-header-decoration-l.svg"
                width={1}
                height={1}
                layout="responsive"
            />
        </TavernHeaderDecorationLeft>
        <TextOswald fontsize={3.125} fontsizeMobile={7.5} color="#CAC6BE" textAlign="center">{children}</TextOswald>
        <TavernHeaderDecorationRight>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/tavern-header-decoration-r.svg"
                width={1}
                height={1}
                layout="responsive"
            />
        </TavernHeaderDecorationRight>
    </TavernHeaderContainer>)
}

export default TavernHeader