import styled, { keyframes } from "styled-components"
import { AvailableQuest } from "../../dsl"
import DragonSilverDisplay from "./components/dragon-silver-display"
import InventoryBrowser from "./components/inventory-browser"
import { InventoryState } from "./inventory-state"
import { InventoryTransitions } from "./inventory-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const InventoryContainer =styled.div<{ open: boolean }>`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(20,20,20,0.5);
    backdrop-filter: blur(5px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const Header = styled(DragonSilverDisplay)`
    height: 5%;
`

const InventoryBody = styled.div<{ open: boolean }>`
    height: 95%;
    width: 100%;
    display: flex;
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const ActivityContainer = styled.div`
    box-sizing: border-box;
    padding: 2vw;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

interface InventoryProps {
    className?: string,
    children?: React.ReactNode,
    dragonSilver: number,
    dragonSilverToClaim: number,
    inventoryState: InventoryState,
    inventoryTransitions: InventoryTransitions,
    onCloseAvailableQuest: (availableQuest: AvailableQuest) => void
}

const InventoryView = (props: InventoryProps) => {
    //const [page, setPage] = useState<TabNames>("inventory")
    return(
        <InventoryContainer className={props.className} open={props.inventoryState.open}>
            <Header
                dragonSilver={props.dragonSilver}
                dragonSilverToClaim={props.dragonSilverToClaim}
                onClickClose={props.inventoryTransitions.onToggleInventory}
                onAdventurerRecruit={props.inventoryTransitions.onRecruitAdventurer}
            />
            <InventoryBody open={props.inventoryState.open}>
                <InventoryBrowser 
                    inventoryState={props.inventoryState}
                    onItemClick={props.inventoryTransitions.onItemClick}
                />
                <ActivityContainer>
                    {props.children}
                </ActivityContainer>
            </InventoryBody>
        </InventoryContainer>
    )
}

export default InventoryView