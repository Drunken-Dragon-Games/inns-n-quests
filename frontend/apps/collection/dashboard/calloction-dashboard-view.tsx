import styled from "styled-components";
import { collectionTransitions } from "../collection-transitions";
import { CollectionFetchingState } from "../collection-state-models";
import { Section } from "../commponents";
import { Button } from "../../utils/components/basic_components";

const StyledButton = styled.button`
    height: 80px;
    margin: 0 5px;
`;

export const DashboardView = ({ status, artType }: {  status: CollectionFetchingState, artType: "miniature" | "splashArt"}) => {
  return (
    <Section title="Dashboard" colums={1}>
            <Button action={() => collectionTransitions.syncCollection()} size="regular"> Sync </Button>
            <Button action={() => collectionTransitions.flipDisplayArtType()} size="regular">
                {artType} 
            </Button>
            {process.env["NEXT_PUBLIC_ENVIROMENT"] === "development" ?
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
  )
}