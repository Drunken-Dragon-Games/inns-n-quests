import styled from "styled-components";
import { collectionTransitions } from "../collection-transitions";
import { CollectionFetchingState } from "../collection-state-models";
import { Section } from "../commponents";
import { GamesButton } from "../../utils/navBar/basic_components";
import { gamesButtonSection } from "../../../setting";
import { OswaldFontFamily, colors } from "../../common";
import { Button } from "../commponents/button"

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

export const DashboardView = ({ status, artType, mortalLocked, isSyncing, isMobile, weeklyEranings }: {  status: CollectionFetchingState, artType: "miniature" | "splashArt", mortalLocked: boolean, isSyncing: boolean, isMobile: boolean, weeklyEranings: number}) => {
  return (
    <DashboardContainer>
    <Section title="Dashboard" colums={isMobile ? 2 : 1}>
            <OpenInnButtonContainer>
                <GamesButton game="inns" url={gamesButtonSection.quests} toolTip="My Inn" />
            </OpenInnButtonContainer>
            <Button action={() => collectionTransitions.syncCollection()} size="regular" disabled={isSyncing}> Sync </Button>
            <Button action={() => collectionTransitions.flipDisplayArtType()} size="regular">
                {artType == "miniature" ? "Splash Art" : "Miniature"} 
            </Button>
            <Button action={() => collectionTransitions.lockMortalCollection()} size="regular" disabled={mortalLocked}>
                {mortalLocked ? "Locked" : "Lock"}
            </Button>
            <DashboardMessage>{`Earning Per Week`}</DashboardMessage>
            <DashboardMessage><img src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/icons/dragon_silver_toClaim.svg" alt="DS Logo"/> {`${weeklyEranings}`}</DashboardMessage>
            {process.env["NEXT_PUBLIC_ENVIROMENT"] === "development" && !isMobile && false ?
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
    </DashboardContainer>
  )
}