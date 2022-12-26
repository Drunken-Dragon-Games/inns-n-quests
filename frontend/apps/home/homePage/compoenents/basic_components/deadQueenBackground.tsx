import Image from "next/image"
import styled from "styled-components"

const DeadQueenBackgroundWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background-image: url('/home/dead-queen-background.png');
    background-size: contain;


    @media only screen and (max-width: 414px) {
        background-size: cover;
        height: 120vw;
        background-position: 30% 0%;
        z-index: 0;
    }
`

const DeadQueenBackground = ():JSX.Element => {
    return (<DeadQueenBackgroundWrapper>
    </DeadQueenBackgroundWrapper>)
}

export default DeadQueenBackground