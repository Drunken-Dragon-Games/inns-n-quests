import styled from "styled-components";
import { collectionTransitions } from "../collection-transitions";
import { CollectionFetchingState, CollectionWithGameData } from "../collection-state-models";
import { Section } from "../commponents";
import { GamesButton } from "../../utils/navBar/basic_components";
import { gamesButtonSection } from "../../../setting";
import { OswaldFontFamily, colors } from "../../common";
import { Button } from "../commponents/button"
import { useState } from "react";

const DashboardContainer = styled.div`
  width: 10vw;
  @media only screen and (max-width: 768px) {
    width: 95%;
  }
`;


const OpenInnButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 1400px) {
        flex-direction: column;
    }
`

const DashboardMessage = styled.div`
    font-size: 18px;
    text-align: center;
    color: ${colors.textBeige};
    margin-top: 5px;
    ${OswaldFontFamily};
    font-weight: bold;

    img {
      vertical-align: middle; // Align the image vertically in the middle
      margin-left: 5px; // Add some spacing between text and image
  }
`

const Message = styled.div`
    font-size: 20px;
    text-align: center;
    color: ${colors.textBeige};
    margin-top: 20px;
    ${OswaldFontFamily}
`
type ConfirmationProps = {
  title: string,
  message: string, 
  handleConfirmation: () => void, 
  handleCancel: () => void, 
  disabled?: boolean
}

const ConfirmationSection = (props: ConfirmationProps ) => {
  return (
  <Section title="Dashboard" colums={1}>
      <Message>
      {props.title}
      </Message>
      <Message>
        {props.message}
      </Message>
      <Button action={() => props.handleConfirmation()} size="regular" disabled={props.disabled}>
        Confirm
      </Button>
      <Button action={() => props.handleCancel()} size="regular" disabled={props.disabled}>
        Cancel
      </Button>
  </Section>) 
}

export const DashboardView = ({ status, artType, collectionItems, mortalLocked, isSyncing, isMobile, weeklyEranings }: {  status: CollectionFetchingState, artType: "miniature" | "splashArt", collectionItems: CollectionWithGameData, mortalLocked: boolean, isSyncing: boolean, isMobile: boolean, weeklyEranings: number}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationMessage, setconfirmationMessage] = useState("")
  const [confirmationTitle, setconfirmationTitle] = useState("")
  const handleLockClick = () => {
    const itemsAmount = Object.entries(collectionItems).reduce((acc, [_policyName, policyItems]) => 
      acc + policyItems.reduce((acc, item) =>
         acc + Number(item.quantity), 0), 0) || 0
    setconfirmationTitle("Lock new party? ")
    setconfirmationMessage(`${itemsAmount} Adventurers Selected`)
    setShowConfirmation(true)
  }
  const handleConfirmLock = () => {
    collectionTransitions.lockMortalCollection()
    handleCancelLock()
  }
  const handleCancelLock = () => {
    setShowConfirmation(false)
    setconfirmationTitle("")
    setconfirmationMessage("")
  }
  return (
    <DashboardContainer>
    { showConfirmation ?
      <>
      <ConfirmationSection title ={confirmationTitle} message={confirmationMessage} handleConfirmation={handleConfirmLock} handleCancel={handleCancelLock} disabled={mortalLocked}/>
      </>:
      <Section title="Dashboard" colums={isMobile ? 2 : 1}>
            <OpenInnButtonContainer>
                <GamesButton game="inns" url={gamesButtonSection.quests} toolTip="My Inn" />
            </OpenInnButtonContainer>
            <Button action={() => collectionTransitions.syncCollection()} size="regular" disabled={isSyncing}> Sync </Button>
            <Button action={() => collectionTransitions.flipDisplayArtType()} size="regular">
                {artType == "miniature" ? "Splash Art" : "Miniature"} 
            </Button>
            <Button action={() => handleLockClick()} size="regular" disabled={mortalLocked}>
                {mortalLocked ? "Locked" : "Lock"}
            </Button>
            <DashboardMessage>{`Earning Per Week`}</DashboardMessage>
            <DashboardMessage><img src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/icons/dragon_silver_toClaim.svg" alt="DS Logo"/> {`${weeklyEranings}`}</DashboardMessage>
            {process.env["NEXT_PUBLIC_ENVIROMENT"] === "development" && !isMobile?
            <>
            <h2 style={{ color: 'white' }}>{`Grant is ${status.ctype}`}</h2>
            <Button action={() => collectionTransitions.grantTestCollection("Nami")} size="small">
                Faucet Nami
            </Button>
            <Button action={() => collectionTransitions.grantTestCollection("Eternl")} size="small">
                Faucet Eternl
            </Button>
            </>
            : <></>
        }
    </Section>
    }
    </DashboardContainer>
  )
}