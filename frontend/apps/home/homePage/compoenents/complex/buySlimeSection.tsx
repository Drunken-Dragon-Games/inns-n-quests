import React from 'react'
import styled from 'styled-components'
import { NoDragImage, pct, vw } from '../../../../common'
import { TextOswald } from '../../../../utils/components/basic_components'
import Image from "next/image"

const BuySlimeSectionContainer = styled.div`
    position: relative;
    margin-bottom: 10vw;

    @media only screen and (max-width: 414px) {
        display: block;
        padding: 5vw;
        margin-bottom: 20vw;
    }

    @media only screen and (min-width: 2560px) {
        padding: 0vw;
    }
`

const HeaderContainer = styled.div`
    margin-bottom: 2vw;
    @media only screen and (max-width: 414px) {
        margin-bottom: 8.083vw;
    }
`

const SlimesImageWrapper = styled.div`
    width: 80%;
    margin: auto;
    border-radius: 20px;
    overflow: hidden;
    max-width: 500px;

    @media only screen and (max-width: 414px) {
        width: 95%;
    }

    @media only screen and (min-width: 2560px) {
    }
`

const BuyButtonWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: calc(50% - 144px);

    @media only screen and (max-width: 414px) {

    }
`

const BuySlimeSection = (): JSX.Element => {
    const policyId = "519592d1-0c0e-4203-b296-2280c93adecc"
    const handleClick = () => {
        if (window.top) {
            // Popup width and height
            const popupWidth = 500;
            const popupHeight = 700;

            // Open popup in center of screen
            const top = window.top.outerHeight / 2 + window.top.screenY - popupHeight / 2;
            const left = window.top.outerWidth / 2 + window.top.screenX - popupWidth / 2;

            // Open the Saturn Payment Gateway popup
            const url = "https://saturnnft.io/mint/" + policyId;
            const popup = window.open(
                url,
                "Saturn Payment Gateway",
                `popup=1, location=1, width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`,
            )
        }
    }

    return (
        <BuySlimeSectionContainer>
            <HeaderContainer>
                <TextOswald fontsize={3.125} fontsizeMobile={7.5} color="#CAC6BE" textAlign="center">USE DRAGON SILVER TO ADOPT A SLIME</TextOswald>
            </HeaderContainer>

            <SlimesImageWrapper>
                <Image
                    src="https://cdn.ddu.gg/modules/ddu-app/home/slime-pfp-promo.gif"
                    width={1}
                    height={1}
                    alt="Slime pfp promo gif"
                    layout="responsive"
                />
            </SlimesImageWrapper>

            <BuyButtonWrapper>
                <img
                    src="https://saturn-production.nyc3.digitaloceanspaces.com/Payment/Buttons/SaturnPayment323.png"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                />
            </BuyButtonWrapper>

        </BuySlimeSectionContainer>
    )
}

export default BuySlimeSection
