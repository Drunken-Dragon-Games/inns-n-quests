import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { OswaldFontFamily } from "../../common-components"
import { AvailableQuest } from "../../dsl"
import DragonSilverDisplay from "./components/dragon-silver-display"
import InventoryPage, { PageName } from "./components/inventory-page"
import { InventoryItem } from "./inventory-dsl"
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

const InventoryBrowserContainer = styled.div`
    height: 100%;
    width: 36vmax;
    display: flex;
    flex-direction: column;
`

const InventoryTabsContainer = styled.div`
    height: 5%;
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const InventoryTab = styled.div<{ selected: boolean }>`
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    font-size: 1vmax;
    justify-content: center;
    cursor: pointer;
    color: ${props => props.selected ? "white" : "rgba(20,20,20,1)"};
    filter: ${props => props.selected ? "drop-shadow(0px 0px 5px white)" : "none"};
    border-bottom: ${props => props.selected ? "2px solid white" : "2px solid rgba(20,20,20,0.9)"};
    ${OswaldFontFamily}
`

const InventoryPagesContainer = styled.div`
    height: 95%;
    width: 100%;
`

const InventoryBrowser = ({ inventoryState, onItemClick }: { inventoryState: InventoryState, onItemClick: (item: InventoryItem) => void }) => {
    const [page, setPage] = useState<PageName>("adventurers")
    return (
        <InventoryBrowserContainer>
            <InventoryTabsContainer>
                <InventoryTab onClick={() => setPage("adventurers")} selected={page === "adventurers"}><span>Adventurers</span></InventoryTab>
                <InventoryTab onClick={() => setPage("taken-quests")} selected={page === "taken-quests"}><span>Taken Quests</span></InventoryTab>
            </InventoryTabsContainer>
            <InventoryPagesContainer>
                <InventoryPage inventoryState={inventoryState} page={page} onItemClick={onItemClick} />
            </InventoryPagesContainer>
        </InventoryBrowserContainer>
    )
}

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