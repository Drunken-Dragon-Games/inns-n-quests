import React from 'react'
import styled from 'styled-components'
import { NoDragImage, pct, vw } from '../../../../common'

const CenteredImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
`
const BuySlimeSectionContainer = styled.div`

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
        <CenteredImage
            src="https://cdn.ddu.gg/modules/ddu-app/home/slime-pfp-promo.gif"
            alt="Slime pfp promo gif"
        />

      <CenteredImage
        src="https://saturn-production.nyc3.digitaloceanspaces.com/Payment/Buttons/SaturnPayment323.png"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    </BuySlimeSectionContainer>
  )
}

export default BuySlimeSection
