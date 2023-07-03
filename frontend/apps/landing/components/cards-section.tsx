import Image from "next/image"
import styled, { css, keyframes } from "styled-components"
import { LandingPageSection } from "./common"
import { useState } from "react"
import { OswaldFontFamily, colors } from "../../common"
import LandingButton from "./landing-button"

const hoverAnimation = keyframes`
    0% {
        transform: scale(1);
        filter: drop-shadow(0px 0px 10px black);
    }
    100% {
        transform: scale(1.1);
        filter: drop-shadow(5px 5px 15px ${colors.dduGold});
    }
`

const hoverOutAnimation = keyframes`
    0% {
        transform: scale(1.1);
        filter: drop-shadow(5px 5px 15px ${colors.dduGold});
    }
    100% {
        transform: scale(1);
        filter: drop-shadow(0px 0px 10px black);
    }
`

const CardContainer = styled.div`
    height: 267px;
    width: 200px;
    filter: drop-shadow(0px 0px 10px black);
    cursor: pointer;
    animation: ${hoverOutAnimation} 200ms ease-in-out;
    perspective: 1000px;

    &:hover {
        animation: ${hoverAnimation} 200ms ease-in-out;
        transform: scale(1.1);
        filter: drop-shadow(5px 5px 15px ${colors.dduGold});
        z-index: 10;
    }
`

const CardInner = styled.div<{ isClicked: boolean }>`
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: 800ms ease-in-out;
    transform-style: preserve-3d;

    ${ props => !props.isClicked && "transform: rotateY(0.5turn);" }
    &:hover {
        #transform: rotateY(0.5turn);
    }
`

const CardFace = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
    transition: 800ms ease-in-out;
    border-radius: 3px;
    overflow: hidden;
`

const CardBack = styled.div`
    ${CardFace}
    transform: rotateY(0.5turn);

`

const CardFront = styled.div`
    ${CardFace}
`

const Card = (props: { card: string }) => {
    const [isClicked, setIsClicked] = useState(false)
    return <CardContainer onClick={() => setIsClicked(!isClicked)}>
        <CardInner isClicked={isClicked}>
            <CardBack>
                <Image
                    src="https://cdn.ddu.gg/modules/ddu-app/s2Explorer/placeholder/placeholder.png"
                    alt="card drunken dragon"
                    width={200}
                    height={267}
                    priority
                />
            </CardBack>
            <CardFront>
                <Image
                    src={`https://cdn.ddu.gg/adv-of-thiolden/web/${props.card}.webp`}
                    alt={props.card}
                    width={200}
                    height={267}
                    priority
                />
            </CardFront>
        </CardInner>
    </CardContainer>
}

const CardsSectionContainer = styled(LandingPageSection)`
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    border: 1px solid #243444;
    background-image: url(/landing/section-cards.png);
    background-size: cover;
    background-position: center;
`

const CardWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`

const TitleWrapper = styled.div`
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;

    h2 {
        ${OswaldFontFamily}
        font-size: 40px;
        color: white;
        text-align: right;
    }
`

const CardsSection = () =>
    <CardsSectionContainer>
        <CardWrapper>
            <Card card="gadrull_23_0" />
            <Card card="mili_29_0" />
            <Card card="filgrald_20_0" />
            <Card card="dethiol_30_0" />
        </CardWrapper>
        <TitleWrapper>
            <h2>Collect Digital Cards And Build Your Party</h2>
            <LandingButton href="" target="_blank">Buy Cards</LandingButton>
        </TitleWrapper>
    </CardsSectionContainer>

export default CardsSection
